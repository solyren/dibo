import type { BotMessages } from '../types';

export const messages: BotMessages = {
  errors: {
    noPermission: '❌ You do not have permission to use this command.',
    ownerOnly: '❌ This command is owner-only.',
    needAdmin: '❌ You must be a group admin to use this command.',
    needAccess: '❌ You need special access to use this command. Contact the owner.',
    needAdminAndAccess: '❌ You need to be a group admin AND have special access.',
    groupOnly: '❌ This command can only be used in groups.',
    commandError: '❌ Error executing command. Please try again.',
  },
  commands: {
    ping: 'Pong! 🏓',
    addakses: {
      usage: '❌ Usage: {prefix}addakses <number>\n\nExample: {prefix}addakses 628123456789',
      success: '✅ Access granted to: {target}\n\nUser can now use akses commands.',
      failed: '❌ Failed to grant access. Database might not be configured.',
    },
    removeakses: {
      usage: '❌ Usage: {prefix}removeakses <number>\n\nExample: {prefix}removeakses 628123456789',
      success: '✅ Access removed from: {target}\n\nUser can no longer use akses commands.',
      notFound: '❌ User {target} does not have access.',
      failed: '❌ Failed to remove access. Database might not be configured.',
    },
    listakses: {
      title: '📋 *Users with Special Access*\n\n',
      empty: '📋 *Users with Special Access*\n\nNo users with access yet.',
      footer: '\n\n_Page {current}/{total} • Total: {count} users_',
      buttons: {
        next: 'Next Page ▶️',
        prev: '◀️ Previous Page',
      },
    },
    kick: {
      usage: '❌ Usage: {prefix}kick <number>\n\nExample: {prefix}kick 628123456789\nOr tag a user to kick them.',
      success: '✅ User {target} has been kicked from the group.',
      failed: '❌ Failed to kick user. Make sure the bot is admin and the target is not an admin.',
    },
    hidetag: {
      usage: '❌ Usage: {prefix}hidetag <text>\n\nExample: {prefix}hidetag Hello everyone!',
    },
  },
};
