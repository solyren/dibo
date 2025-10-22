import type { BotConfig } from '../types';

export const config: BotConfig = {
  usePairingCode: true,
  customPairingCode: 'DIBOBOTT',
  prefix: '!',
  botName: 'Dibo Bot',
  ownerNumber: '62895351647550', // Nomor owner tanpa @ (contoh: 628123456789)
  redis: {
    url: process.env.UPSTASH_REDIS_REST_URL || '',
    token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
  },
};
