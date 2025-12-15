import Redis from 'ioredis';
import { env } from '../config/env';
import { logger } from '../utils/logger';

const redisConfig = {
  host: env.redis.host,
  port: env.redis.port,
  password: env.redis.password,
  retryStrategy: (times: number) => {
    // Exponential backoff with max 2s delay
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3,
};

// Create a singleton instance
export const redis = new Redis(redisConfig);

redis.on('connect', () => {
  logger.info('[redis] connected successfully');
});

redis.on('error', (err) => {
  // Prevent crash on connection error, just log
  logger.error('[redis] connection error', { error: err.message });
});
