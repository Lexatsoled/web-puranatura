import { test, expect } from '@playwright/test';

const CONTACT_PATHS = ['/contacto', '/contact', '/contact-us', '/contactanos'];

test.describe('Contact page iframe checks', () => {
  for (const p of CONTACT_PATHS) {
    test(`iframe present and embed responds 200 for ${p}`, async ({ page, request }) => {
      const base = process.env.BASE_URL || 'http://localhost:3000';
      const url = new URL(p, base).toString();
      const resp = await page.goto(url, { waitUntil: 'networkidle' });
      // allow pages that redirect to a canonical contact path
      expect(resp && resp.ok()).toBeTruthy();

      // find iframe that likely points to google maps
      const iframe = page.locator('iframe[src*="google.com"], iframe[src*="maps.google"]');
      const count = await iframe.count();
      expect(count).toBeGreaterThan(0);

      const src = await iframe.first().getAttribute('src');
      expect(src).toBeTruthy();

      // Resolve relative src against page URL
      let embedUrl: string;
      try {
        embedUrl = new URL(src as string, page.url()).toString();
      } catch {
        embedUrl = src as string;
      }

      // Use Playwright API (request) to fetch the embed URL and check status
      const r = await request.get(embedUrl, { headers: { 'User-Agent': 'Playwright-Check' } });
      expect([200, 204, 301, 302, 304]).toContain(r.status());
    });
  }
});
