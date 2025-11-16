import Fastify, { type FastifyInstance } from 'fastify';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createRateLimitConfig } from '../../config/rateLimitRules';

process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = process.env.DATABASE_URL || ':memory:';
process.env.JWT_SECRET =
  process.env.JWT_SECRET || 'test_jwt_secret_value_that_is_long_enough_123456';
process.env.JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || 'test_refresh_secret_value_that_is_long_enough_654321';
process.env.ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS || 'http://localhost:3000';

const buildTestApp = async () => {
  const app = Fastify();
  const rateLimitPlugin = (await import('../../plugins/rateLimit.js')).default;
  await app.register(rateLimitPlugin);

  app.post(
    '/api/auth/login',
    {
      config: {
        rateLimit: createRateLimitConfig('login'),
      },
    },
    async (_request, reply) => {
      return reply.status(401).send({ error: 'invalid_credentials' });
    },
  );

  app.get(
    '/api/products',
    {
      config: {
        rateLimit: createRateLimitConfig('publicApi'),
      },
    },
    async () => {
      return { products: [] };
    },
  );

  app.get('/api/public-data', async () => {
    return { ok: true };
  });

  app.get(
    '/api/reset-test',
    {
      config: {
        rateLimit: {
          max: 2,
          timeWindow: 1000,
        },
      },
    },
    async () => {
      return { ok: true };
    },
  );

  return app;
};

const createAccessToken = async () => {
  const { generateAccessToken } = await import('../../services/authService.js');
  return generateAccessToken({
    userId: 9999,
    email: 'rate-limit-tester@pureza.local',
  });
};

describe('Rate Limiting', () => {
  let app: FastifyInstance;

  beforeEach(async () => {
    app = await buildTestApp();
    await app.ready();
  });

  afterEach(async () => {
    await app.close();
  });

  it('should block after exceeding login rate limit', async () => {
    const payload = { email: 'user@test.com', password: 'invalid' };

    for (let i = 0; i < 5; i += 1) {
      const response = await app.inject({
        method: 'POST',
        url: '/api/auth/login',
        payload,
      });
      expect(response.statusCode).toBe(401);
    }

    const blockedResponse = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload,
    });

    expect(blockedResponse.statusCode).toBe(429);
    expect(blockedResponse.json()).toMatchObject({
      error: 'Too Many Requests',
    });
  });

  it('should include rate limit headers on catalogue requests', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/products',
    });

    expect(response.headers).toHaveProperty('x-ratelimit-limit');
    expect(response.headers).toHaveProperty('x-ratelimit-remaining');
    expect(response.headers).toHaveProperty('x-ratelimit-reset');
  });

  it('should allow more requests for authenticated users', async () => {
    // First exhaust anonymous quota
    let latestAnonStatus = 200;
    for (let i = 0; i < 110; i += 1) {
      const response = await app.inject({
        method: 'GET',
        url: '/api/public-data',
      });
      latestAnonStatus = response.statusCode;
      if (latestAnonStatus === 429) {
        break;
      }
    }
    expect(latestAnonStatus).toBe(429);

    const token = await createAccessToken();
    let blockedAuthRequest = false;

    for (let i = 0; i < 150; i += 1) {
      const response = await app.inject({
        method: 'GET',
        url: '/api/public-data',
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      if (response.statusCode === 429) {
        blockedAuthRequest = true;
        break;
      }
    }

    expect(blockedAuthRequest).toBe(false);
  });

  it('should reset rate limit counters after the configured window', async () => {
    await app.inject({ method: 'GET', url: '/api/reset-test' });
    await app.inject({ method: 'GET', url: '/api/reset-test' });

    const blocked = await app.inject({ method: 'GET', url: '/api/reset-test' });
    expect(blocked.statusCode).toBe(429);

    await new Promise((resolve) => setTimeout(resolve, 1100));

    const afterWait = await app.inject({ method: 'GET', url: '/api/reset-test' });
    expect(afterWait.statusCode).toBe(200);
  });
});
