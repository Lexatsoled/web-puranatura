import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { getConnectionPool } from '../db/index.js';
import { connectRedis, isRedisEnabled, redis } from '../config/redis.js';
import { healthConfig } from '../config/health.js';
import type { HealthCheckResult } from '../types/health.js';

const withTimeout = <T>(promise: Promise<T>, ms: number, label: string): Promise<T> => {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`${label} health check timed out after ${ms}ms`));
    }, ms);

    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((error) => {
        clearTimeout(timer);
        reject(error);
      });
  });
};

export const checkDatabase = async (): Promise<HealthCheckResult> => {
  const start = Date.now();

  await withTimeout(
    getConnectionPool().withConnection((db) => {
      db.prepare('SELECT 1').get();
    }),
    healthConfig.databaseTimeout,
    'database',
  );

  return {
    name: 'database',
    healthy: true,
    durationMs: Date.now() - start,
  };
};

export const checkRedis = async (): Promise<HealthCheckResult> => {
  const start = Date.now();

  if (!isRedisEnabled) {
    return {
      name: 'redis',
      healthy: true,
      details: {
        enabled: false,
      },
    };
  }

  if (!redis) {
    throw new Error('Redis client unavailable');
  }

  await withTimeout(
    (async () => {
      if (redis.status === 'wait') {
        await connectRedis();
      }
      await redis.ping();
    })(),
    healthConfig.redisTimeout,
    'redis',
  );

  return {
    name: 'redis',
    healthy: true,
    durationMs: Date.now() - start,
  };
};

export const checkFilesystem = async (): Promise<HealthCheckResult> => {
  const start = Date.now();
  const tmpDir = os.tmpdir();
  const fileName = `health-check-${Date.now()}-${Math.random().toString(36).slice(2)}.tmp`;
  const filePath = path.join(tmpDir, fileName);

  await withTimeout(
    (async () => {
      await fs.writeFile(filePath, 'healthy');
      const contents = await fs.readFile(filePath, 'utf8');
      if (contents !== 'healthy') {
        throw new Error('Filesystem returned unexpected content');
      }
    })(),
    healthConfig.filesystemTimeout,
    'filesystem',
  );

  try {
    await fs.unlink(filePath);
  } catch {
    // Ignore cleanup errors
  }

  return {
    name: 'filesystem',
    healthy: true,
    durationMs: Date.now() - start,
  };
};

export const checkMemory = (): HealthCheckResult => {
  const usage = process.memoryUsage();
  const ratio = usage.heapTotal > 0 ? usage.heapUsed / usage.heapTotal : 0;
  const healthy = ratio < healthConfig.memoryThresholdRatio;

  return {
    name: 'memory',
    healthy,
    details: {
      heapUsed: usage.heapUsed,
      heapTotal: usage.heapTotal,
      ratio: Number(ratio.toFixed(3)),
      threshold: healthConfig.memoryThresholdRatio,
    },
  };
};
