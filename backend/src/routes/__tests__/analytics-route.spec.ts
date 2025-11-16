import Fastify, { type FastifyReply, type FastifyRequest } from 'fastify';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { analyticsRoutes, vitalsStore } from '../analytics';

const requireRoleMock = vi.fn((role: string) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (request.headers['x-test-admin'] !== '1') {
      reply.status(403).send({ error: 'forbidden' });
    }
  };
});

vi.mock('../../middleware/auth', () => ({
  requireRole: (role: string) => requireRoleMock(role),
}));

describe('analytics routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vitalsStore.length = 0;
  });

  it('rejects admin vitals access without authentication', async () => {
    const app = Fastify();
    await analyticsRoutes(app);
    await app.ready();

    const response = await app.inject({
      method: 'GET',
      url: '/admin/analytics/vitals',
    });

    expect(response.statusCode).toBe(403);
    expect(requireRoleMock).toHaveBeenCalledWith('admin');
  });

  it('rejects payloads larger than 10KB', async () => {
    const app = Fastify();
    await analyticsRoutes(app);
    await app.ready();

    const payload = {
      data: 'x'.repeat(11 * 1024),
    };

    const response = await app.inject({
      method: 'POST',
      url: '/analytics/vitals',
      payload,
      headers: {
        'content-type': 'application/json',
      },
    });

    expect(response.statusCode).toBe(413);
  });

  it('trims vitals store to the last 500 entries', async () => {
    const app = Fastify();
    await analyticsRoutes(app);
    await app.ready();

    for (let i = 0; i < 510; i += 1) {
      await app.inject({
        method: 'POST',
        url: '/analytics/vitals',
        payload: {
          name: 'LCP',
          value: i,
          rating: 'good',
          delta: 1,
          id: `v-${i}`,
        },
        headers: {
          'content-type': 'application/json',
        },
      });
    }

    expect(vitalsStore.length).toBe(500);
    expect(vitalsStore[0].id).toBe('v-10');
    expect(vitalsStore[499].id).toBe('v-509');
  });
});
