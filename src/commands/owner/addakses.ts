import type { WASocket } from 'baileys-mod';
import type { Command } from '../../types';
import { db } from '../../services/database';

// -- execute --
const execute = async (sock: WASocket, msg: any, args: string[]): Promise<void> => {
  const jid = msg.key.remoteJid;

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

  if (success) {
    await sock.sendMessage(jid, {
      text: `✅ Access granted to: ${targetJid}\n\nUser can now use admin commands (if they are group admin).`,
    });
  } else {
    await sock.sendMessage(jid, {
      text: '❌ Failed to grant access. Database might not be configured.',
    });
  }
};

export const addaksesCommand: Command = {
  name: 'addakses',
  role: 'owner',
  execute,
};
