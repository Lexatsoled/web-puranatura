import { beforeEach, describe, expect, it, vi } from 'vitest';
import type BetterSqlite3 from 'better-sqlite3';
import { QueryAnalyzer } from '../queryAnalyzer.js';
import { logger } from '../../config/logger.js';

class MockStatement {
  constructor(private readonly rows: unknown[]) {}

  all(..._params: unknown[]) {
    return this.rows;
  }
}

class MockDatabase {
  constructor(
    private readonly options: {
      planRows?: unknown[];
      indexRows?: unknown[];
      statsRows?: unknown[];
      statsError?: Error;
    } = {},
  ) {}

  prepare(sql: string) {
    if (sql.startsWith('EXPLAIN QUERY PLAN')) {
      return new MockStatement(this.options.planRows ?? []);
    }
    if (sql.includes('sqlite_master')) {
      return new MockStatement(this.options.indexRows ?? []);
    }
    if (sql.includes('sqlite_stat1')) {
      if (this.options.statsError) {
        throw this.options.statsError;
      }
      return new MockStatement(this.options.statsRows ?? []);
    }
    return new MockStatement([]);
  }
}

describe('QueryAnalyzer', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('logs query plan information without warnings when an index is used', () => {
    const db = new MockDatabase({
      planRows: [{ detail: 'SEARCH TABLE products USING INDEX idx_products_category' }],
    }) as unknown as BetterSqlite3.Database;
    const analyzer = new QueryAnalyzer(db);
    const infoSpy = vi.spyOn(logger, 'info');
    const warnSpy = vi.spyOn(logger, 'warn');

    analyzer.analyzeQuery('SELECT * FROM products WHERE category = ?', ['vitaminas']);

    expect(infoSpy).toHaveBeenCalled();
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('warns when a table scan is detected', () => {
    const db = new MockDatabase({
      planRows: [{ detail: 'SCAN TABLE products' }],
    }) as unknown as BetterSqlite3.Database;
    const analyzer = new QueryAnalyzer(db);
    const warnSpy = vi.spyOn(logger, 'warn');

    analyzer.analyzeQuery('SELECT * FROM products', []);

    expect(warnSpy).toHaveBeenCalledWith({ sql: 'SELECT * FROM products' }, expect.any(String));
  });

  it('lists custom indexes', () => {
    const db = new MockDatabase({
      indexRows: [
        {
          name: 'idx_products_category',
          tableName: 'products',
          sql: 'CREATE INDEX idx_products_category ON products(category)',
        },
      ],
    }) as unknown as BetterSqlite3.Database;
    const analyzer = new QueryAnalyzer(db);

    const indexes = analyzer.listIndexes();

    expect(indexes).toHaveLength(1);
    expect(indexes[0]).toMatchObject({ name: 'idx_products_category', tableName: 'products' });
  });

  it('logs a warning when index stats are unavailable', () => {
    const db = new MockDatabase({
      statsError: new Error('no stats'),
    }) as unknown as BetterSqlite3.Database;
    const analyzer = new QueryAnalyzer(db);
    const warnSpy = vi.spyOn(logger, 'warn');

    analyzer.getIndexStats();

    expect(warnSpy).toHaveBeenCalled();
  });
});
