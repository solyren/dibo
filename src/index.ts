import makeWASocket, { DisconnectReason, useMultiFileAuthState, fetchLatestBaileysVersion, makeInMemoryStore } from 'baileys-mod';
import type { Boom } from '@hapi/boom';
import pino from 'pino';
import { handleCommand } from './handlers/commandHandler';
import { db } from './services/database';

// -- Message store untuk caching --
const store = makeInMemoryStore({
  logger: pino().child({ level: 'silent', stream: 'store' }),
});

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
    getMessage: async (key) => {
      if (store) {
        const msg = await store.loadMessage(key.remoteJid, key.id);
        return msg?.message || undefined;
      }
      return undefined;
    },
  });

  // Bind store ke socket untuk auto-sync messages
  store.bind(sock.ev);

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('messages.upsert', async ({ messages }) => {
    try {
      for (const msg of messages) {
        // Skip messages from bot itself
        if (msg.key.fromMe) {continue;}

        // Handle interactive button response
        if (msg.message?.interactiveResponseMessage) {
          const buttonResponse = msg.message.interactiveResponseMessage;
          const buttonId = buttonResponse.nativeFlowResponseMessage?.paramsJson;

          if (buttonId) {
            try {
              const parsedResponse = JSON.parse(buttonId);
              const commandText = parsedResponse.id;

              // Create a synthetic message for command handling
              const syntheticMsg = {
                ...msg,
                message: {
                  conversation: commandText,
                },
              };

              await handleCommand(sock, syntheticMsg);
            } catch (parseError) {
              console.error('❌ Error parsing button response:', parseError);
            }
          }
          continue;
        }

        // Only process if there's actual message content (conversation or extended)
        const hasText = msg.message?.conversation || msg.message?.extendedTextMessage?.text;
        if (!hasText) {continue;}

        await handleCommand(sock, msg);
      }
    } catch (error) {
      console.error('❌ Error processing message:', error);
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
