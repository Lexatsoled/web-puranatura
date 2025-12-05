// @vitest-environment node
import request from 'supertest';
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from 'vitest';

let app: any;
let closeApp: () => Promise<void>;
let originalToken: string | undefined;
let originalNodeEnv: string | undefined;

beforeAll(async () => {
  const backend = await import('../backend/src/app');
  app = backend.app;
  closeApp = backend.closeApp;
}, 30000);

afterAll(async () => {
  if (closeApp) await closeApp();
});

describe('GET /metrics protection', () => {
  beforeEach(() => {
    originalToken = process.env.METRICS_TOKEN;
    originalNodeEnv = process.env.NODE_ENV;
  });

  afterEach(() => {
    if (originalToken === undefined) delete process.env.METRICS_TOKEN;
    else process.env.METRICS_TOKEN = originalToken;

    if (originalNodeEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = originalNodeEnv;
  });

  it('permite /metrics en entornos de desarrollo cuando no hay METRICS_TOKEN', async () => {
    delete process.env.METRICS_TOKEN;
    process.env.NODE_ENV = 'development';

    const res = await request(app).get('/metrics');

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('text/plain');
    expect(res.text).toBeTruthy();
  });

  it('bloquea /metrics cuando METRICS_TOKEN está configurado y no se envía', async () => {
    process.env.METRICS_TOKEN = 'test-token-123';
    process.env.NODE_ENV = 'development';

    const res = await request(app).get('/metrics');

    expect(res.status).toBe(403);
  });

  it('acepta /metrics cuando METRICS_TOKEN está configurado y se envía cabecera correcta', async () => {
    process.env.METRICS_TOKEN = 'test-token-123';
    process.env.NODE_ENV = 'development';

    const res = await request(app)
      .get('/metrics')
      .set('x-metrics-token', 'test-token-123');

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('text/plain');
    expect(res.text).toBeTruthy();
  });

  it('devuelve 503 en producción si no hay METRICS_TOKEN configurado', async () => {
    delete process.env.METRICS_TOKEN;
    process.env.NODE_ENV = 'production';

    const res = await request(app).get('/metrics');

    expect(res.status).toBe(503);
    expect(res.body?.message).toMatch(/Metrics not available/i);
  });
});
