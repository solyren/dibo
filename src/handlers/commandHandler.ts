import type { WASocket } from 'baileys-mod';
import type { Command } from '../types';
import { pingCommand } from '../commands/normal/ping';
import { config } from '../config';

const normalCommands: Map<string, Command> = new Map();

// -- registerCommands --
const registerCommands = (): void => {
  normalCommands.set(pingCommand.name, pingCommand);
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
      const command = normalCommands.get(commandName);
      console.log('🔍 Command found:', !!command);
      
      if (command) {
        console.log(`⚡ Executing command: ${commandName}`);
        await command.execute(sock, msg, args);
      }
    }
  } else {
    console.log('❌ Text does not start with prefix or text is empty');
  }
};

registerCommands();
