import type { WASocket } from 'baileys-mod';

export interface Command {
  name: string;
  execute: (sock: WASocket, msg: any, args: string[]) => Promise<void>;
}

export interface BotConfig {
  usePairingCode: boolean;
  customPairingCode: string;
  prefix: string;
  botName: string;
}
