import type { WASocket } from '@whiskeysockets/baileys';
import type { Command } from '../../types';
import { config } from '../../config';
import { formatMessage } from '../../utils/formatMessage';

// -- execute --
const execute = async (sock: WASocket, msg: any, args: string[]): Promise<void> => {
  const jid = msg.key.remoteJid;

  try {
    if (args.length === 0) {
      await sock.sendMessage(jid, {
        text: formatMessage(config.messages.commands.wachk.usage),
      });
      return;
    }

    let targetJid = args[0];

    if (!targetJid.includes('@')) {
      targetJid = targetJid.replace(/[^0-9]/g, '');
      targetJid = `${targetJid}@s.whatsapp.net`;
    }

    const statusResponse = await sock.fetchStatus(targetJid);

    if (!statusResponse || statusResponse.length === 0) {
      await sock.sendMessage(jid, {
        text: formatMessage(config.messages.commands.wachk.notFound, { target: targetJid }),
      });
      return;
    }

    const bioData = statusResponse[0];
    const bioText = bioData?.status?.status;
    const bioSetAt = bioData?.status?.setAt;

    if (!bioText || bioText.trim() === '') {
      await sock.sendMessage(jid, {
        text: formatMessage(config.messages.commands.wachk.notFound, { target: targetJid }),
      });
      return;
    }

    const setAt = bioSetAt && bioSetAt !== '1970-01-01T00:00:00.000Z'
      ? new Date(bioSetAt).toLocaleString('id-ID', {
        dateStyle: 'full',
        timeStyle: 'short',
      })
      : 'Unknown';

    const responseText = formatMessage(config.messages.commands.wachk.success, {
      target: targetJid,
      bio: bioText,
      date: setAt,
    });

    await sock.sendMessage(jid, { text: responseText });
  } catch (error) {
    console.error('❌ Error in wabio command:', error);
    try {
      await sock.sendMessage(jid, {
        text: config.messages.errors.commandError,
      });
    } catch {
    }
  }
};

export const wachkCommand: Command = {
  name: 'wachk',
  role: 'owner',
  execute,
};
