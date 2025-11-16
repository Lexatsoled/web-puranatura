import { redis, isRedisEnabled } from '../config/redis.js';
import { logger } from '../config/logger.js';

type MemoryEntry = {
  value: unknown;
  expiresAt: number;
};

const DEFAULT_TTL_SECONDS = 3600;

const escapeRegex = (input: string) => input.replace(/[-/\\^$+?.()|[\]{}]/g, '\\$&');

const patternToRegex = (pattern: string): RegExp => {
  const regex = '^' + escapeRegex(pattern).replace(/\\\*/g, '.*') + '$';
  return new RegExp(regex);
};

export class CacheService {
  private memoryCache = new Map<string, MemoryEntry>();

  private isRedisReady(): boolean {
    return Boolean(isRedisEnabled && redis && redis.status !== 'end');
  }

  private normalizeTtl(ttl?: number): number {
    if (typeof ttl === 'number' && Number.isFinite(ttl) && ttl > 0) {
      return Math.ceil(ttl);
    }
    return DEFAULT_TTL_SECONDS;
  }

  private pruneExpiredKey(key: string) {
    const entry = this.memoryCache.get(key);
    if (entry && entry.expiresAt <= Date.now()) {
      this.memoryCache.delete(key);
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      if (this.isRedisReady()) {
        const data = await redis!.get(key);
        if (data) {
          return JSON.parse(data) as T;
        }
      }
    } catch (error) {
      logger.error({ error, key }, 'Redis cache get failed');
    }

    this.pruneExpiredKey(key);
    const entry = this.memoryCache.get(key);
    if (!entry) {
      return null;
    }
    return entry.value as T;
  }

  async set(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
    const ttl = this.normalizeTtl(ttlSeconds);

    try {
      if (this.isRedisReady()) {
        await redis!.set(key, JSON.stringify(value), 'EX', ttl);
      }
    } catch (error) {
      logger.error({ error, key }, 'Redis cache set failed');
    }

    this.memoryCache.set(key, {
      value,
      expiresAt: Date.now() + ttl * 1000,
    });
  }

  async delete(key: string): Promise<void> {
    try {
      if (this.isRedisReady()) {
        await redis!.del(key);
      }
    } catch (error) {
      logger.error({ error, key }, 'Redis cache delete failed');
    } finally {
      this.memoryCache.delete(key);
    }
  }

  async deletePattern(pattern: string): Promise<void> {
    try {
      if (this.isRedisReady()) {
        const keys = await redis!.keys(pattern);
        if (keys.length) {
          await redis!.del(...keys);
        }
      }
    } catch (error) {
      logger.error({ error, pattern }, 'Redis cache pattern delete failed');
    }

    const matcher = patternToRegex(pattern);
    for (const key of this.memoryCache.keys()) {
      if (matcher.test(key)) {
        this.memoryCache.delete(key);
      }
    }
  }

  async wrap<T>(key: string, fn: () => Promise<T>, ttlSeconds?: number): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const value = await fn();
    await this.set(key, value, ttlSeconds);
    return value;
  }

  async clear(): Promise<void> {
    this.memoryCache.clear();
    if (process.env.NODE_ENV === 'test' && this.isRedisReady()) {
      await redis!.flushdb();
    }
  }
}

export const cacheService = new CacheService();
