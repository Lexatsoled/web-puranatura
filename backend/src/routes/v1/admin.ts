import type { FastifyInstance } from 'fastify';
import { redis, isRedisEnabled } from '../../config/redis';
import { requireRole } from '../../middleware/auth';
import { createRateLimitConfig } from '../../config/rateLimitRules';

export async function adminRoutes(app: FastifyInstance) {
  const ensureAdmin = requireRole('admin');

  app.get(
    '/admin/rate-limit-stats',
    {
      preHandler: [ensureAdmin],
      config: {
        rateLimit: createRateLimitConfig('admin'),
      },
    },
    async (_request, reply) => {
      if (!isRedisEnabled || !redis) {
        return reply.code(400).send({ error: 'Redis not configured' });
      }

      const keys = await redis.keys('fastify-rate-limit:*');
      const stats = await Promise.all(
        keys.map(async (key) => {
          const ttl = redis ? await redis.pttl(key) : -1;
          const value = redis ? await redis.get(key) : null;
          return {
            identifier: key.replace('fastify-rate-limit:', ''),
            requests: Number(value ?? '0'),
            resetInSeconds: ttl >= 0 ? Math.ceil(ttl / 1000) : null,
          };
        }),
      );

      stats.sort((a, b) => b.requests - a.requests);

      return {
        total: stats.length,
        topAbusers: stats.slice(0, 10),
      };
    },
  );

  app.delete(
    '/admin/rate-limit-reset/:identifier',
    {
      preHandler: [ensureAdmin],
      config: {
        rateLimit: createRateLimitConfig('admin'),
      },
    },
    async (request, reply) => {
      if (!isRedisEnabled || !redis) {
        return reply.code(400).send({ error: 'Redis not configured' });
      }

      const { identifier } = request.params as { identifier: string };
      const key = `fastify-rate-limit:${identifier}`;
      const removed = await redis.del(key);

      return {
        message: removed ? 'Rate limit reset successfully' : 'No rate limit entry found',
      };
    },
  );
}
