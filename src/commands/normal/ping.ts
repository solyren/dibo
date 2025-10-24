import type { WASocket } from '@whiskeysockets/baileys';
import type { Command } from '../../types';
import { config } from '../../config';

// -- execute --
const execute = async (sock: WASocket, msg: any, _args: string[]): Promise<void> => {
  const jid = msg.key.remoteJid;
  try {
    await sock.sendMessage(jid, { text: config.messages.commands.ping });
  } catch (error) {
    console.error('❌ Error in ping command:', error);
  }
};

export const pingCommand: Command = {
  name: 'ping',
  role: 'normal',
  execute,
};
