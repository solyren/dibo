import type { WASocket } from 'baileys-mod';
import type { Command } from '../types';
import { pingCommand } from '../commands/normal/ping';
import { hidetagCommand } from '../commands/admin/hidetag';
import { addaksesCommand } from '../commands/owner/addakses';
import { removeaksesCommand } from '../commands/owner/removeakses';
import { listaksesCommand } from '../commands/owner/listakses';
import { config } from '../config';
import { accessControl } from '../services/accessControl';

const normalCommands: Map<string, Command> = new Map();
const adminCommands: Map<string, Command> = new Map();
const ownerCommands: Map<string, Command> = new Map();

// -- registerCommands --
const registerCommands = (): void => {
  normalCommands.set(pingCommand.name, pingCommand);
  
  adminCommands.set(hidetagCommand.name, hidetagCommand);
  
  ownerCommands.set(addaksesCommand.name, addaksesCommand);
  ownerCommands.set(removeaksesCommand.name, removeaksesCommand);
  ownerCommands.set(listaksesCommand.name, listaksesCommand);
};

// -- getCommand --
const getCommand = (commandName: string): Command | undefined => {
  return (
    normalCommands.get(commandName) ||
    adminCommands.get(commandName) ||
    ownerCommands.get(commandName)
  );
};

// -- handleCommand --
export const handleCommand = async (sock: WASocket, msg: any): Promise<void> => {
  const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text;
  console.log('📝 Text extracted:', text);
  console.log('🔧 Prefix:', config.prefix);
  
  if (text && text.startsWith(config.prefix)) {
    console.log('✅ Text starts with prefix!');
    const args = text.slice(config.prefix.length).trim().split(/ +/);
    const commandName = args.shift()?.toLowerCase();
    console.log('🎯 Command name:', commandName);
    console.log('📋 Args:', args);
    
    if (commandName) {
      const command = getCommand(commandName);
      console.log('🔍 Command found:', !!command);
      
      if (command) {
        msg._sock = sock;
        
        const permissions = await accessControl.getUserPermissions(msg);
        console.log('👤 User permissions:', permissions);
        
        const canExecute = accessControl.canExecuteCommand(permissions, command.role);
        console.log('🔐 Can execute:', canExecute);
        
        if (canExecute) {
          console.log(`⚡ Executing command: ${commandName}`);
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
          }
          
          await sock.sendMessage(jid, { text: errorMsg });
          console.log('🚫 Command execution denied');
        }
      }
    }
  } else {
    console.log('❌ Text does not start with prefix or text is empty');
  }
};

registerCommands();

export { normalCommands, adminCommands, ownerCommands };
