import Database from 'better-sqlite3';
import { createHash } from 'crypto';
import { sqlite } from '../db/client.js';
import { logger } from '../config/logger.js';
import { cacheService } from './cacheService.js';
import { config } from '../config/index.js';

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;
const MAX_OFFSET = 1000;
const SEARCH_CACHE_TTL = config.CACHE_TTL_SEARCH ?? 1800;

const buildSearchCacheKey = (prefix: string, payload: unknown) =>
  `${prefix}:${createHash('sha1').update(JSON.stringify(payload)).digest('hex')}`;

export interface SearchResult {
  productId: number;
  name: string;
  description: string;
  category: string;
  price: number;
  mainImage: string;
  stock: number;
  relevance: number;
}

export interface SearchOptions {
  query: string;
  limit?: number;
  offset?: number;
  category?: string;
  priceMin?: number;
  priceMax?: number;
  inStock?: boolean;
}

export class SearchService {
  private readonly db: Database.Database;

  constructor(database: Database.Database) {
    this.db = database;
  }

  async search(options: SearchOptions): Promise<{ results: SearchResult[]; total: number; took: number }> {
    const sanitizedQuery = this.sanitizeQuery(options.query);
    if (!sanitizedQuery) {
      return { results: [], total: 0, took: 0 };
    }

    const ftsQuery = this.buildFTSQuery(sanitizedQuery);
    if (!ftsQuery) {
      return { results: [], total: 0, took: 0 };
    }

    const limit = Math.min(Math.max(options.limit ?? DEFAULT_LIMIT, 1), MAX_LIMIT);
    const offset = Math.min(Math.max(options.offset ?? 0, 0), MAX_OFFSET);
    let priceMin = options.priceMin;
    let priceMax = options.priceMax;

    if (
      typeof priceMin === 'number' &&
      typeof priceMax === 'number' &&
      !Number.isNaN(priceMin) &&
      !Number.isNaN(priceMax) &&
      priceMin > priceMax
    ) {
      [priceMin, priceMax] = [priceMax, priceMin];
    }

    const normalizedOptions = {
      query: sanitizedQuery,
      limit,
      offset,
      category: options.category ?? null,
      priceMin: typeof priceMin === 'number' ? priceMin : null,
      priceMax: typeof priceMax === 'number' ? priceMax : null,
      inStock: Boolean(options.inStock),
    };

    const cacheKey = buildSearchCacheKey('search:results', normalizedOptions);

    return cacheService.wrap(cacheKey, async () => {
      const startTime = Date.now();
      const filters: string[] = [];
      const params: unknown[] = [ftsQuery];

      if (options.category) {
        filters.push('LOWER(p.category) = LOWER(?)');
        params.push(options.category.trim());
      }

      if (typeof priceMin === 'number' && !Number.isNaN(priceMin)) {
        filters.push('p.price >= ?');
        params.push(priceMin);
      }

      if (typeof priceMax === 'number' && !Number.isNaN(priceMax)) {
        filters.push('p.price <= ?');
        params.push(priceMax);
      }

      if (options.inStock) {
        filters.push('p.stock > 0');
      }

      const filtersSql = filters.length ? ` AND ${filters.join(' AND ')}` : '';

      const searchSql = `
      SELECT
        p.id AS productId,
        p.name,
        COALESCE(p.description, '') AS description,
        p.category,
        p.price,
        COALESCE(json_extract(p.images, '$[0]'), '') AS mainImage,
        p.stock,
        bm25(products_fts) AS rawRank
      FROM products_fts
      INNER JOIN products p ON p.id = products_fts.rowid
      WHERE products_fts MATCH ?
      ${filtersSql}
      ORDER BY bm25(products_fts)
      LIMIT ? OFFSET ?
    `;

      const stmt = this.db.prepare(searchSql);
      const rows = stmt.all(...params, limit, offset) as Array<{
        productId: number;
        name: string;
        description: string;
        category: string;
        price: number;
        mainImage: string | null;
        stock: number;
        rawRank: number | null;
      }>;

      const normalizedResults: SearchResult[] = rows.map((row) => ({
        productId: row.productId,
        name: row.name,
        description: row.description ?? '',
        category: row.category,
        price: row.price,
        mainImage: row.mainImage ?? '',
        stock: row.stock ?? 0,
        relevance: this.normalizeRelevance(row.rawRank),
      }));

      const countSql = `
      SELECT COUNT(*) as total
      FROM products_fts
      INNER JOIN products p ON p.id = products_fts.rowid
      WHERE products_fts MATCH ?
        ${filtersSql}
    `;
      const { total } = this.db.prepare(countSql).get(...params) as { total: number };

      const took = Date.now() - startTime;

      logger.debug(
        {
          scope: 'SearchService.search',
          query: options.query,
          sanitizedQuery,
          total,
          returned: normalizedResults.length,
          took,
        },
        'FTS search completed',
      );

      return { results: normalizedResults, total, took };
    }, SEARCH_CACHE_TTL);
  }

