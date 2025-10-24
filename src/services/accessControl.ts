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
    const userPnJid = msg.key.participantPn || msg.key.remoteJid;
    const isGroup = msg.key.remoteJid?.endsWith('@g.us');

    console.log('🔍 Access Check - userJid:', userJid);
    console.log('🔍 Access Check - userPnJid:', userPnJid);
    console.log('🔍 Access Check - configOwner:', config.ownerNumber);

    const isOwner = this.isOwner(userJid) || this.isOwner(userPnJid);
    console.log('🔍 Access Check - isOwner:', isOwner);

    let isAdmin = false;
    if (isGroup) {
      isAdmin = await this.isGroupAdmin(msg);
      console.log('🔍 Access Check - isAdmin:', isAdmin);
    }

    const hasAccess = await db.hasAccess(userJid) || await db.hasAccess(userPnJid);
    console.log('🔍 Access Check - hasAccess:', hasAccess);

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
      if (!groupMetadata) {return false;}

      const userJid = msg.key.participant || msg.key.remoteJid;
      const userPnJid = msg.key.participantPn;

      const participant = groupMetadata.participants?.find((p: any) => {
        return p.id === userJid || p.id === userPnJid || p.pn === userPnJid;
      });

      return participant?.admin === 'admin' || participant?.admin === 'superadmin';
    } catch (error) {
      console.error('❌ Error checking admin status:', error);
      return false;
    }
  }

  // -- canExecuteCommand --
  canExecuteCommand(permissions: UserPermissions, commandRole: 'normal' | 'akses' | 'admin' | 'owner'): boolean {
    if (permissions.isOwner) {
      return true;
    }

    if (commandRole === 'owner') {
      return false;
    }

    if (commandRole === 'admin') {
      return permissions.isAdmin && permissions.hasAccess;
    }

    if (commandRole === 'akses') {
      return permissions.hasAccess;
    }

    return true;
  }
}

export const accessControl = new AccessControlService();
