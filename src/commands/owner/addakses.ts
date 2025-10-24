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
        text: formatMessage(config.messages.commands.addakses.usage),
      });
      return;
    }

    let targetJid = args[0];

    if (!targetJid.includes('@')) {
      targetJid = targetJid.replace(/[^0-9]/g, '');
      targetJid = `${targetJid}@s.whatsapp.net`;
    }

    const success = await db.addAccess(targetJid);

    const responseText = success
      ? formatMessage(config.messages.commands.addakses.success, { target: targetJid })
      : config.messages.commands.addakses.failed;

    await sock.sendMessage(jid, { text: responseText });
  } catch (error) {
    console.error('❌ Error in addakses command:', error);
    try {
      await sock.sendMessage(jid, {
        text: config.messages.errors.commandError,
      });
    } catch {
    }
  }
};

export const addaksesCommand: Command = {
  name: 'addakses',
  role: 'owner',
  execute,
};
