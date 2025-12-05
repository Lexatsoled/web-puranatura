// @vitest-environment node
import request from 'supertest';
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';

// ensure backend test env
process.env.BACKEND_ENV_PATH = './backend/.env';
process.env.DATABASE_URL = 'file:./backend/test-degraded.sqlite';
process.env.JWT_SECRET = 'test';
process.env.JWT_REFRESH_SECRET = 'refresh';
process.env.NODE_ENV = 'development';
process.env.BREAKER_ENABLED = 'true';
process.env.LEGACY_FALLBACK_ENABLED = 'false';

import { app, closeApp } from '../backend/src/app';
import { prisma } from '../backend/src/prisma';

afterAll(async () => {
  vi.restoreAllMocks();
  await closeApp();
});

describe('X-Backend-Degraded header semantics', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns 503 with X-Backend-Degraded when DB read fails and fallback disabled', async () => {
    process.env.BREAKER_ENABLED = 'true';
    process.env.LEGACY_FALLBACK_ENABLED = 'false';
    vi.spyOn(prisma.product, 'findMany').mockRejectedValue(
      new Error('Simulated DB read failure') as any
    );
    vi.spyOn(prisma.product, 'count').mockRejectedValue(
      new Error('Simulated DB count failure') as any
    );

    const res = await request(app).get('/api/products');
    expect(res.status).toBe(503);
    expect(res.headers['x-backend-degraded']).toBe('true');
  });
});
