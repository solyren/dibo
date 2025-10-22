import type { WASocket } from 'baileys-mod';
import type { Command } from '../../types';

// -- execute --
const execute = async (sock: WASocket, msg: any, args: string[]): Promise<void> => {
  const jid = msg.key.remoteJid;

  try {
    const isGroup = jid?.endsWith('@g.us');

    if (!isGroup) {
      await sock.sendMessage(jid, {
        text: '❌ This command can only be used in groups.',
      });
      return;
    }

    if (args.length === 0) {
      await sock.sendMessage(jid, {
        text: '❌ Usage: .hidetag <message>\n\nExample: .hidetag Hello everyone!',
      });
      return;
    }

    const text = args.join(' ');
    const groupMetadata = await sock.groupMetadata(jid);
    const participants = groupMetadata.participants.map((p) => p.id);

    await sock.sendMessage(jid, {
      text: text,
      mentions: participants,
    });
  } catch (error) {
    console.error('❌ Error in hidetag command:', error);
    try {
      await sock.sendMessage(jid, {
        text: '❌ Failed to send hidetag. Make sure the bot is admin.',
      });
    } catch {
      // Silent fail if can't send error message
    }
  }
};

export const hidetagCommand: Command = {
  name: 'hidetag',
  role: 'akses',
  execute,
};
