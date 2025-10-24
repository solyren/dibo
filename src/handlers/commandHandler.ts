import type { WASocket } from '@whiskeysockets/baileys';
import type { Command } from '../types';
import { pingCommand } from '../commands/normal/ping';
import { hidetagCommand } from '../commands/akses/hidetag';
import { kickCommand } from '../commands/admin/kick';
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

  adminCommands.set(kickCommand.name, kickCommand);

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
    console.log('🔍 handleCommand called with text:', text);
    console.log('🔧 Prefix configured as:', config.prefix);

    if (!text || !text.startsWith(config.prefix)) {
      console.log('⚠️  Text does not start with prefix, ignoring');
      return;
    }

    const args = text.slice(config.prefix.length).trim().split(/ +/);
    const commandName = args.shift()?.toLowerCase();
    console.log('📛 Command name:', commandName);
    console.log('📦 Args:', args);

    if (!commandName) {
      console.log('⚠️  No command name found');
      return;
    }

    const command = getCommand(commandName);
    console.log('🔎 Command found:', command ? command.name : 'NOT FOUND');

    if (!command) {
      console.log('⚠️  Command not registered');
      return;
    }

    msg._sock = sock;
    const permissions = await accessControl.getUserPermissions(msg);
    console.log('🔐 Permissions:', permissions);
    console.log('👤 Command role:', command.role);

    const canExecute = accessControl.canExecuteCommand(permissions, command.role);
    console.log('✅ Can execute?', canExecute);

    if (canExecute) {
      console.log('🎯 Executing command:', command.name);
      try {
        await command.execute(sock, msg, args);
        console.log('✅ Command executed successfully');
      } catch (execError) {
        console.error('❌ Error executing command:', execError);
        throw execError;
      }
    } else {
      const jid = msg.key.remoteJid;
      let errorMsg = config.messages.errors.noPermission;

      if (command.role === 'owner') {
        errorMsg = config.messages.errors.ownerOnly;
      } else if (command.role === 'admin') {
        if (!permissions.isAdmin) {
          errorMsg = config.messages.errors.needAdmin;
        } else if (!permissions.hasAccess) {
          errorMsg = config.messages.errors.needAccess;
        }
      } else if (command.role === 'akses') {
        errorMsg = config.messages.errors.needAccess;
      }

      await sock.sendMessage(jid, { text: errorMsg });
    }
  } catch (error) {
    console.error('❌ Error in handleCommand:', error);
  }
};

registerCommands();

export { normalCommands, aksesCommands, adminCommands, ownerCommands };