  async suggest(prefix: string, limit = 5): Promise<string[]> {
    if (!prefix || prefix.trim().length < 2) {
      return [];
    }

    const sanitized = this.sanitizeQuery(prefix);
    if (!sanitized) {
      return [];
    }

    const suggestionLimit = Math.min(Math.max(limit, 1), 20);
    const ftsQuery = `${sanitized}*`;

    const cacheKey = buildSearchCacheKey('search:suggest', {
      query: sanitized,
      limit: suggestionLimit,
    });

    try {
      return await cacheService.wrap(
        cacheKey,
        async () => {
          const sql = `
        SELECT DISTINCT p.name AS suggestion
        FROM products_fts
        INNER JOIN products p ON p.id = products_fts.rowid
        WHERE products_fts MATCH ?
        ORDER BY bm25(products_fts)
        LIMIT ?
      `;
          const rows = this.db.prepare(sql).all(ftsQuery, suggestionLimit) as Array<{ suggestion: string }>;
          return rows.map((row) => row.suggestion).filter(Boolean);
        },
        Math.min(SEARCH_CACHE_TTL, 300),
      );
    } catch (error) {
      logger.error({ scope: 'SearchService.suggest', error, prefix }, 'Autocomplete failed');
      return [];
    }
  }

  async getPopularSearches(limit = 10): Promise<{ query: string; count: number }[]> {
    const resolvedLimit = Math.min(Math.max(limit, 1), 20);
    const defaults = [
      { query: 'vitamina c', count: 150 },
      { query: 'omega 3', count: 120 },
      { query: 'colageno', count: 100 },
      { query: 'magnesio', count: 85 },
      { query: 'probioticos', count: 75 },
      { query: 'colageno hidrolizado', count: 60 },
    ];
    return defaults.slice(0, resolvedLimit);
  }

  async reindex(): Promise<{ indexed: number }> {
    try {
      logger.info({ scope: 'SearchService.reindex' }, 'Starting FTS reindex');

      this.db.prepare('DELETE FROM products_fts').run();

      const rows = this.db
        .prepare(
          `
        SELECT id, name, COALESCE(description, '') AS description, COALESCE(category, '') AS category, tags
        FROM products
      `,
        )
        .all() as Array<{ id: number; name: string; description: string; category: string; tags: string | null }>;

      const insert = this.db.prepare(
        `
        INSERT INTO products_fts(rowid, name, description, category, tags)
        VALUES (?, ?, ?, ?, ?)
      `,
      );

      const toText = (value: string | null | undefined) => value ?? '';

      const insertMany = this.db.transaction((records: typeof rows) => {
        for (const record of records) {
          insert.run(
            record.id,
            record.name,
            toText(record.description),
            toText(record.category),
            this.tagsToText(record.tags),
          );
        }
      });

      insertMany(rows);

      await cacheService.deletePattern('search:results:*');
      await cacheService.deletePattern('search:suggest:*');

      logger.info({ indexed: rows.length, scope: 'SearchService.reindex' }, 'FTS reindex completed');
      return { indexed: rows.length };
    } catch (error) {
      logger.error({ scope: 'SearchService.reindex', error }, 'FTS reindex failed');
      throw error;
    }
  }

  private sanitizeQuery(query: string): string {
    if (!query) {
      return '';
    }
    return query
      .trim()
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private buildFTSQuery(sanitized: string): string {
    if (!sanitized) {
      return '';
    }

    const words = sanitized.split(' ').filter(Boolean);
    if (words.length === 1) {
      return `${words[0]}*`;
    }

    return words.map((word) => `${word}*`).join(' OR ');
  }

  private normalizeRelevance(rawRank: number | null): number {
    if (typeof rawRank !== 'number' || Number.isNaN(rawRank)) {
      return 0;
    }

    if (rawRank <= 0) {
      return Number(Math.min(1, Math.max(0, 1 + rawRank / 10)).toFixed(4));
    }

    return Number((1 / (1 + rawRank)).toFixed(4));
  }

  private tagsToText(tags: string | null | undefined): string {
    if (!tags) {
      return '';
    }

    try {
      const parsed = JSON.parse(tags) as unknown;
      if (Array.isArray(parsed)) {
        return parsed.filter((value) => typeof value === 'string').join(' ');
      }
    } catch {
      // noop
    }

    return '';
  }
}

export const searchService = new SearchService(sqlite);
