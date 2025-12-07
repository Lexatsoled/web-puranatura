// @vitest-environment node
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

let app: any;
let closeApp: () => Promise<void>;

beforeAll(async () => {
  const backend = await import('../backend/src/app');
  app = backend.app;
  closeApp = backend.closeApp;
}, 30000);

afterAll(async () => {
  if (closeApp) await closeApp();
});

describe('Security headers', () => {
  it('expone Referrer-Policy, Permissions-Policy y X-Download-Options', async () => {
    const res = await request(app).get('/');
    expect(res.headers['referrer-policy']).toBe('same-origin');
    expect(res.headers['permissions-policy']).toContain('geolocation=()');
    expect(res.headers['x-download-options']).toBe('noopen');
  });
});
