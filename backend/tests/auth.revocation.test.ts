// @vitest-environment node
import request from 'supertest';
import {
  afterAll,
  afterEach,
  beforeEach,
  describe,
  it,
  expect,
  vi,
} from 'vitest';

process.env.BACKEND_ENV_PATH = './backend/.env';
process.env.DATABASE_URL = 'file:./backend/test-auth.sqlite';
process.env.JWT_SECRET = 'test';
process.env.JWT_REFRESH_SECRET = 'refresh';
process.env.NODE_ENV = 'test';

import { app, closeApp } from '../backend/src/app';
import { env as backendEnv } from '../backend/src/config/env';
import { prisma } from '../backend/src/prisma';
import * as refreshStore from '../backend/src/storage/refreshTokenStore';
import jwt from 'jsonwebtoken';

afterAll(async () => {
  vi.restoreAllMocks();
  await closeApp();
});

describe('Auth token revocation/rotation', () => {
  // Ensure tests start with a clean refresh-token store to avoid flakiness
  beforeEach(() => {
    try {
      const fs = require('fs');
      const path = require('path');
      const p = path.join(
        process.cwd(),
        'backend',
        'reports',
        'refresh-tokens.json'
      );
      if (fs.existsSync(p)) fs.writeFileSync(p, '[]', 'utf8');
    } catch {
      // ignore
    }
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });
  it('POST /auth/logout revokes refresh token when present (login -> logout flow)', async () => {
    const cli = request.agent(app);
    const initial = await cli.get('/');
    const setCookieHeaderInit = initial.headers['set-cookie'];
    const cookiesArrInit = Array.isArray(setCookieHeaderInit)
      ? setCookieHeaderInit
      : setCookieHeaderInit
        ? [String(setCookieHeaderInit)]
        : [];
    const csrfCookieRaw = cookiesArrInit.find((c: string) =>
      c.startsWith('csrfToken=')
    );
    const csrfToken = csrfCookieRaw?.split(';')[0].split('=')[1];

    const password = 'p@ssword';
    const hashed = require('bcryptjs').hashSync(password, 10);

    vi.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce({
      id: 'user-logout',
      email: 'logout@example.com',
      passwordHash: hashed,
      firstName: 'Logout',
      lastName: 'Tester',
    } as any);

    const loginResponse = await cli
      .post('/api/auth/login')
      .set('x-csrf-token', String(csrfToken))
      .send({ email: 'logout@example.com', password });
    expect(loginResponse.status).toBe(200);

    const setCookieHeaderLogin = loginResponse.headers['set-cookie'];
    const cookiesArrLogin = Array.isArray(setCookieHeaderLogin)
      ? setCookieHeaderLogin
      : setCookieHeaderLogin
        ? [String(setCookieHeaderLogin)]
        : [];
    const refreshSet = cookiesArrLogin.find((c: string) =>
      c.startsWith('refreshToken=')
    );
    expect(refreshSet).toBeDefined();
    const refreshValue = refreshSet!.split(';')[0].split('=')[1];
    const decodedOld = jwt.decode(decodeURIComponent(refreshValue)) as any;
    // (debugging removed)
    const oldJti = decodedOld.jti;
    expect(refreshStore.hasToken(oldJti)).toBe(true);

    const logoutResponse = await cli
      .post('/api/auth/logout')
      .set('x-csrf-token', String(csrfToken));
    expect(logoutResponse.status).toBe(200);
    expect(refreshStore.hasToken(oldJti)).toBe(false);
  });

  it('POST /auth/refresh returns 401 when refresh token not in store', async () => {
    const jti = 'missing-jti';
    const refreshToken = jwt.sign(
      { sub: 'user-2', jti },
      backendEnv.jwtRefreshSecret ||
        process.env.JWT_REFRESH_SECRET ||
        'refresh',
      { expiresIn: '1d' }
    );

    // Force the store to pretend the token isn't known for this call only
    vi.spyOn(refreshStore, 'hasToken').mockReturnValueOnce(false);

    const client = request.agent(app);
    const initial = await client.get('/');
    const setCookieHeaderInit2 = initial.headers['set-cookie'];
    const cookiesArrInit2 = Array.isArray(setCookieHeaderInit2)
      ? setCookieHeaderInit2
      : setCookieHeaderInit2
        ? [String(setCookieHeaderInit2)]
        : [];
    const csrfCookieRaw = cookiesArrInit2.find((c: string) =>
      c.startsWith('csrfToken=')
    );
    const csrfToken = csrfCookieRaw?.split(';')[0].split('=')[1];

    const resp = await client
      .post('/api/auth/refresh')
      .set('Cookie', `refreshToken=${refreshToken}`)
      .set('x-csrf-token', String(csrfToken));

    expect(resp.status).toBe(401);
  });

  it('POST /auth/refresh rotates refresh token and persists new jti', async () => {
    const client = request.agent(app);
    const initial = await client.get('/');
    const setCookieHeaderInit3 = initial.headers['set-cookie'];
    const cookiesArrInit3 = Array.isArray(setCookieHeaderInit3)
      ? setCookieHeaderInit3
      : setCookieHeaderInit3
        ? [String(setCookieHeaderInit3)]
        : [];
    const csrfCookieRaw = cookiesArrInit3.find((c: string) =>
      c.startsWith('csrfToken=')
    );
    const csrfToken = csrfCookieRaw?.split(';')[0].split('=')[1];

    // create a pre-persisted refresh token and store entry
    const oldJti = 'rotate-static-jti';
    const refreshToken = jwt.sign(
      { sub: 'user-rotate', jti: oldJti },
      backendEnv.jwtRefreshSecret ||
        process.env.JWT_REFRESH_SECRET ||
        'refresh',
      { expiresIn: '1d' }
    );
    refreshStore.addToken({
      jti: oldJti,
      userId: 'user-rotate',
      expiresAt: new Date(Date.now() + 86400000).toISOString(),
    });
    // no debug logging

    // Call refresh using explicit cookie value
    const refreshRes = await client
      .post('/api/auth/refresh')
      .set('Cookie', `refreshToken=${refreshToken}`)
      .set('x-csrf-token', String(csrfToken));
    expect(refreshRes.status).toBe(200);

    const setCookieHeaderNew = refreshRes.headers['set-cookie'];
    const cookiesArrNew = Array.isArray(setCookieHeaderNew)
      ? setCookieHeaderNew
      : setCookieHeaderNew
        ? [String(setCookieHeaderNew)]
        : [];
    const newRefreshSet = cookiesArrNew.find((c: string) =>
      c.startsWith('refreshToken=')
    );
    expect(newRefreshSet).toBeDefined();
    const newRefreshValue = newRefreshSet!.split(';')[0].split('=')[1];
    const decodedNew = jwt.decode(decodeURIComponent(newRefreshValue)) as any;
    const newJti = decodedNew.jti;

    // rotation should produce a new jti and the new jti should be persisted
    expect(newJti).not.toBe(oldJti);
    expect(refreshStore.hasToken(newJti)).toBe(true);
    expect(refreshStore.hasToken(oldJti)).toBe(false);
  });
});
