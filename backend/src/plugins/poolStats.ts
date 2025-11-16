import type { FastifyPluginAsync } from 'fastify';
import { getConnectionPool, getWALManager } from '../db/index.js';
import { requireRole } from '../middleware/auth.js';
import { createRateLimitConfig } from '../config/rateLimitRules.js';

const poolStatsPlugin: FastifyPluginAsync = async (fastify) => {
  const ensureAdmin = requireRole('admin');

  fastify.get(
    '/api/admin/pool-stats',
    {
      preHandler: [ensureAdmin],
      config: {
        rateLimit: createRateLimitConfig('admin'),
      },
    },
    async (_request, reply) => {
      const pool = getConnectionPool();
      const wal = getWALManager().getWALInfo();
      return reply.send({
        pool: pool.getStats(),
        wal,
      });
    },
  );

  fastify.addHook('onRequest', async (request) => {
    const pool = getConnectionPool();
    const stats = pool.getStats();
    if (stats.inUse >= stats.max * 0.8) {
      request.log.warn({ stats }, 'Connection pool near capacity');
    }
  });
};

export default poolStatsPlugin;
