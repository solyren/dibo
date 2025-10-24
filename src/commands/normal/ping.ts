import type { WASocket } from '@whiskeysockets/baileys';
import type { Command } from '../../types';

// -- execute --
const execute = async (sock: WASocket, msg: any, _args: string[]): Promise<void> => {
  const jid = msg.key.remoteJid;
  try {
    await sock.sendMessage(jid, { text: 'Pong! 🏓' });
  } catch (error) {
    console.error('❌ Error in ping command:', error);
  }
};

export const pingCommand: Command = {
  name: 'ping',
  role: 'normal',
  execute,
};
