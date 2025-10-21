import type { WASocket } from 'baileys-mod';
import type { Command } from '../../types';

// -- execute --
const execute = async (sock: WASocket, msg: any, _args: string[]): Promise<void> => {
  console.log('🏓 Ping command executed!');
  const jid = msg.key.remoteJid;
  console.log('📤 Sending to:', jid);
  try {
    await sock.sendMessage(jid, { text: 'Pong!' });
    console.log('✅ Pong sent successfully!');
  } catch (error) {
    console.error('❌ Error sending message:', error);
  }
};

export const pingCommand: Command = {
  name: 'ping',
  execute,
};
