import type { WASocket } from 'baileys-mod';
import type { Command } from '../../types';
import { db } from '../../services/database';

// -- execute --
const execute = async (sock: WASocket, msg: any, _args: string[]): Promise<void> => {
  const jid = msg.key.remoteJid;

  const users = await db.listAccess();

  if (users.length === 0) {
    await sock.sendMessage(jid, {
      text: '📋 *Access List*\n\nNo users with special access.',
    });
    return;
  }

  const userList = users.map((user, index) => `${index + 1}. ${user}`).join('\n');

  await sock.sendMessage(jid, {
    text: `📋 *Access List*\n\nUsers with special access:\n${userList}\n\nTotal: ${users.length} user(s)`,
  });
};

export const listaksesCommand: Command = {
  name: 'listakses',
  role: 'owner',
  execute,
};
