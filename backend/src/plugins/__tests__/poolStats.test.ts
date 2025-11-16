import Fastify from 'fastify';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const stats = { available: 1, inUse: 0, total: 1, max: 5, idleTimeout: 60000 };
const walInfo = { journalMode: 'wal', walCheckpoint: [], walAutoCheckpoint: 1000 };

vi.mock('../../middleware/auth.js', () => ({
  requireRole: () => async () => {},
}));

vi.mock('../../db/index.js', () => {
  const pool = {
    getStats: vi.fn(() => stats),
  };
  const walManager = {
    getWALInfo: vi.fn(() => walInfo),
  };
  return {
    getConnectionPool: () => pool,
    getWALManager: () => walManager,
  };
});

describe('poolStatsPlugin', () => {
  let app: ReturnType<typeof Fastify>;

  beforeEach(async () => {
    app = Fastify();
    const pluginModule = await import('../poolStats.js');
    await app.register(pluginModule.default);
  });

  afterEach(async () => {
    await app.close();
  });

  it('expone endpoint con estadisticas y datos de WAL', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/admin/pool-stats',
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      pool: stats,
      wal: walInfo,
    });
  });
});
