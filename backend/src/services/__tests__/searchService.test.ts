import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import Database from 'better-sqlite3';
import { promises as fs } from 'node:fs';
import { join } from 'node:path';
import { SearchService } from '../searchService';

const TEST_DB_PATH = join(process.cwd(), 'search-service.test.sqlite');
const FTS_MIGRATION_PATH = join(process.cwd(), 'src', 'db', 'migrations', '0004_search_fts.sql');

describe('SearchService', () => {
  let sqlite: Database.Database;
  let service: SearchService;

  beforeAll(async () => {
    await fs.rm(TEST_DB_PATH, { force: true });
    sqlite = new Database(TEST_DB_PATH);

    sqlite.exec(`
      CREATE TABLE products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        category TEXT NOT NULL,
        tags TEXT DEFAULT '[]',
        categories TEXT DEFAULT '[]',
        price REAL NOT NULL,
        images TEXT DEFAULT '[]',
        stock INTEGER DEFAULT 0,
        created_at TEXT DEFAULT (datetime('now'))
      );
    `);

    const ftsSql = await fs.readFile(FTS_MIGRATION_PATH, 'utf-8');
    sqlite.exec(ftsSql);

    const insert = sqlite.prepare(`
      INSERT INTO products (name, description, category, tags, categories, price, images, stock)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insert.run(
      'Vitamina C 1000mg',
      'Acido ascorbico puro',
      'vitaminas',
      '["vitamina","c","ascorbico","inmunidad"]',
      '["vitaminas","defensas"]',
      15.99,
      '["/img/vitamina-c.png"]',
      50,
    );

    insert.run(
      'Omega 3 Fish Oil',
      'Aceite de pescado rico en EPA y DHA',
      'omega',
      '["omega","aceite","pescado"]',
      '["salud-cardio"]',
      22.5,
      '["/img/omega.png"]',
      30,
    );

    insert.run(
      'Colageno Hidrolizado',
      'Colageno tipo I y III',
      'proteinas',
      '["colageno","piel","articulaciones"]',
      '["belleza"]',
      18.75,
      '["/img/colageno.png"]',
      0,
    );

    service = new SearchService(sqlite);
  });

  afterAll(async () => {
    sqlite.close();
    await fs.rm(TEST_DB_PATH, { force: true });
  });

  describe('search', () => {
    it('encuentra productos por nombre', async () => {
      const result = await service.search({ query: 'vitamina' });
      expect(result.results.length).toBeGreaterThan(0);
      expect(result.results[0].name).toContain('Vitamina');
    });

    it('encuentra productos por descripcion', async () => {
      const result = await service.search({ query: 'ascorbico' });
      expect(result.results.length).toBeGreaterThan(0);
      expect(result.results[0].description.toLowerCase()).toContain('ascorbico');
    });

    it('filtra por categoria', async () => {
      const result = await service.search({ query: 'vitamina', category: 'vitaminas' });
      expect(result.results.every((r) => r.category === 'vitaminas')).toBe(true);
    });

    it('filtra por rango de precio', async () => {
      const result = await service.search({ query: 'omega', priceMin: 20, priceMax: 25 });
      expect(result.results.length).toBe(1);
      expect(result.results[0].name).toContain('Omega');
    });

    it('excluye productos sin stock cuando se solicita', async () => {
      const result = await service.search({ query: 'colageno', inStock: true });
      expect(result.results.length).toBe(0);
    });

    it('soporta paginacion', async () => {
      const first = await service.search({ query: 'a', limit: 1, offset: 0 });
      const second = await service.search({ query: 'a', limit: 1, offset: 1 });
      expect(first.results).not.toEqual(second.results);
    });

    it('devuelve metricas de tiempo', async () => {
      const result = await service.search({ query: 'omega' });
      expect(result.took).toBeGreaterThanOrEqual(0);
      expect(result.took).toBeLessThan(200);
    });
  });

  describe('suggest', () => {
    it('retorna sugerencias para prefijos validos', async () => {
      const suggestions = await service.suggest('vi');
      expect(suggestions.length).toBeGreaterThan(0);
    });

    it('limita la cantidad de sugerencias', async () => {
      const suggestions = await service.suggest('o', 1);
      expect(suggestions.length).toBeLessThanOrEqual(1);
    });
  });

  describe('reindex', () => {
    it('reconstruye el indice FTS', async () => {
      const result = await service.reindex();
      expect(result.indexed).toBeGreaterThan(0);
    });
  });
});
