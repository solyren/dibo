import type { WASocket } from '@whiskeysockets/baileys';
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
        text: '❌ Usage: !kick <number>\n\nExample: !kick 628123456789\nOr tag a user to kick them.',
      });
      return;
    }

    let targetJid = '';

    if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]) {
      targetJid = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
    } else {
      targetJid = args[0].replace(/[^0-9]/g, '');
      if (!targetJid.includes('@')) {
        targetJid = `${targetJid}@s.whatsapp.net`;
      }
    }

    await sock.groupParticipantsUpdate(jid, [targetJid], 'remove');

    await sock.sendMessage(jid, {
      text: `✅ User ${targetJid.split('@')[0]} has been kicked from the group.`,
    });
  } catch (error) {
    console.error('❌ Error in kick command:', error);
    try {
      await sock.sendMessage(jid, {
        text: '❌ Failed to kick user. Make sure the bot is admin and the target is not an admin.',
      });
    } catch {
    }
  }
};

export const kickCommand: Command = {
  name: 'kick',
  role: 'admin',
  execute,
};
