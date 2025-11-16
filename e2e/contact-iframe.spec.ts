import { test, expect } from '@playwright/test';

const CONTACT_PATH = '/contacto';

test.describe('Contact page iframe checks', () => {
  test(`iframe present and embed responds 200 for ${CONTACT_PATH}`, async ({
    page,
    request,
  }) => {
    const base = process.env.BASE_URL || 'http://localhost:3000';
    const url = new URL(CONTACT_PATH, base).toString();
    const resp = await page.goto(url, { waitUntil: 'networkidle' });
    expect(resp && resp.ok()).toBeTruthy();

    const iframe = page.locator(
      'iframe[src*="google.com"], iframe[src*="maps.google"]'
    );
    const count = await iframe.count();
    expect(count).toBeGreaterThan(0);

    const src = await iframe.first().getAttribute('src');
    expect(src).toBeTruthy();

    let embedUrl: string;
    try {
      embedUrl = new URL(src as string, page.url()).toString();
    } catch (e) {
      void e;
      embedUrl = src as string;
    }

    const r = await request.get(embedUrl, {
      headers: { 'User-Agent': 'Playwright-Check' },
    });
    expect([200, 204, 301, 302, 304]).toContain(r.status());
  });
});
