import type { BotConfig } from '../types';
import { messages } from './messages';

export const config: BotConfig = {
  usePairingCode: true,
  customPairingCode: 'DIBOBOTT',
  prefix: '!',
  botName: 'Dibo Bot',
  ownerNumber: '62895351647550',
  redis: {
    url: process.env.UPSTASH_REDIS_REST_URL || '',
    token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
  },
  messages,
};
