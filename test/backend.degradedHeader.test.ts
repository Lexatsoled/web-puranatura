// @vitest-environment node
import request from 'supertest';
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';

// ensure backend test env
process.env.BACKEND_ENV_PATH = './backend/.env';
process.env.DATABASE_URL = 'file:./backend/test-degraded.sqlite';
process.env.JWT_SECRET = 'test';
process.env.JWT_REFRESH_SECRET = 'refresh';
process.env.NODE_ENV = 'development';

import { app, closeApp } from '../backend/src/app';
import { prisma } from '../backend/src/prisma';
import * as seedModule from '../backend/prisma/seed';

afterAll(async () => {
  vi.restoreAllMocks();
  await closeApp();
});

describe('X-Backend-Degraded header semantics', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns X-Backend-Degraded true when DB read succeeds but total is 0 (empty DB)', async () => {
    // simulate a healthy DB returning empty result set
    vi.spyOn(prisma.product, 'findMany').mockResolvedValue([] as any);
    vi.spyOn(prisma.product, 'count').mockResolvedValue(0 as any);

    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
    expect(res.headers['x-backend-degraded']).toBe('true');
  });

  // NOTE: a DB-failure -> seed-succeeds path is tricky to simulate reliably in this
  // test harness (seed may attempt real Prisma writes). Keep a deterministic
  // case: DB empty -> degraded=true.

  it('returns X-Backend-Degraded true when DB read fails, seed fails and legacy fallback provides no items', async () => {
    // Simulate DB failures
    vi.spyOn(prisma.product, 'findMany').mockRejectedValue(
      new Error('Simulated DB read failure') as any
    );
    vi.spyOn(prisma.product, 'count').mockRejectedValue(
      new Error('Simulated DB count failure') as any
    );

    // Make seed fail so code reaches legacy fallback
    vi.spyOn(seedModule, 'seedProducts').mockRejectedValue(
      new Error('Simulated seed failure') as any
    );

    // Mock legacy module to return empty products array
    const path = await import('path');
    const abs = path.resolve(__dirname, '../data/products');
    // ensure the dynamic import used by the route picks up our mock
    // use doMock (not hoisted) so we can compute the absolute path at runtime
    vi.doMock(abs, () => ({ products: [] }));

    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
    // final total is 0 -> degraded true
    expect(res.headers['x-backend-degraded']).toBe('true');
    // Reset module registry after test to avoid mock leakage
    vi.resetModules();
  });
});
