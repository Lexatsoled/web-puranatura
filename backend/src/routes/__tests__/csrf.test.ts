import Fastify, { type FastifyInstance } from 'fastify';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import csrfPlugin from '../../plugins/csrf.js';
import { csrfRoutes } from '../csrf.js';

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_jwt_secret_value_that_is_long_enough_123456';
process.env.COOKIE_SECRET = process.env.COOKIE_SECRET || 'test_cookie_secret_value_that_is_long_enough_654321';

const buildApp = async () => {
  const app = Fastify();

  await app.register(csrfPlugin);
  await app.register(csrfRoutes, { prefix: '/api' });

  app.post('/api/protected', async (_request, reply) => {
    return reply.send({ ok: true });
  });

  return app;
};

const extractCookies = (setCookieHeader?: string | string[]) => {
  if (!setCookieHeader) return '';
  const cookies = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];
  return cookies
    .map((cookie) => cookie.split(';')[0])
    .filter(Boolean)
    .join('; ');
};

describe('CSRF protection', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await buildApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should provide CSRF token via API', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/csrf-token',
    });

    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(typeof body.csrfToken).toBe('string');
    expect(body.csrfToken.length).toBeGreaterThanOrEqual(16);
    expect(response.headers).toHaveProperty('set-cookie');
  });

  it('should reject POST without token', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/protected',
      payload: { hello: 'world' },
    });

    expect(response.statusCode).toBe(403);
  });

  it('should accept POST with valid CSRF token', async () => {
    const tokenResponse = await app.inject({ method: 'GET', url: '/api/csrf-token' });
    const { csrfToken } = tokenResponse.json();
    const cookieHeader = extractCookies(tokenResponse.headers['set-cookie']);

    const response = await app.inject({
      method: 'POST',
      url: '/api/protected',
      headers: {
        'x-csrf-token': csrfToken,
        cookie: cookieHeader,
      },
      payload: { hello: 'world' },
    });

    // eslint-disable-next-line no-console
    console.log('valid token response', response.statusCode, response.body);

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ ok: true });
  });

  it('should reject POST with invalid CSRF token', async () => {
    const tokenResponse = await app.inject({ method: 'GET', url: '/api/csrf-token' });
    const cookieHeader = extractCookies(tokenResponse.headers['set-cookie']);

    const response = await app.inject({
      method: 'POST',
      url: '/api/protected',
      headers: {
        'x-csrf-token': 'invalid-token',
        cookie: cookieHeader,
      },
      payload: { hello: 'world' },
    });

    expect(response.statusCode).toBe(403);
  });
});
