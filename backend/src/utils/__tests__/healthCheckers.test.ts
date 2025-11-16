import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { promises as fs } from 'node:fs';
import { checkDatabase, checkFilesystem, checkMemory, checkRedis } from '../healthCheckers.js';

vi.mock('../../db/index.js', () => {
  const withConnection = vi.fn();
  return {
    getConnectionPool: () => ({
      withConnection,
    }),
    __dbMock: {
      withConnection,
    },
  };
});

vi.mock('../../config/redis.js', () => {
  const redisClient = {
    status: 'ready',
    ping: vi.fn(),
  };
  const connectRedis = vi.fn();

  return {
    redis: redisClient,
    isRedisEnabled: true,
    connectRedis,
    __redisMock: {
      redisClient,
      connectRedis,
    },
  };
});

describe('healthCheckers', () => {
  let dbMock: { withConnection: ReturnType<typeof vi.fn> };
  let redisMock: {
    redisClient: { ping: ReturnType<typeof vi.fn> };
    connectRedis: ReturnType<typeof vi.fn>;
  };

  beforeAll(async () => {
    const dbModule = (await import('../../db/index.js')) as unknown as {
      __dbMock: { withConnection: ReturnType<typeof vi.fn> };
    };
    const redisModule = (await import('../../config/redis.js')) as unknown as {
      __redisMock: {
        redisClient: { ping: ReturnType<typeof vi.fn> };
        connectRedis: ReturnType<typeof vi.fn>;
      };
    };

    dbMock = dbModule.__dbMock;
    redisMock = redisModule.__redisMock;
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('detects database failure', async () => {
    dbMock.withConnection.mockImplementation(() => Promise.reject(new Error('db offline')));
    await expect(checkDatabase()).rejects.toThrow('db offline');
  });

  it('surfaces redis failures', async () => {
    redisMock.redisClient.ping.mockRejectedValue(new Error('redis timeout'));
    await expect(checkRedis()).rejects.toThrow('redis timeout');
    expect(redisMock.connectRedis).not.toHaveBeenCalled();
  });

  it('fails if filesystem is not writable', async () => {
    const writeSpy = vi.spyOn(fs, 'writeFile').mockRejectedValue(new Error('EACCES: permission denied'));
    await expect(checkFilesystem()).rejects.toThrow('permission denied');
    writeSpy.mockRestore();
  });

  it('flags high memory usage', () => {
    const memorySpy = vi.spyOn(process, 'memoryUsage').mockReturnValue({
      rss: 100,
      heapTotal: 1000,
      heapUsed: 950,
      external: 0,
      arrayBuffers: 0,
    });

    const result = checkMemory();
    expect(result.healthy).toBe(false);
    expect(result.details?.ratio).toBeGreaterThanOrEqual(0.95);
    memorySpy.mockRestore();
  });
});
