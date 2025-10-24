import type { WASocket } from '@whiskeysockets/baileys';
import type { Command } from '../../types';
import { db } from '../../services/database';

// -- execute --
const execute = async (sock: WASocket, msg: any, args: string[]): Promise<void> => {
  const jid = msg.key.remoteJid;

  try {
    if (args.length === 0) {
      await sock.sendMessage(jid, {
        text: '❌ Usage: .removeakses <number>\n\nExample: .removeakses 628123456789',
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
      ? `✅ Access removed from: ${targetJid}\n\nUser can no longer use akses commands.`
      : '❌ Failed to remove access. Database might not be configured.';

    await sock.sendMessage(jid, { text: responseText });
  } catch (error) {
    console.error('❌ Error in removeakses command:', error);
    try {
      await sock.sendMessage(jid, {
        text: '❌ Error executing command. Please try again.',
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
