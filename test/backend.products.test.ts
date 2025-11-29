// @vitest-environment node
import request from 'supertest';
import { afterAll, describe, expect, it } from 'vitest';

// Set test database URL
process.env.BACKEND_ENV_PATH = './backend/.env';
process.env.DATABASE_URL = "file:./backend/test-database.sqlite";
process.env.JWT_SECRET = "test-jwt-secret";
process.env.JWT_REFRESH_SECRET = "test-jwt-refresh-secret";

import { app, closeApp } from '../backend/src/app';
// NOTE: migrations are applied globally before tests (test:ci runs a
// `prisma migrate deploy` step). Tests assume the test database has the
// migrations already applied. Keep this lean to avoid races on Windows
// where Prisma query-engine binary renames can conflict when run
// concurrently.

afterAll(async () => {
  await closeApp();
});

describe('GET /api/products', () => {
  it('incluye cabeceras de paginación y cache', async () => {
    const response = await request(app)
      .get('/api/products')
      .query({ page: 1, pageSize: 2 });

    expect(response.status).toBe(200);
    expect(response.headers['cache-control']).toMatch(/max-age=300/);
    expect(response.headers['etag']).toBeTruthy();
    expect(response.headers['x-total-count']).toMatch(/^\d+$/);
    expect(response.headers['x-page']).toBe('1');
    expect(response.headers['x-page-size']).toBe('2');
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('responde 304 cuando If-None-Match coincide con el ETag', async () => {
    const firstResponse = await request(app).get('/api/products');
    const etag = firstResponse.headers['etag'];
    expect(etag).toBeTruthy();

    const cachedResponse = await request(app)
      .get('/api/products')
      .set('If-None-Match', etag as string);

    expect(cachedResponse.status).toBe(304);
    expect(cachedResponse.text).toBe('');
  });
});
