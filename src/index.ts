import makeWASocket, { DisconnectReason, useMultiFileAuthState, fetchLatestBaileysVersion } from '@whiskeysockets/baileys';
import type { Boom } from '@hapi/boom';
import pino from 'pino';
import { handleCommand } from './handlers/commandHandler';
import { db } from './services/database';
import NodeCache from 'node-cache';

const groupCache = new NodeCache({ stdTTL: 5 * 60, useClones: false });
const processedMessages = new Set<string>();

let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 10;
const BASE_RECONNECT_DELAY = 2000;

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
    markOnlineOnConnect: false,
    getMessage: async () => {
      return undefined;
    },
    cachedGroupMetadata: async (jid) => groupCache.get(jid),
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('groups.update', async ([event]) => {
    try {
      const metadata = await sock.groupMetadata(event.id);
      groupCache.set(event.id, metadata);
    } catch (error) {
      console.error('❌ Error updating group metadata:', error);
    }
  });

  sock.ev.on('group-participants.update', async (event) => {
    try {
      const metadata = await sock.groupMetadata(event.id);
      groupCache.set(event.id, metadata);
    } catch (error) {
      console.error('❌ Error updating group participants:', error);
    }
  });

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    console.log('\n🔔 messages.upsert event fired with', messages.length, 'message(s), type:', type);
    try {
      for (const msg of messages) {
        const messageId = msg.key.id;

        console.log('\n📨 Message received:', JSON.stringify(msg.key));
        console.log('📋 fromMe:', msg.key.fromMe);
        console.log('📋 Message exists?', !!msg.message);
        console.log('📋 Message stub type:', msg.messageStubType || 'NONE');
        console.log('📋 Message keys:', msg.message ? Object.keys(msg.message) : 'NO MESSAGE');
        console.log('📋 Full message object:', JSON.stringify(msg.message, null, 2));

        if (processedMessages.has(messageId)) {
          console.log('⏭️  Skipping duplicate message:', messageId);
          continue;
        }

        processedMessages.add(messageId);
        setTimeout(() => processedMessages.delete(messageId), 60000);

        if (msg.key.fromMe === true) {
          console.log('⏭️  Skipping message from self (fromMe=true)');
          continue;
        }

        if (msg.messageStubType) {
          console.log('⏭️  Skipping stub message (system message)');
          continue;
        }

        if (!msg.message) {
          console.log('⏭️  No message object, skipping');
          continue;
        }

        if (msg.message?.interactiveResponseMessage) {
          const buttonResponse = msg.message.interactiveResponseMessage;
          const buttonId = buttonResponse.nativeFlowResponseMessage?.paramsJson;

          if (buttonId) {
            try {
              const parsedResponse = JSON.parse(buttonId);
              const commandText = parsedResponse.id;

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

        const text = msg.message?.conversation ||
                     msg.message?.extendedTextMessage?.text ||
                     msg.message?.imageMessage?.caption ||
                     msg.message?.videoMessage?.caption;

        console.log('📝 Text content:', text);
        const hasText = text;
        if (!hasText) {
          console.log('⏭️  No text content, skipping');
          continue;
        }

        console.log('🚀 Calling handleCommand with text:', text);
        await handleCommand(sock, msg);
      }
    } catch (error) {
      console.error('❌ Error processing message:', error);
    }
  });

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === 'close') {
      const statusCode = (lastDisconnect?.error as Boom)?.output?.statusCode;
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

      if (shouldReconnect) {
        if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
          const delay = Math.min(BASE_RECONNECT_DELAY * Math.pow(2, reconnectAttempts), 30000);
          reconnectAttempts++;
          console.log(`Connection closed. Reconnecting in ${delay}ms (attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})...`);
          setTimeout(() => startBot(), delay);
        } else {
          console.log('❌ Max reconnection attempts reached. Please restart manually.');
          process.exit(1);
        }
      } else {
        console.log('Connection closed. Logged out.');
        process.exit(0);
      }
    } else if (connection === 'open') {
      reconnectAttempts = 0;
      console.log('✅ Bot is running!');
    } else if (connection === 'connecting') {
      console.log('🔄 Connecting to WhatsApp...');
    }
  });
};

startBot();
