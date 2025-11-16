import type { Database as BetterSqliteDatabase } from 'better-sqlite3';
import { logger } from '../config/logger.js';
import { createOptimizedDatabase } from './connection.js';

export interface PoolConfig {
  maxConnections: number;
  idleTimeout: number;
  path: string;
  verbose?: boolean;
}

export class ConnectionPool {
  private pool: BetterSqliteDatabase[] = [];
  private inUse: Set<BetterSqliteDatabase> = new Set();
  private readonly config: PoolConfig;
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor(config: Partial<PoolConfig> = {}) {
    this.config = {
      maxConnections: config.maxConnections ?? 5,
      idleTimeout: config.idleTimeout ?? 60000,
      path: config.path ?? './database.sqlite',
      verbose: config.verbose,
    };

    this.pool.push(this.createConnection());
    this.startCleanup();
  }

  private createConnection(): BetterSqliteDatabase {
    const db = createOptimizedDatabase(this.config.path, {
      verbose: this.config.verbose ? console.log : undefined,
    });
    logger.debug('New database connection created for pool');
    return db;
  }

  private async waitForConnection(): Promise<BetterSqliteDatabase> {
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (this.pool.length > 0) {
          clearInterval(checkInterval);
          const db = this.pool.pop()!;
          this.inUse.add(db);
          resolve(db);
        }
      }, 50);
    });
  }

  async acquire(): Promise<BetterSqliteDatabase> {
    if (this.pool.length > 0) {
      const db = this.pool.pop()!;
      this.inUse.add(db);
      return db;
    }

    if (this.inUse.size < this.config.maxConnections) {
      const db = this.createConnection();
      this.inUse.add(db);
      return db;
    }

    return this.waitForConnection();
  }

  release(db: BetterSqliteDatabase): void {
    if (!this.inUse.has(db)) {
      return;
    }
    this.inUse.delete(db);
    this.pool.push(db);
  }

  async withConnection<T>(fn: (db: BetterSqliteDatabase) => T | Promise<T>): Promise<T> {
    const db = await this.acquire();
    try {
      return await Promise.resolve(fn(db));
    } finally {
      this.release(db);
    }
  }

  private startCleanup(): void {
    if (this.config.idleTimeout <= 0 || process.env.NODE_ENV === 'test') {
      return;
    }

    this.cleanupInterval = setInterval(() => {
      while (this.pool.length > 1) {
        const db = this.pool.pop();
        if (db) {
          db.close();
          logger.debug('Closed idle database connection');
        }
      }
    }, this.config.idleTimeout);
  }

  async close(): Promise<void> {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }

    for (const db of [...this.pool, ...this.inUse]) {
      db.close();
    }

    this.pool = [];
    this.inUse.clear();
    logger.info('Connection pool closed');
  }

  getStats() {
    const available = this.pool.length;
    const inUse = this.inUse.size;
    const total = available + inUse;

    return {
      available,
      inUse,
      total,
      max: this.config.maxConnections,
      idleTimeout: this.config.idleTimeout,
    };
  }
}
