import { test, expect } from '@playwright/test';

// Sample product pages discovered during audit; adjust as needed.
const PRODUCT_PAGES = ['/tienda/producto/461', '/tienda/producto/466', '/tienda/producto/460'];

test.describe('Product pages srcset smoke', () => {
  for (const p of PRODUCT_PAGES) {
    test(`no srcset parsing warnings on ${p}`, async ({ page }) => {
      const base = process.env.BASE_URL || 'http://localhost:3000';
      const url = new URL(p, base).toString();

      const consoleMessages: Array<{ type: string; text: string }> = [];
      page.on('console', (m) => consoleMessages.push({ type: m.type(), text: m.text() }));

      const resp = await page.goto(url, { waitUntil: 'networkidle' });
      expect(resp && resp.ok()).toBeTruthy();

      // give client-side scripts a moment to run
      await page.waitForTimeout(1000);

      // Search console messages for srcset or CSP/frame problems
      const bad = consoleMessages.filter((c) => /srcset|Failed parsing|CSP|X-Frame-Options|Refused to frame/i.test(c.text));
      if (bad.length) {
        // attach some context for debugging
        console.log('Detected console issues for', url, bad.map((b) => b.text));
      }
      expect(bad.length).toBe(0);
    });
  }
});
