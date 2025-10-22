import { Redis } from '@upstash/redis';
import { config } from '../config';

class DatabaseService {
  private redis: Redis | null = null;

  // -- initialize --
  initialize(): void {
    if (!config.redis.url || !config.redis.token) {
      console.warn('⚠️ Redis credentials not configured. Access control disabled.');
      return;
    }

    this.redis = new Redis({
      url: config.redis.url,
      token: config.redis.token,
    });

    console.log('✅ Redis connected');
  }

  // -- isConnected --
  isConnected(): boolean {
    return this.redis !== null;
  }

  // -- addAccess --
  async addAccess(userJid: string): Promise<boolean> {
    if (!this.redis) return false;
    
    try {
      await this.redis.sadd('bot:access:users', userJid);
      return true;
    } catch (error) {
      console.error('❌ Error adding access:', error);
      return false;
    }
  }

  // -- removeAccess --
  async removeAccess(userJid: string): Promise<boolean> {
    if (!this.redis) return false;
    
    try {
      await this.redis.srem('bot:access:users', userJid);
      return true;
    } catch (error) {
      console.error('❌ Error removing access:', error);
      return false;
    }
  }

  // -- hasAccess --
  async hasAccess(userJid: string): Promise<boolean> {
    if (!this.redis) return false;
    
    try {
      const result = await this.redis.sismember('bot:access:users', userJid);
      return result === 1;
    } catch (error) {
      console.error('❌ Error checking access:', error);
      return false;
    }
  }

  // -- listAccess --
  async listAccess(): Promise<string[]> {
    if (!this.redis) return [];
    
    try {
      const users = await this.redis.smembers('bot:access:users');
      return users as string[];
    } catch (error) {
      console.error('❌ Error listing access:', error);
      return [];
    }
  }
}

export const db = new DatabaseService();
