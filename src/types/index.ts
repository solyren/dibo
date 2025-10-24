import type { WASocket } from '@whiskeysockets/baileys';

export type CommandRole = 'normal' | 'akses' | 'admin' | 'owner';

export interface Command {
  name: string;
  role: CommandRole;
  execute: (sock: WASocket, msg: any, args: string[]) => Promise<void>;
}

export interface BotConfig {
  usePairingCode: boolean;
  customPairingCode: string;
  prefix: string;
  botName: string;
  ownerNumber: string;
  redis: {
    url: string;
    token: string;
  };
}

export interface UserPermissions {
  isOwner: boolean;
  isAdmin: boolean;
  hasAccess: boolean;
}
