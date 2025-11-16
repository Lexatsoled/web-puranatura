import { and, desc, eq, gt, lt } from 'drizzle-orm';
import { createHash, randomBytes } from 'crypto';
import { db } from '../db/client';
import { sessions, type DbSession } from '../db/schema';
import { cacheService } from './cacheService.js';
import { config } from '../config/index.js';

const NOW = () => new Date();
const SESSION_CACHE_TTL = config.CACHE_TTL_SESSIONS ?? 86400;

export class SessionService {
  private static hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  static getTokenHash(token: string): string {
    return this.hashToken(token);
  }

  private static sessionCacheKey(tokenHash: string) {
    return `session:${tokenHash}`;
  }

  private static async cacheSession(session: DbSession) {
    const ttlMs = session.expiresAt.getTime() - Date.now();
    const ttlSeconds = Math.max(1, Math.ceil(ttlMs / 1000));
    const cacheTtl = Math.min(ttlSeconds, SESSION_CACHE_TTL);
    await cacheService.set(this.sessionCacheKey(session.tokenHash), session, cacheTtl);
  }

  private static async getCachedSession(tokenHash: string): Promise<DbSession | null> {
    return cacheService.get<DbSession>(this.sessionCacheKey(tokenHash));
  }

  private static async dropCachedSession(tokenHash: string): Promise<void> {
    await cacheService.delete(this.sessionCacheKey(tokenHash));
  }

  static async createSession(params: {
    userId: string;
    familyId: string;
    token: string;
    userAgent?: string;
    ipAddress?: string;
    expiresAt: Date;
  }): Promise<DbSession> {
    const sessionId = randomBytes(16).toString('hex');
    const tokenHash = this.hashToken(params.token);

    const [session] = await db
      .insert(sessions)
      .values({
        id: sessionId,
        userId: params.userId,
        familyId: params.familyId,
        tokenHash,
        userAgent: params.userAgent,
        ipAddress: params.ipAddress,
        expiresAt: params.expiresAt,
      })
      .returning();

    await this.cacheSession(session);
    return session;
  }

  static async detectReuse(token: string): Promise<boolean> {
    const tokenHash = this.hashToken(token);
    const cached = await this.getCachedSession(tokenHash);
    if (cached) {
      return cached.lastUsedAt !== null;
    }

    const [session] = await db
      .select()
      .from(sessions)
      .where(eq(sessions.tokenHash, tokenHash))
      .limit(1);

    if (!session) {
      return false;
    }

    await this.cacheSession(session);
    return session.lastUsedAt !== null;
  }

  static async verifyToken(token: string): Promise<DbSession | null> {
    const tokenHash = this.hashToken(token);
    let session = await this.getCachedSession(tokenHash);

    if (!session) {
      const [record] = await db
        .select()
        .from(sessions)
        .where(eq(sessions.tokenHash, tokenHash))
        .limit(1);

      if (!record) {
        return null;
      }

      session = record;
    }

    if (!session) {
      return null;
    }

    if (session.isRevoked) {
      return null;
    }

    if (session.expiresAt <= NOW()) {
      await this.revokeSession(session.id, 'expired');
      await this.dropCachedSession(tokenHash);
      return null;
    }

    const lastUsedAt = NOW();
    await db
      .update(sessions)
      .set({ lastUsedAt })
      .where(eq(sessions.id, session.id));

    const updatedSession = { ...session, lastUsedAt };
    await this.cacheSession(updatedSession);
    return updatedSession;
  }

  static async revokeSession(sessionId: string, reason: string): Promise<void> {
    const existing = await db
      .select({ tokenHash: sessions.tokenHash })
      .from(sessions)
      .where(eq(sessions.id, sessionId))
      .get();

    await db
      .update(sessions)
      .set({
        isRevoked: true,
        revokedAt: NOW(),
        revokedReason: reason,
      })
      .where(eq(sessions.id, sessionId));

    if (existing?.tokenHash) {
      await this.dropCachedSession(existing.tokenHash);
    }
  }

  static async revokeByToken(token: string, reason: string): Promise<void> {
    const tokenHash = this.hashToken(token);

    await db
      .update(sessions)
      .set({
        isRevoked: true,
        revokedAt: NOW(),
        revokedReason: reason,
      })
      .where(and(eq(sessions.tokenHash, tokenHash), eq(sessions.isRevoked, false)));

    await this.dropCachedSession(tokenHash);
  }

  static async revokeFamilyTokens(familyId: string, reason: string): Promise<void> {
    const affected = await db
      .select({ tokenHash: sessions.tokenHash })
      .from(sessions)
      .where(and(eq(sessions.familyId, familyId), eq(sessions.isRevoked, false)));

    await db
      .update(sessions)
      .set({
        isRevoked: true,
        revokedAt: NOW(),
        revokedReason: reason,
      })
      .where(and(eq(sessions.familyId, familyId), eq(sessions.isRevoked, false)));

    await Promise.all(affected.map(({ tokenHash }) => this.dropCachedSession(tokenHash)));
  }

  static async revokeUserSessions(userId: string, reason: string): Promise<void> {
    const affected = await db
      .select({ tokenHash: sessions.tokenHash })
      .from(sessions)
      .where(and(eq(sessions.userId, userId), eq(sessions.isRevoked, false)));

    await db
      .update(sessions)
      .set({
        isRevoked: true,
        revokedAt: NOW(),
        revokedReason: reason,
      })
      .where(and(eq(sessions.userId, userId), eq(sessions.isRevoked, false)));

    await Promise.all(affected.map(({ tokenHash }) => this.dropCachedSession(tokenHash)));
  }

  static async getUserSessions(userId: string): Promise<DbSession[]> {
    return db
      .select()
      .from(sessions)
      .where(
        and(eq(sessions.userId, userId), eq(sessions.isRevoked, false), gt(sessions.expiresAt, NOW())),
      )
      .orderBy(desc(sessions.createdAt));
  }

  static async cleanupExpiredSessions(): Promise<number> {
    const deleted = await db
      .delete(sessions)
      .where(lt(sessions.expiresAt, NOW()))
      .returning({ tokenHash: sessions.tokenHash });

    await Promise.all(deleted.map(({ tokenHash }) => this.dropCachedSession(tokenHash)));
    return deleted.length;
  }
}

export type Session = DbSession;
