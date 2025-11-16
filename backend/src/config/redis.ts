import Redis from 'ioredis';
import { config } from './index';
import { logger } from './logger';

const hasRedisConfiguration = Boolean(config.REDIS_URL || config.REDIS_HOST);
const redisEnabled = Boolean(config.REDIS_ENABLED && hasRedisConfiguration);

const buildConnection = () => {
  if (!redisEnabled) {
    return null;
  }

  if (config.REDIS_URL) {
    return new Redis(config.REDIS_URL, {
      lazyConnect: true,
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        return Math.min(times * 100, 3000);
      },
    });
  }

  const port = config.REDIS_PORT ? Number(config.REDIS_PORT) : 6379;
  const dbIndex = config.REDIS_DB ? Number(config.REDIS_DB) : 0;

  return new Redis({
    host: config.REDIS_HOST ?? '127.0.0.1',
    port,
    db: dbIndex,
    password: config.REDIS_PASSWORD || undefined,
    lazyConnect: true,
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
      return Math.min(times * 100, 3000);
    },
  });
};

const redisInstance = buildConnection();

if (redisInstance) {
  redisInstance.on('connect', () => {
    logger.info('Redis connected');
  });

  redisInstance.on('error', (err) => {
    logger.error({ err }, 'Redis error');
  });

  redisInstance.on('end', () => {
    logger.warn('Redis connection closed');
  });
}

export const redis = redisInstance;
export const isRedisEnabled = Boolean(redisInstance);

export async function connectRedis() {
  if (redis && redis.status === 'wait') {
    await redis.connect();
  }
}

export async function closeRedis() {
  if (redis && redis.status !== 'end') {
    await redis.quit();
  }
}
