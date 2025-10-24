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
        text: formatMessage(config.messages.commands.hidetag.usage),
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
        text: config.messages.errors.commandError,
      });
    } catch {
    }
  }
};

export const hidetagCommand: Command = {
  name: 'hidetag',
  role: 'akses',
  execute,
};
