import { beforeEach, describe, expect, it } from 'vitest';
import { SessionService } from '../sessionService';
import { db } from '../../db/client';
import { sessions } from '../../db/schema';
import { cacheService } from '../cacheService';

describe('SessionService', () => {
  beforeEach(async () => {
    await db.delete(sessions);
    await cacheService.clear();
  });

  it('should create session', async () => {
    const expiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const session = await SessionService.createSession({
      userId: 'user-123',
      familyId: 'family-abc',
      token: 'token-xyz',
      expiresAt: expiry,
    });

    expect(session).toBeDefined();
    expect(session.userId).toBe('user-123');
    expect(session.familyId).toBe('family-abc');
  });

  it('should detect token reuse after verification', async () => {
    const token = 'reusable-token';
    await SessionService.createSession({
      userId: 'user-123',
      familyId: 'family-abc',
      token,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    await SessionService.verifyToken(token);
    const isReused = await SessionService.detectReuse(token);
    expect(isReused).toBe(true);
  });

  it('should revoke family tokens', async () => {
    await SessionService.createSession({
      userId: 'user-123',
      familyId: 'family-test',
      token: 'token-1',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    await SessionService.createSession({
      userId: 'user-123',
      familyId: 'family-test',
      token: 'token-2',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    await SessionService.revokeFamilyTokens('family-test', 'test');
    const userSessions = await SessionService.getUserSessions('user-123');
    expect(userSessions.length).toBe(0);
  });

  it('should cleanup expired sessions', async () => {
    await SessionService.createSession({
      userId: 'user-123',
      familyId: 'family-cleanup',
      token: 'expired-token',
      expiresAt: new Date(Date.now() - 1000),
    });

    const deleted = await SessionService.cleanupExpiredSessions();
    expect(deleted).toBeGreaterThanOrEqual(1);
  });
});
