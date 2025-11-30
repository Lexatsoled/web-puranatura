// @vitest-environment node
import request from 'supertest';
import { afterAll, describe, it, expect, vi } from 'vitest';

process.env.BACKEND_ENV_PATH = './backend/.env';
process.env.DATABASE_URL = 'file:./backend/test-auth.sqlite';
process.env.JWT_SECRET = 'test';
process.env.JWT_REFRESH_SECRET = 'refresh';
process.env.NODE_ENV = 'test';
// Make the per-route auth limiter strict & small for tests so we can assert it
process.env.AUTH_RATE_LIMIT_MAX = '1';
process.env.AUTH_RATE_LIMIT_WINDOW = '60000';

import { app, closeApp } from '../backend/src/app';
import { prisma } from '../backend/src/prisma';
// refreshStore not used in this test file; removed to avoid unused imports
import bcrypt from 'bcryptjs';

afterAll(async () => {
  vi.restoreAllMocks();
  await closeApp();
});

describe('Auth routes (/api/auth)', () => {
  it('POST /register creates a user and sets HttpOnly cookies', async () => {
    // Mock DB to simulate new user
    vi.spyOn(prisma.user, 'findUnique').mockResolvedValue(null as any);
    // return a resolved value for create to keep types compatible with Prisma client
    vi.spyOn(prisma.user, 'create').mockResolvedValue({
      id: 'u-1',
      email: 'alice@example.com',
      firstName: 'Alice',
      lastName: 'Smith',
      phone: null,
    } as any);

    const agent = request.agent(app);
    // Get CSRF cookie first (middleware emits it on safe requests)
    const pre = await agent.get('/');
    const setCookieHeader = pre.headers['set-cookie'];
    const cookiesArr = Array.isArray(setCookieHeader)
      ? setCookieHeader
      : setCookieHeader
        ? [String(setCookieHeader)]
        : [];
    const csrfCookie = cookiesArr.find((c: string) =>
      c.startsWith('csrfToken=')
    );
    const csrfToken = csrfCookie?.split(';')[0].split('=')[1];

    const res = await agent
      .post('/api/auth/register')
      .set('x-csrf-token', String(csrfToken))
      .send({
        email: 'alice@example.com',
        password: 'password123',
        firstName: 'Alice',
        lastName: 'Smith',
      });

    expect(res.status).toBe(201);
    expect(res.body.user).toBeDefined();
    expect(res.body.user.email).toBe('alice@example.com');

    // Cookies must include token and refreshToken and be HttpOnly
    const cookies = Array.isArray(res.headers['set-cookie'])
      ? res.headers['set-cookie']
      : res.headers['set-cookie']
        ? [String(res.headers['set-cookie'])]
        : [];
    expect(cookies.some((c: string) => c.includes('token='))).toBe(true);
    expect(cookies.some((c: string) => c.includes('refreshToken='))).toBe(true);
    // HttpOnly flag present
    expect(cookies.every((c: string) => /HttpOnly/i.test(c))).toBe(true);
  });

  it('POST /login authenticates and issues HttpOnly cookies', async () => {
    const password = 'password123';
    const hashed = bcrypt.hashSync(password, 10);
    vi.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce({
      id: 'u-2',
      email: 'bob@example.com',
      passwordHash: hashed,
      firstName: 'Bob',
      lastName: 'Jones',
      phone: null,
    } as any);

    const agent = request.agent(app);
    const pre = await agent.get('/');
    const setCookieHeader_login = pre.headers['set-cookie'];
    const cookiesArr_login = Array.isArray(setCookieHeader_login)
      ? setCookieHeader_login
      : setCookieHeader_login
        ? [String(setCookieHeader_login)]
        : [];
    const csrfCookie = cookiesArr_login.find((c: string) =>
      c.startsWith('csrfToken=')
    );
    const csrfToken = csrfCookie?.split(';')[0].split('=')[1];

    const res = await agent
      .post('/api/auth/login')
      .set('x-csrf-token', String(csrfToken))
      .send({
        email: 'bob@example.com',
        password,
      });

    expect(res.status).toBe(200);
    expect(res.body.user).toBeDefined();
    const cookies = Array.isArray(res.headers['set-cookie'])
      ? res.headers['set-cookie']
      : res.headers['set-cookie']
        ? [String(res.headers['set-cookie'])]
        : [];
    expect(cookies.some((c: string) => c.includes('token='))).toBe(true);
    expect(cookies.some((c: string) => c.includes('refreshToken='))).toBe(true);
    expect(cookies.every((c: string) => /HttpOnly/i.test(c))).toBe(true);
  });

  it('GET /me returns user when token cookie supplied (via login flow)', async () => {
    // Prepare login credentials and mocked DB lookup
    const password = 'sessionpass';
    const hashed = bcrypt.hashSync(password, 10);

    // First call to findUnique during login should return the user with passwordHash
    vi.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce({
      id: 'u-3',
      email: 'carla@example.com',
      passwordHash: hashed,
      firstName: 'Carla',
      lastName: 'Diaz',
      phone: null,
    } as any);

    const agent = request.agent(app);
    const pre = await agent.get('/');
    const setCookieHeader_me = pre.headers['set-cookie'];
    const cookiesArr_me = Array.isArray(setCookieHeader_me)
      ? setCookieHeader_me
      : setCookieHeader_me
        ? [String(setCookieHeader_me)]
        : [];
    const csrfCookie = cookiesArr_me.find((c: string) =>
      c.startsWith('csrfToken=')
    );
    const csrfToken = csrfCookie?.split(';')[0].split('=')[1];

    // login to obtain cookies
    const loginRes = await agent
      .post('/api/auth/login')
      .set('x-csrf-token', String(csrfToken))
      .send({
        email: 'carla@example.com',
        password,
      });

    expect(loginRes.status).toBe(200);

    // Now call /me using the same agent (cookies preserved)
    // Ensure findUnique is mocked for the subsequent /me lookup too
    vi.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce({
      id: 'u-3',
      email: 'carla@example.com',
      firstName: 'Carla',
      lastName: 'Diaz',
      phone: null,
    } as any);

    const res = await agent.get('/api/auth/me');
    expect(res.status).toBe(200);
    expect(res.body.user).toBeDefined();
    expect(res.body.user.email).toBe('carla@example.com');
  });

  it('POST /logout clears cookies', async () => {
    const agent = request.agent(app);
    const pre = await agent.get('/');
    const setCookieHeader_logout = pre.headers['set-cookie'];
    const cookiesArr_logout = Array.isArray(setCookieHeader_logout)
      ? setCookieHeader_logout
      : setCookieHeader_logout
        ? [String(setCookieHeader_logout)]
        : [];
    const csrfCookie = cookiesArr_logout.find((c: string) =>
      c.startsWith('csrfToken=')
    );
    const csrfToken = csrfCookie?.split(';')[0].split('=')[1];

    const res = await agent
      .post('/api/auth/logout')
      .set('x-csrf-token', String(csrfToken));
    expect(res.status).toBe(200);
    const cookies = Array.isArray(res.headers['set-cookie'])
      ? res.headers['set-cookie']
      : res.headers['set-cookie']
        ? [String(res.headers['set-cookie'])]
        : [];
    // expect cookies cleared (expiration set) and HttpOnly cleared as well
    expect(cookies.some((c: string) => c.includes('token=;'))).toBe(true);
    expect(cookies.some((c: string) => c.includes('refreshToken=;'))).toBe(
      true
    );
  });

  it('POST /refresh rotates refresh token and updates cookies', async () => {
    // Do a register/login sequence to obtain cookies (refresh token persisted)
    const password = 'refreshpass';
    const hashed = bcrypt.hashSync(password, 10);

    // login mock
    vi.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce({
      id: 'u-4',
      email: 'diana@example.com',
      passwordHash: hashed,
      firstName: 'Diana',
      lastName: 'Prince',
      phone: null,
    } as any);

    const agent = request.agent(app);
    const pre = await agent.get('/');
    const setCookieHeader_refresh = pre.headers['set-cookie'];
    const cookiesArr_refresh = Array.isArray(setCookieHeader_refresh)
      ? setCookieHeader_refresh
      : setCookieHeader_refresh
        ? [String(setCookieHeader_refresh)]
        : [];
    const csrfCookie = cookiesArr_refresh.find((c: string) =>
      c.startsWith('csrfToken=')
    );
    const csrfToken = csrfCookie?.split(';')[0].split('=')[1];

    const loginRes = await agent
      .post('/api/auth/login')
      .set('x-csrf-token', String(csrfToken))
      .send({
        email: 'diana@example.com',
        password,
      });
    expect(loginRes.status).toBe(200);

    // Now hit /refresh using the same agent (cookies persisted & refresh token present)
    const res = await agent
      .post('/api/auth/refresh')
      .set('x-csrf-token', String(csrfToken));
    expect(res.status).toBe(200);
    const cookies = Array.isArray(res.headers['set-cookie'])
      ? res.headers['set-cookie']
      : res.headers['set-cookie']
        ? [String(res.headers['set-cookie'])]
        : [];
    expect(cookies.some((c: string) => c.includes('token='))).toBe(true);
    expect(cookies.some((c: string) => c.includes('refreshToken='))).toBe(true);
    expect(cookies.every((c: string) => /HttpOnly/i.test(c))).toBe(true);
  });

  it('POST /login is rate-limited after configured attempts', async () => {
    // configure a user exists but with wrong password attempts to trigger limiter
    const hashed = bcrypt.hashSync('correctpass', 10);
    vi.spyOn(prisma.user, 'findUnique').mockResolvedValue({
      id: 'u-rate',
      email: 'rate@example.com',
      passwordHash: hashed,
      firstName: 'Rate',
      lastName: 'Limit',
      phone: null,
    } as any);

    const agent = request.agent(app);
    const pre = await agent.get('/');
    const setCookieHeader = pre.headers['set-cookie'];
    const cookiesArr = Array.isArray(setCookieHeader)
      ? setCookieHeader
      : setCookieHeader
        ? [String(setCookieHeader)]
        : [];
    const csrfCookie = cookiesArr.find((c: string) => c.startsWith('csrfToken='));
    const csrfToken = csrfCookie?.split(';')[0].split('=')[1];

    // Make requests until we hit limit (AUTH_RATE_LIMIT_MAX is 2)
    const attempt1 = await agent
      .post('/api/auth/login')
      .set('x-csrf-token', String(csrfToken))
      .set('x-rate-key', 'test-client')
      .set('x-rate-max', '1')
      .send({ email: 'rate@example.com', password: 'wrongpw' });
    expect([401, 429].includes(attempt1.status)).toBe(true);

    const attempt2 = await agent
      .post('/api/auth/login')
      .set('x-csrf-token', String(csrfToken))
      .set('x-rate-key', 'test-client')
      .set('x-rate-max', '1')
      .send({ email: 'rate@example.com', password: 'wrongpw' });
    // second attempt should still be allowed (401) or could be the last allowed one
    expect([401, 429].includes(attempt2.status)).toBe(true);

    const attempt3 = await agent
      .post('/api/auth/login')
      .set('x-csrf-token', String(csrfToken))
      .set('x-rate-key', 'test-client')
      .set('x-rate-max', '1')
      .send({ email: 'rate@example.com', password: 'wrongpw' });
    // after exceeding the small limit (2) we should receive 429
    expect(attempt3.status).toBe(429);
    expect(attempt3.body).toHaveProperty('code', 'RATE_LIMIT_EXCEEDED');
  });
});
