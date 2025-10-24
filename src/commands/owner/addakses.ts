import type { WASocket } from '@whiskeysockets/baileys';
import type { Command } from '../../types';
import { db } from '../../services/database';

// -- execute --
const execute = async (sock: WASocket, msg: any, args: string[]): Promise<void> => {
  const jid = msg.key.remoteJid;

  try {
    if (args.length === 0) {
      await sock.sendMessage(jid, {
        text: '❌ Usage: .addakses <number>\n\nExample: .addakses 628123456789',
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
      ? `✅ Access granted to: ${targetJid}\n\nUser can now use akses commands.`
      : '❌ Failed to grant access. Database might not be configured.';

    await sock.sendMessage(jid, { text: responseText });
  } catch (error) {
    console.error('❌ Error in addakses command:', error);
    try {
      await sock.sendMessage(jid, {
        text: '❌ Error executing command. Please try again.',
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
