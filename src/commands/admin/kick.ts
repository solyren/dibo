import type { WASocket } from '@whiskeysockets/baileys';
import type { Command } from '../../types';
import { config } from '../../config';
import { formatMessage } from '../../utils/formatMessage';

// -- execute --
const execute = async (sock: WASocket, msg: any, args: string[]): Promise<void> => {
  const jid = msg.key.remoteJid;

  try {
    const isGroup = jid?.endsWith('@g.us');

    if (!isGroup) {
      await sock.sendMessage(jid, {
        text: config.messages.errors.groupOnly,
      });
      return;
    }

    if (args.length === 0) {
      await sock.sendMessage(jid, {
        text: formatMessage(config.messages.commands.kick.usage),
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
      text: formatMessage(config.messages.commands.kick.success, { target: targetJid.split('@')[0] }),
    });
  } catch (error) {
    console.error('❌ Error in kick command:', error);
    try {
      await sock.sendMessage(jid, {
        text: config.messages.commands.kick.failed,
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
