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
    wachk: {
      usage: '❌ Usage: {prefix}wachk <number>\n\nExample: {prefix}wachk 628123456789',
      success: '📝 *WhatsApp Bio Info*\n\n👤 Number: {target}\n📄 Bio: {bio}\n📅 Set At: {date}',
      notFound: '❌ Bio not found for {target}. Number might not exist or bio is empty.',
    },
    wabulk: {
      usage: '❌ Usage: {prefix}wabulk <numbers>\n\n' +
             'Option 1: Send .txt file containing numbers\n' +
             'Option 2: Send list separated by newline/comma\n' +
             'Option 3: Reply to message with numbers\n\n' +
             'Example:\n{prefix}wabulk 628123456789,628987654321\n' +
             'Or upload numbers.txt file',
      noValidNumbers: '❌ No valid numbers found. Please provide at least one valid phone number (min 10 digits).',
      processing: '⏳ Processing {total} numbers...\n\nThis may take a while. Please wait.',
      progress: '📊 Progress: {current}/{total} numbers checked...',
      complete: '✅ *Bulk Check Complete*\n\n' +
                '📊 Total Checked: {total}\n' +
                '✅ With Bio: {success}\n' +
                '❌ No Bio/Private: {failed}\n\n' +
                'Files are being sent...',
    },
  },
};
