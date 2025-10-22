import type { WASocket } from 'baileys-mod';
import type { Command } from '../types';
import { pingCommand } from '../commands/normal/ping';
import { hidetagCommand } from '../commands/akses/hidetag';
import { addaksesCommand } from '../commands/owner/addakses';
import { removeaksesCommand } from '../commands/owner/removeakses';
import { listaksesCommand } from '../commands/owner/listakses';
import { config } from '../config';
import { accessControl } from '../services/accessControl';

const normalCommands: Map<string, Command> = new Map();
const aksesCommands: Map<string, Command> = new Map();
const adminCommands: Map<string, Command> = new Map();
const ownerCommands: Map<string, Command> = new Map();

// -- registerCommands --
const registerCommands = (): void => {
  normalCommands.set(pingCommand.name, pingCommand);

  aksesCommands.set(hidetagCommand.name, hidetagCommand);

  ownerCommands.set(addaksesCommand.name, addaksesCommand);
  ownerCommands.set(removeaksesCommand.name, removeaksesCommand);
  ownerCommands.set(listaksesCommand.name, listaksesCommand);
};

// -- getCommand --
const getCommand = (commandName: string): Command | undefined => {
  return (
    normalCommands.get(commandName) ||
    aksesCommands.get(commandName) ||
    adminCommands.get(commandName) ||
    ownerCommands.get(commandName)
  );
};

// -- handleCommand --
export const handleCommand = async (sock: WASocket, msg: any): Promise<void> => {
  try {
    const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text;
    if (!text || !text.startsWith(config.prefix)) {return;}

    const args = text.slice(config.prefix.length).trim().split(/ +/);
    const commandName = args.shift()?.toLowerCase();
    if (!commandName) {return;}

    const command = getCommand(commandName);
    if (!command) {return;}

    msg._sock = sock;
    const permissions = await accessControl.getUserPermissions(msg);
    const canExecute = accessControl.canExecuteCommand(permissions, command.role);

    if (canExecute) {
      await command.execute(sock, msg, args);
    } else {
      const jid = msg.key.remoteJid;
      let errorMsg = '❌ You do not have permission to use this command.';

      if (command.role === 'owner') {
        errorMsg = '❌ This command is owner-only.';
      } else if (command.role === 'admin') {
        if (!permissions.isAdmin) {
          errorMsg = '❌ You must be a group admin to use this command.';
        } else if (!permissions.hasAccess) {
          errorMsg = '❌ You need special access to use this command. Contact the owner.';
        }
      } else if (command.role === 'akses') {
        errorMsg = '❌ You need special access to use this command. Contact the owner.';
      }

      await sock.sendMessage(jid, { text: errorMsg });
    }
  } catch (error) {
    console.error('❌ Error in handleCommand:', error);
  }
};

registerCommands();

export { normalCommands, aksesCommands, adminCommands, ownerCommands };
