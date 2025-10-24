import type { WASocket } from '@whiskeysockets/baileys';
import type { Command } from '../../types';
import { config } from '../../config';
import { formatMessage } from '../../utils/formatMessage';
import fs from 'fs';
import path from 'path';

// -- sleep --
const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

// -- checkWithRetry --
const checkWithRetry = async (
  sock: WASocket,
  targetJid: string,
  maxRetries = 3,
): Promise<any> => {
  let lastError: any;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const statusResponse = await sock.fetchStatus(targetJid);
      return statusResponse;
    } catch (error: any) {
      lastError = error;

      const isRateLimit = error?.message?.toLowerCase().includes('rate') ||
                          error?.message?.toLowerCase().includes('too many') ||
                          error?.message?.toLowerCase().includes('flood') ||
                          error?.output?.statusCode === 429;

      if (isRateLimit && attempt < maxRetries) {
        const waitTime = Math.min(5000 * attempt, 15000);
        console.log(`⚠️  Rate limit detected on attempt ${attempt}. Waiting ${waitTime}ms...`);
        await sleep(waitTime);
        continue;
      }

      if (attempt < maxRetries) {
        await sleep(1000 * attempt);
        continue;
      }

      throw lastError;
    }
  }

  throw lastError;
};

// -- execute --
const execute = async (sock: WASocket, msg: any, args: string[]): Promise<void> => {
  const jid = msg.key.remoteJid;

  try {
    let numbersInput = '';

    if (msg.message?.documentMessage) {
      const document = msg.message.documentMessage;

      if (document.mimetype === 'text/plain' || document.fileName?.endsWith('.txt')) {
        try {
          const buffer = await sock.downloadMediaMessage(msg);
          numbersInput = buffer.toString('utf-8');
        } catch (downloadError) {
          console.error('Error downloading file:', downloadError);
          await sock.sendMessage(jid, {
            text: '❌ Failed to read file. Please try again.',
          });
          return;
        }
      }
    } else if (msg.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
      const quotedText = msg.message.extendedTextMessage.contextInfo.quotedMessage.conversation ||
                         msg.message.extendedTextMessage.contextInfo.quotedMessage.extendedTextMessage?.text;

      if (quotedText) {
        numbersInput = quotedText;
      }
    } else if (args.length > 0) {
      numbersInput = args.join(' ');
    }

    if (!numbersInput) {
      await sock.sendMessage(jid, {
        text: formatMessage(config.messages.commands.wabulk.usage),
      });
      return;
    }

    const numbers = numbersInput
      .split(/[\n,;]+/)
      .map((num) => num.trim().replace(/[^0-9]/g, ''))
      .filter((num) => num.length >= 10);

    if (numbers.length === 0) {
      await sock.sendMessage(jid, {
        text: formatMessage(config.messages.commands.wabulk.noValidNumbers),
      });
      return;
    }

    await sock.sendMessage(jid, {
      text: formatMessage(config.messages.commands.wabulk.processing, {
        total: numbers.length.toString(),
      }),
    });

    const successResults: string[] = [];
    const failedNumbers: string[] = [];
    let processed = 0;
    let currentDelay = 150;
    let consecutiveErrors = 0;

    for (const number of numbers) {
      processed++;

      try {
        const targetJid = `${number}@s.whatsapp.net`;
        const statusResponse = await checkWithRetry(sock, targetJid);

        if (!statusResponse || statusResponse.length === 0) {
          failedNumbers.push(number);
          consecutiveErrors = 0;
          await sleep(currentDelay);
          continue;
        }

        const bioData = statusResponse[0];
        const bioText = bioData?.status?.status;
        const bioSetAt = bioData?.status?.setAt;

        if (!bioText || bioText.trim() === '') {
          failedNumbers.push(number);
        } else {
          const setAt = bioSetAt && bioSetAt !== '1970-01-01T00:00:00.000Z'
            ? new Date(bioSetAt).toLocaleString('id-ID', {
              dateStyle: 'full',
              timeStyle: 'short',
            })
            : 'Unknown';

          successResults.push(`${number} | ${bioText} | ${setAt}`);
        }

        consecutiveErrors = 0;
        currentDelay = Math.max(150, currentDelay - 30);

        if (processed % 10 === 0) {
          await sock.sendMessage(jid, {
            text: formatMessage(config.messages.commands.wabulk.progress, {
              current: processed.toString(),
              total: numbers.length.toString(),
            }),
          });
        }

        await sleep(currentDelay);
      } catch (error: any) {
        console.error(`❌ Error checking ${number}:`, error?.message || error);
        failedNumbers.push(number);

        consecutiveErrors++;

        if (consecutiveErrors >= 3) {
          currentDelay = Math.min(2000, currentDelay + 500);
          console.log(`⚠️  Multiple errors detected. Increasing delay to ${currentDelay}ms`);
        }

        await sleep(currentDelay);
      }
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const successFile = path.join(process.cwd(), `wabulk-success-${timestamp}.txt`);
    const failedFile = path.join(process.cwd(), `wabulk-failed-${timestamp}.txt`);

    if (successResults.length > 0) {
      const successContent = 'WhatsApp Bio Check - Success Results\n' +
                            `Generated: ${new Date().toLocaleString('id-ID')}\n` +
                            `Total: ${successResults.length}\n\n` +
                            'Format: Number | Bio | Date\n' +
                            `${'='.repeat(80)}\n\n${
                              successResults.join('\n')}`;

      fs.writeFileSync(successFile, successContent, 'utf-8');
    }

    if (failedNumbers.length > 0) {
      const failedContent = 'WhatsApp Bio Check - Failed/No Bio\n' +
                           `Generated: ${new Date().toLocaleString('id-ID')}\n` +
                           `Total: ${failedNumbers.length}\n\n${
                             failedNumbers.join('\n')}`;

      fs.writeFileSync(failedFile, failedContent, 'utf-8');
    }

    const summary = formatMessage(config.messages.commands.wabulk.complete, {
      total: numbers.length.toString(),
      success: successResults.length.toString(),
      failed: failedNumbers.length.toString(),
    });

    await sock.sendMessage(jid, { text: summary });

    if (successResults.length > 0) {
      await sock.sendMessage(jid, {
        document: fs.readFileSync(successFile),
        mimetype: 'text/plain',
        fileName: `wabulk-success-${timestamp}.txt`,
        caption: '✅ Numbers with Bio',
      });
      fs.unlinkSync(successFile);
    }

    if (failedNumbers.length > 0) {
      await sock.sendMessage(jid, {
        document: fs.readFileSync(failedFile),
        mimetype: 'text/plain',
        fileName: `wabulk-failed-${timestamp}.txt`,
        caption: '❌ Numbers without Bio / Private',
      });
      fs.unlinkSync(failedFile);
    }
  } catch (error) {
    console.error('❌ Error in wabio-bulk command:', error);
    try {
      await sock.sendMessage(jid, {
        text: config.messages.errors.commandError,
      });
    } catch {
    }
  }
};

export const wabulkCommand: Command = {
  name: 'wabulk',
  role: 'owner',
  execute,
};
