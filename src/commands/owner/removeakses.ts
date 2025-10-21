import type { WASocket } from 'baileys-mod';
import type { Command } from '../../types';
import { db } from '../../services/database';

// -- execute --
const execute = async (sock: WASocket, msg: any, args: string[]): Promise<void> => {
  const jid = msg.key.remoteJid;

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

  if (success) {
    await sock.sendMessage(jid, {
      text: `✅ Access removed from: ${targetJid}\n\nUser can no longer use admin commands.`,
    });
  } else {
    await sock.sendMessage(jid, {
      text: '❌ Failed to remove access. Database might not be configured.',
    });
  }
};

export const removeaksesCommand: Command = {
  name: 'removeakses',
  role: 'owner',
  execute,
};
