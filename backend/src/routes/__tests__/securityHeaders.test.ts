import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { FastifyInstance } from 'fastify';
import { buildApp } from '../../app.js';

process.env.JWT_SECRET =
  process.env.JWT_SECRET || 'test_jwt_secret_value_that_is_long_enough_123456789';
process.env.JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || 'test_refresh_secret_value_that_is_long_enough_987654321';
process.env.COOKIE_SECRET = process.env.COOKIE_SECRET || 'cookie_secret_for_tests_123456789';
process.env.DATABASE_URL = process.env.DATABASE_URL || ':memory:';

describe('Security headers', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await buildApp({ logger: false });
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('exposes a strict CSP by default', async () => {
    const response = await app.inject({ method: 'GET', url: '/health' });
    const csp = response.headers['content-security-policy'];
    expect(csp).toBeDefined();
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("frame-ancestors 'none'");
  });

  it('returns HSTS and nosniff headers', async () => {
    const response = await app.inject({ method: 'GET', url: '/health' });
    expect(response.headers['strict-transport-security']).toBeDefined();
    expect(response.headers['x-content-type-options']).toBe('nosniff');
  });

  it('enforces permissions policy for sensitive APIs', async () => {
    const response = await app.inject({ method: 'GET', url: '/health' });
    const policy = response.headers['permissions-policy'];
    expect(policy).toBeDefined();
    expect(policy).toContain('geolocation=()');
    expect(policy).toContain('camera=()');
    expect(policy).toContain('payment=(self)');
  });

  it('clears site data on logout response', async () => {
    const csrfResponse = await app.inject({ method: 'GET', url: '/api/csrf-token' });
    const { csrfToken } = csrfResponse.json<{ csrfToken: string }>();
    const rawCookies = csrfResponse.headers['set-cookie'];
    const cookieHeader = Array.isArray(rawCookies)
      ? rawCookies.map((cookie) => cookie.split(';')[0]).join('; ')
      : rawCookies?.split(';')[0];

    const response = await app.inject({
      method: 'POST',
      url: '/api/auth/logout',
      headers: {
        'Content-Type': 'application/json',
        'x-csrf-token': csrfToken,
        ...(cookieHeader ? { cookie: cookieHeader } : {}),
      },
      payload: {},
    });

    expect(response.statusCode).toBe(200);
    const clearHeader = response.headers['clear-site-data'];
    expect(clearHeader).toBeDefined();
    expect(clearHeader).toContain('cache');
    expect(clearHeader).toContain('cookies');
    expect(clearHeader).toContain('storage');
  });

  it('accepts CSP violation reports', async () => {
    const csrfResponse = await app.inject({ method: 'GET', url: '/api/csrf-token' });
    const { csrfToken } = csrfResponse.json<{ csrfToken: string }>();
    const rawCookies = csrfResponse.headers['set-cookie'];
    const cookieHeader = Array.isArray(rawCookies)
      ? rawCookies.map((cookie) => cookie.split(';')[0]).join('; ')
      : rawCookies?.split(';')[0];

    const violation = {
      'csp-report': {
        'document-uri': 'https://purezanaturalis.com/',
        'violated-directive': 'script-src',
        'effective-directive': 'script-src',
        'original-policy': "default-src 'self'",
        disposition: 'enforce' as const,
        'blocked-uri': 'https://evil.com/malicious.js',
      },
    };

    const response = await app.inject({
      method: 'POST',
      url: '/api/csp-report',
      headers: {
        'Content-Type': 'application/csp-report',
        'x-csrf-token': csrfToken,
        ...(cookieHeader ? { cookie: cookieHeader } : {}),
      },
      payload: violation,
    });

    expect(response.statusCode).toBe(204);
  });
});
