// @vitest-environment node
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

// Ensure test loads the backend env
process.env.BACKEND_ENV_PATH = './backend/.env';
process.env.DATABASE_URL = 'file:./backend/test-seed-fallback.sqlite';
process.env.JWT_SECRET = 'test';
process.env.JWT_REFRESH_SECRET = 'refresh';
process.env.NODE_ENV = 'development';

import { app, closeApp } from '../backend/src/app';
import { prisma } from '../backend/src/prisma';
import * as seedModule from '../backend/prisma/seed';

beforeAll(() => {
  // Ensure we don't hit the real DB in this test - simulate DB read failure

  vi.spyOn(prisma.product, 'findMany').mockRejectedValue(
    new Error('Simulated DB read failure') as any
  );
  vi.spyOn(prisma.product, 'count').mockRejectedValue(
    new Error('Simulated DB count failure') as any
  );

  // Make seed fail as well so code takes the legacy fallback path
  vi.spyOn(seedModule, 'seedProducts').mockRejectedValue(
    new Error('Simulated seed failure') as any
  );
});

afterAll(async () => {
  // Restore mocks
  vi.restoreAllMocks();
  await closeApp();
});

describe('GET /api/products (DB failure -> legacy fallback)', () => {
  it('returns legacy products when DB and seed both fail (dev)', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
    // Because the legacy fallback provided products, the final response is
    // not degraded (the header reflects the final total), so expect 'false'.
    expect(res.headers['x-backend-degraded']).toBe('false');
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
