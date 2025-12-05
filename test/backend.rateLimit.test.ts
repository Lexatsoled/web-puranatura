// @vitest-environment node
import request from 'supertest';
import { describe, it, beforeAll, afterAll, expect } from 'vitest';

let app: any;
let closeApp: () => Promise<void>;

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  process.env.ANALYTICS_RATE_LIMIT_MAX = '1';
  process.env.ANALYTICS_RATE_LIMIT_WINDOW = '60000';
  const backend = await import('../backend/src/app');
  app = backend.app;
  closeApp = backend.closeApp;
});

afterAll(async () => {
  if (closeApp) await closeApp();
});

describe('Rate limits (analytics)', () => {
  it('devuelve 429 tras exceder el límite por sessionId en /api/analytics/events', async () => {
    const baseBody = {
      category: 'test',
      action: 'click',
      sessionId: 'session-rl-1',
      metadata: { userId: 'u123' },
    };

    // Primera solicitud (debe pasar)
    const ok = await request(app)
      .post('/api/analytics/events')
      .set('x-rate-key', 'session-rl-1')
      .send(baseBody);
    expect(ok.status).toBe(202);

    // Segunda solicitud con la misma clave debe caer en 429
    const limited = await request(app)
      .post('/api/analytics/events')
      .set('x-rate-key', 'session-rl-1')
      .send({ ...baseBody, action: 'click-2' });

    expect(limited.status).toBe(429);
    expect(limited.body?.code).toBe('RATE_LIMIT_EXCEEDED');
  });
});
