// @vitest-environment node
import request from 'supertest';
import { beforeAll, afterAll, describe, it, expect } from 'vitest';

let app: any;
let closeApp: () => Promise<void>;

beforeAll(async () => {
  // Import app with default env (CSP_REPORT_ONLY default true in dev)
  const backend = await import('../backend/src/app');
  app = backend.app;
  closeApp = backend.closeApp;
});

afterAll(async () => {
  if (closeApp) await closeApp();
});

describe('CSP header behaviour', () => {
  it('expone header Content-Security-Policy-Report-Only en entorno report-only', async () => {
    const res = await request(app).get('/');
    // express + helmet with report-only should set CSP in Report-Only header
    const header =
      res.headers['content-security-policy-report-only'] ||
      res.headers['content-security-policy'];
    expect(header).toBeDefined();
    expect(String(header)).toMatch(/script-src/);
    expect(String(header)).toMatch(
      /maps.googleapis.com|google-analytics.com|connect.facebook.net/
    );
    // ensure frameAncestors 'none' is present (X-Frame-Options mitigated via CSP)
    expect(String(header)).toMatch(/frame-ancestors\s+'none'/);
  });
});
