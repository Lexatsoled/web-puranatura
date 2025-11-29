// DEPRECATED: utility Playwright script used during debugging. Tests now
// provide automated E2E coverage for the store page (see e2e/store.spec.ts).
// Keep this file only if you need a quick manual shell check; otherwise
// consider removing it to keep the repo clean.

/*
import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  try {
    await page.goto('http://localhost:5173/tienda', { waitUntil: 'networkidle' });
    // Wait for at least one product-card element
    await page.waitForSelector('[data-testid^="product-card-"]', { timeout: 10000 });
    const cards = await page.$$('[data-testid^="product-card-"]');
    console.log('[check_frontend_store] found product cards:', cards.length);
    // Print first product name
    if (cards.length > 0) {
      const name = await cards[0].$eval('h3', (el) => (el as HTMLElement).innerText);
      console.log('[check_frontend_store] first product name:', name);
    }
  } catch (err: any) {
    console.error('[check_frontend_store] ERROR:', err && err.message ? err.message : err);
    process.exitCode = 2;
  } finally {
    await browser.close();
  }
})();
*/
