import { test as base, expect } from '@playwright/test';

export const test = base.extend({
  // Override `page` fixture to add an init script before any navigation
  page: async ({ page }, use) => {
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
                if ((pos === 'fixed' || pos === 'absolute') && rect.width >= vw * 0.8 && rect.height >= vh * 0.25 && z > 0) {
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
        new MutationObserver(disableOverlays).observe(document.documentElement, { childList: true, subtree: true });
      })();
    });

    // Provide the page to the test
    await use(page);
  },
});

export { expect };
