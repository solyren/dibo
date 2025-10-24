import type { WASocket } from '@whiskeysockets/baileys';
import type { Command } from '../../types';
import { db } from '../../services/database';
import { config } from '../../config';
import { formatMessage } from '../../utils/formatMessage';

const USERS_PER_PAGE = 5;

// -- execute --
const execute = async (sock: WASocket, msg: any, args: string[]): Promise<void> => {
  const jid = msg.key.remoteJid;

  try {
    const users = await db.listAccess();

    if (users.length === 0) {
      await sock.sendMessage(jid, {
        text: config.messages.commands.listakses.empty,
      });
      return;
    }

    let page = 1;
    if (args.length > 0) {
      const parsedPage = parseInt(args[0], 10);
      if (!isNaN(parsedPage) && parsedPage > 0) {
        page = parsedPage;
      }
    }

    const totalPages = Math.ceil(users.length / USERS_PER_PAGE);

    if (page > totalPages) {
      page = totalPages;
    }

    const startIndex = (page - 1) * USERS_PER_PAGE;
    const endIndex = Math.min(startIndex + USERS_PER_PAGE, users.length);
    const pageUsers = users.slice(startIndex, endIndex);

    const userList = pageUsers
      .map((user, index) => `${startIndex + index + 1}. ${user}`)
      .join('\n');

    const messageText = `${config.messages.commands.listakses.title
    }Users with special access:\n${userList}${
      formatMessage(config.messages.commands.listakses.footer, {
        current: page,
        total: totalPages,
        count: users.length,
      })}`;

    const interactiveButtons = [];

    if (page > 1) {
      interactiveButtons.push({
        name: 'quick_reply',
        buttonParamsJson: JSON.stringify({
          display_text: config.messages.commands.listakses.buttons.prev,
          id: `.listakses ${page - 1}`,
        }),
      });
    }

    interactiveButtons.push({
      name: 'quick_reply',
      buttonParamsJson: JSON.stringify({
        display_text: '🔄 Refresh',
        id: `.listakses ${page}`,
      }),
    });

    if (page < totalPages) {
      interactiveButtons.push({
        name: 'quick_reply',
        buttonParamsJson: JSON.stringify({
          display_text: config.messages.commands.listakses.buttons.next,
          id: `.listakses ${page + 1}`,
        }),
      });
    }

    const interactiveMessage = {
      text: messageText,
      footer: 'Click buttons to navigate',
      interactiveButtons,
    };

    await sock.sendMessage(jid, interactiveMessage);
  } catch (error) {
    console.error('❌ Error in listakses command:', error);
    try {
      await sock.sendMessage(jid, {
        text: config.messages.errors.commandError,
      });
    } catch {
    }
  }
};

export const listaksesCommand: Command = {
  name: 'listakses',
  role: 'owner',
  execute,
};
