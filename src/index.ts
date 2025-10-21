import makeWASocket, { DisconnectReason, useMultiFileAuthState, fetchLatestBaileysVersion } from 'baileys-mod';
import { Boom } from '@hapi/boom';
import pino from 'pino';
import { handleCommand } from './handlers/commandHandler';
import { db } from './services/database';

// -- startBot --
const startBot = async (): Promise<void> => {
  db.initialize();
  
  const { state, saveCreds } = await useMultiFileAuthState('auth_info');
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: false,
    logger: pino({ level: 'silent' }),
    browser: ['Ubuntu', 'Chrome', '22.04.2'],
    generateHighQualityLinkPreview: true,
    syncFullHistory: false,
    markOnlineOnConnect: true,
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('group-participants.update', async (update) => {
    console.log('👥 Group participants update:', update);
  });

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    const msg = messages[0];
    console.log('📨 Message received:', JSON.stringify(msg, null, 2));
    console.log('From me:', msg.key.fromMe);
    console.log('Has message:', !!msg.message);
    console.log('Message type:', type);
    
    if (!msg.key.fromMe) {
      if (msg.message) {
        console.log('✅ Processing message...');
        await handleCommand(sock, msg);
      } else if (msg.messageStubType) {
        const isGroup = msg.key.remoteJid?.endsWith('@g.us');
        console.log('⚠️ Message encryption error detected!');
        console.log(`Group: ${isGroup ? 'Yes' : 'No'}`);
        console.log('Stub type:', msg.messageStubType);
        console.log('Error:', msg.messageStubParameters?.[0]);
        
        if (isGroup) {
          console.log('\n🔧 FIX: Bot needs to re-join the group to fix encryption keys');
          console.log('   1. Remove bot from group');
          console.log('   2. Wait 30 seconds');
          console.log('   3. Add bot back to group\n');
        }
      }
    }
  });

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
      
      if (shouldReconnect) {
        console.log('Connection closed, reconnecting...');
        startBot();
      } else {
        console.log('Connection closed. Logged out.');
        process.exit(0);
      }
    } else if (connection === 'open') {
      console.log('Bot is running!');
    }
  });
};

startBot();
