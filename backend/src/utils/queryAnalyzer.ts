import type BetterSqlite3 from 'better-sqlite3';
import { logger } from '../config/logger.js';

type QueryPlanRow = {
  detail?: string | null;
};

type IndexMetadata = {
  name: string;
  tableName: string;
  sql: string | null;
};

export class QueryAnalyzer {
  constructor(private readonly db: BetterSqlite3.Database) {}

  analyzeQuery(sql: string, params: unknown[] = []): void {
    const plan = this.db.prepare(`EXPLAIN QUERY PLAN ${sql}`).all(...params) as QueryPlanRow[];

    logger.info(
      {
        sql,
        plan,
      },
      'Query plan analysis',
    );

    const hasTableScan = plan.some((row: QueryPlanRow) => {
      if (!row.detail) return false;
      const detail = row.detail.toUpperCase();
      return detail.includes('SCAN') && !detail.includes('USING INDEX');
    });

    if (hasTableScan) {
      logger.warn({ sql }, 'Query uses table scan - consider adding index');
    }
  }

  listIndexes(): IndexMetadata[] {
    return this.db
      .prepare(`
        SELECT name, tbl_name AS "tableName", sql
        FROM sqlite_master
        WHERE type = 'index' AND name NOT LIKE 'sqlite_%'
        ORDER BY tbl_name, name
      `)
      .all() as IndexMetadata[];
  }

  getIndexStats(): void {
    try {
      const stats = this.db.prepare('SELECT * FROM sqlite_stat1').all();
      logger.info({ stats }, 'Index statistics');
    } catch (error) {
      logger.warn(
        {
          error: error instanceof Error ? error.message : String(error),
        },
        'Index statistics unavailable (run ANALYZE to populate sqlite_stat1)',
      );
    }
  }
}
