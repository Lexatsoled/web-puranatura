// @vitest-environment node
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import fs from 'fs';
import path from 'path';

let app: any;
let closeApp: () => Promise<void>;

const reportsFile = path.join(
  process.cwd(),
  'backend',
  'reports',
  'csp-reports.ndjson'
);

beforeAll(async () => {
  const backend = await import('../backend/src/app');
  app = backend.app;
  closeApp = backend.closeApp;
}, 30000);

afterAll(async () => {
  if (closeApp) await closeApp();
  try {
    if (fs.existsSync(reportsFile)) fs.unlinkSync(reportsFile);
  } catch {
    // ignore
  }
});

describe('POST /api/security/csp-report', () => {
  it('acepta reports CSP y persiste + actualiza métricas', async () => {
    if (fs.existsSync(reportsFile)) fs.unlinkSync(reportsFile);

    const payload = {
      'csp-report': {
        'document-uri': 'https://example.com/',
        'violated-directive': "script-src 'self'",
        'blocked-uri': 'https://malicious.example',
      },
    };

    const res = await request(app)
      .post('/api/security/csp-report')
      .set('Content-Type', 'application/csp-report')
      .send(JSON.stringify(payload));

    expect(res.status).toBe(204);

    // metrics should expose our CSP counters
    const metrics = await request(app).get('/metrics');
    expect(metrics.text).toMatch(/csp_reports_total/);
    expect(metrics.text).toMatch(/csp_reports_blocked_total/);

    // persisted file should contain a line
    const content = fs.readFileSync(reportsFile, 'utf8');
    expect(content).toContain('https://example.com/');
    expect(content).toContain('malicious.example');
    // ensure we don't store raw IP addresses and we persist a userAgent hash instead
    expect(content).not.toMatch(/127\.0\.0\.1/);
    expect(content).toMatch(/"userAgentHash"\s*:\s*"[a-f0-9]{16}"/i);
  });
});
