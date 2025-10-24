import type { WASocket } from '@whiskeysockets/baileys';
import type { Command } from '../../types';
import { db } from '../../services/database';
import { config } from '../../config';
import { formatMessage } from '../../utils/formatMessage';

// -- execute --
const execute = async (sock: WASocket, msg: any, args: string[]): Promise<void> => {
  const jid = msg.key.remoteJid;

  try {
    if (args.length === 0) {
      await sock.sendMessage(jid, {
        text: formatMessage(config.messages.commands.removeakses.usage),
      });
      return;
    }

    let targetJid = args[0];

    if (!targetJid.includes('@')) {
      targetJid = targetJid.replace(/[^0-9]/g, '');
      targetJid = `${targetJid}@s.whatsapp.net`;
    }

    const success = await db.removeAccess(targetJid);

    const responseText = success
      ? formatMessage(config.messages.commands.removeakses.success, { target: targetJid })
      : config.messages.commands.removeakses.failed;

    await sock.sendMessage(jid, { text: responseText });
  } catch (error) {
    console.error('❌ Error in removeakses command:', error);
    try {
      await sock.sendMessage(jid, {
        text: config.messages.errors.commandError,
      });
    } catch {
    }
  }
};

export const removeaksesCommand: Command = {
  name: 'removeakses',
  role: 'owner',
  execute,
};
