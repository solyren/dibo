import type { UserPermissions } from '../types';
import { config } from '../config';
import { db } from './database';

class AccessControlService {
  // -- normalizeJid --
  private normalizeJid(jid: string): string {
    if (jid.includes('@')) {
      return jid.split('@')[0];
    }
    return jid.replace(/[^0-9]/g, '');
  }

  // -- getUserPermissions --
  async getUserPermissions(msg: any): Promise<UserPermissions> {
    const userJid = msg.key.participant || msg.key.remoteJid;
    const isGroup = msg.key.remoteJid?.endsWith('@g.us');

    const isOwner = this.isOwner(userJid);
    
    let isAdmin = false;
    if (isGroup) {
      isAdmin = await this.isGroupAdmin(msg);
    }

    const hasAccess = await db.hasAccess(userJid);

    return { isOwner, isAdmin, hasAccess };
  }

  // -- isOwner --
  isOwner(userJid: string): boolean {
    const normalizedUserJid = this.normalizeJid(userJid);
    const normalizedOwner = this.normalizeJid(config.ownerNumber);
    return normalizedUserJid === normalizedOwner;
  }

  // -- isGroupAdmin --
  async isGroupAdmin(msg: any): Promise<boolean> {
    try {
      const groupMetadata = await (msg as any)._sock?.groupMetadata?.(msg.key.remoteJid);
      if (!groupMetadata) return false;

      const userJid = msg.key.participant || msg.key.remoteJid;
      const participant = groupMetadata.participants?.find((p: any) => p.id === userJid);
      
      return participant?.admin === 'admin' || participant?.admin === 'superadmin';
    } catch (error) {
      console.error('❌ Error checking admin status:', error);
      return false;
    }
  }

  // -- canExecuteCommand --
  canExecuteCommand(permissions: UserPermissions, commandRole: 'normal' | 'admin' | 'owner'): boolean {
    // Owner can access everything
    if (permissions.isOwner) {
      return true;
    }

    // Owner-only commands
    if (commandRole === 'owner') {
      return false;
    }

    // Admin commands: need to be group admin AND have access
    if (commandRole === 'admin') {
      return permissions.isAdmin && permissions.hasAccess;
    }

    // Normal commands: everyone can access
    return true;
  }
}

export const accessControl = new AccessControlService();
