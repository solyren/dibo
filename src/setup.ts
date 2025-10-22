import makeWASocket, { DisconnectReason, useMultiFileAuthState, fetchLatestBaileysVersion, makeInMemoryStore } from 'baileys-mod';
import { Boom } from '@hapi/boom';
import pino from 'pino';
import * as readline from 'readline';
import { config } from './config';

// -- Message store untuk caching --
const store = makeInMemoryStore({
  logger: pino().child({ level: 'silent', stream: 'store' }),
});

// -- createReadlineInterface --
const createReadlineInterface = (): readline.Interface => {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
};

// -- question --
const question = (query: string): Promise<string> => {
  const rl = createReadlineInterface();
  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
};

// -- setupPairingCode --
const setupPairingCode = async (): Promise<void> => {
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

  // Bind store ke socket
  store.bind(sock.ev);

  if (config.usePairingCode && !sock.authState.creds.registered) {
    const phoneNumber = await question('Please enter your mobile phone number:\n');
    const code = await sock.requestPairingCode(phoneNumber, config.customPairingCode);
    console.log(`Your Pairing Code: ${code?.match(/.{1,4}/g)?.join('-') || code}`);
  }

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
      
      if (shouldReconnect) {
        console.log('Connection closed, trying to reconnect...');
        setupPairingCode();
      } else {
        console.log('Connection closed. Logged out.');
        process.exit(0);
      }
    } else if (connection === 'open') {
      console.log('Setup complete! You can now run the bot with: bun start');
      process.exit(0);
    }
  });
};

setupPairingCode();
