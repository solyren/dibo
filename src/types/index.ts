import type { WASocket } from '@whiskeysockets/baileys';

export type CommandRole = 'normal' | 'akses' | 'admin' | 'owner';

export interface Command {
  name: string;
  role: CommandRole;
  execute: (sock: WASocket, msg: any, args: string[]) => Promise<void>;
}

export interface BotMessages {
  errors: {
    noPermission: string;
    ownerOnly: string;
    needAdmin: string;
    needAccess: string;
    needAdminAndAccess: string;
    groupOnly: string;
    commandError: string;
  };
  commands: {
    ping: string;
    addakses: {
      usage: string;
      success: string;
      failed: string;
    };
    removeakses: {
      usage: string;
      success: string;
      notFound: string;
      failed: string;
    };
    listakses: {
      title: string;
      empty: string;
      footer: string;
      buttons: {
        next: string;
        prev: string;
      };
    };
    kick: {
      usage: string;
      success: string;
      failed: string;
    };
    hidetag: {
      usage: string;
    };
  };
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
  messages: BotMessages;
}

export interface UserPermissions {
  isOwner: boolean;
  isAdmin: boolean;
  hasAccess: boolean;
}
