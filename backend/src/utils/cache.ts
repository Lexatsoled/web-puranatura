import { redis } from '../lib/redis';
import { logger } from './logger';

const DEFAULT_TTL = 60; // seconds

/**
 * Tries to get value from Redis cache. If missing, runs the fetcher,
 * sets the cache, and returns the value.
 */
export async function getOrSetCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlSeconds: number = DEFAULT_TTL
): Promise<T> {
  try {
    const cached = await redis.get(key);
    if (cached) {
      // logger.debug(`[cache] HIT ${key}`);
      return JSON.parse(cached) as T;
    }
  } catch (err) {
    logger.warn(`[cache] Redis get error for key ${key}`, { error: err });
    // Fallback to fetcher on error
  }

  // logger.debug(`[cache] MISS ${key}`);
  const freshData = await fetcher();

  try {
    if (freshData) {
      await redis.setex(key, ttlSeconds, JSON.stringify(freshData));
    }
  } catch (err) {
    logger.warn(`[cache] Redis set error for key ${key}`, { error: err });
  }

  return freshData;
}
