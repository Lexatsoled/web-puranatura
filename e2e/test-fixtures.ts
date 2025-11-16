import {
  test as base,
  expect,
  type TestInfo,
  type Browser,
  type Page,
} from '@playwright/test';
import fs from 'fs';
import { seedCartAndCreatePreseededPage } from './helpers/cart-helper';
import type { BrowserContext } from 'playwright';

export const test = base.extend({
  // Override `page` fixture to add an init script before any navigation
  page: async ({ page }, use, testInfo) => {
    await page.addInitScript(() => {
      (function () {
        const disableOverlays = () => {
          try {
            const vw = window.innerWidth || 0;
            const vh = window.innerHeight || 0;
            const els = Array.from(document.querySelectorAll('body *'));
            els.forEach((el: any) => {
              try {
                const s = window.getComputedStyle(el);
                // disable transitions/animations
                el.style.transition = 'none';
                el.style.animation = 'none';

                const pos = s.position;
                const z = parseInt(s.zIndex) || 0;
                const rect = el.getBoundingClientRect();
                // Heuristic: large fixed/absolute elements covering most of viewport
                if (
                  (pos === 'fixed' || pos === 'absolute') &&
                  rect.width >= vw * 0.8 &&
                  rect.height >= vh * 0.25 &&
                  z > 0
                ) {
                  el.style.pointerEvents = 'none';
                  // hide if it looks like an overlay
                  el.style.visibility = 'hidden';
                }
              } catch (e) {
                // ignore
              }
            });
          } catch (e) {
            // ignore
          }
        };

        // run immediately and on DOM mutations
        disableOverlays();
        new MutationObserver(disableOverlays).observe(
          document.documentElement,
          { childList: true, subtree: true }
        );
      })();
    });

    // Collect console messages & runtime errors for test diagnostics
    const logs: string[] = [];
    page.on('console', (msg) => {
      try {
        const loc = msg.location ? msg.location() : undefined;
        const locStr = loc ? `${loc.url}:${loc.line}:${loc.column}` : '';
        logs.push(`[console:${msg.type()}] ${msg.text()} ${locStr}`);
      } catch (e) {
        logs.push(`[console:${msg.type()}] ${msg.text()}`);
      }
    });
    page.on('pageerror', (err) => {
      logs.push(`[pageerror] ${err?.message || String(err)}`);
    });
    page.on('requestfailed', (req) => {
      try {
        logs.push(
          `[requestfailed] ${req.method()} ${req.url()} (${req.failure()?.errorText})`
        );
      } catch (e) {
        logs.push(`[requestfailed] ${req.url()}`);
      }
    });

    // Provide the page to the test
    await use(page);

    // After the test ends, write logs to the test output directory for CI artifacts
    try {
      const outputDir = testInfo.outputPath('');
      const outPath = testInfo.outputPath('console.log');
      if (outputDir && !fs.existsSync(outputDir))
        fs.mkdirSync(outputDir, { recursive: true });
      fs.writeFileSync(outPath, logs.join('\n'), 'utf8');
    } catch (err) {
      // Do not fail the test if writing logs fails
      console.warn(
        'Failed to write console logs for test:',
        err?.message || err
      );
    }
  },
  // Fixture: preseededPage creates a new context and page seeded using storageState.
  preseededPage: async ({ page, browser }, use) => {
    // Create a pre-seeded page and context from the helper
    const {
      page: seededPage,
      context,
      storagePath,
    } = await seedCartAndCreatePreseededPage(page, browser, { quantity: 1 });
    // Provide the preseeded page object plus small helper attributes
    try {
      await use({ page: seededPage, context, storagePath });
    } finally {
      try {
        await context.close();
      } catch (e) {
        // ignore
      }
    }
  },
});

export { expect };
