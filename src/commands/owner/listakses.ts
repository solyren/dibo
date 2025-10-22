import type { WASocket } from 'baileys-mod';
import type { Command } from '../../types';
import { db } from '../../services/database';

// -- execute --
const execute = async (sock: WASocket, msg: any, _args: string[]): Promise<void> => {
  const jid = msg.key.remoteJid;

  try {
    const users = await db.listAccess();

    let responseText: string;

    if (users.length === 0) {
      responseText = '📋 *Access List*\n\nNo users with special access.';
    } else {
      const userList = users.map((user, index) => `${index + 1}. ${user}`).join('\n');
      responseText = `📋 *Access List*\n\nUsers with special access:\n${userList}\n\nTotal: ${users.length} user(s)`;
    }

    await sock.sendMessage(jid, { text: responseText });
  } catch (error) {
    console.error('❌ Error in listakses command:', error);
    try {
      await sock.sendMessage(jid, {
        text: '❌ Error executing command. Please try again.',
      });
    } catch {
      // Silent fail if can't send error message
    }
  }
};

export const listaksesCommand: Command = {
  name: 'listakses',
  role: 'owner',
  execute,
};
