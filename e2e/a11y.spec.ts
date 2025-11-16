import { test, expect } from '@playwright/test';
import axe from 'axe-core';

const pages = [
  '/',
  '/tienda',
  '/producto/1',
  '/blog',
  '/servicios',
  '/checkout',
];

async function runAxe(page) {
  await page.addScriptTag({
    url: 'https://cdn.jsdelivr.net/npm/axe-core@4.7.2/axe.min.js',
  });
  const results = await page.evaluate(async () => {
    return await (window as any).axe.run(document, {
      runOnly: ['wcag2a', 'wcag2aa'],
      resultTypes: ['violations'],
    });
  });
  return results;
}

test.describe('A11y (axe) critical paths', () => {
  for (const route of pages) {
    test(`axe: ${route}`, async ({ page }) => {
      // Use Playwright baseURL and route paths to avoid hardcoding ports
      await page.goto(route);
      const results = await runAxe(page);
      if (results.violations.length) {
        console.log(`A11y violations on ${route}:`);
        for (const v of results.violations) {
          console.log(
            `- [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} nodes)`
          );
        }
      }
      // Allow color-contrast to be reported but don't fail CI on it for now.
      // We will keep failing on 'critical' issues and other 'serious' ones.
      const seriousOrWorse = results.violations.filter(
        (v) => (v.impact === 'serious' || v.impact === 'critical') && v.id !== 'color-contrast'
      );
      expect
        .soft(seriousOrWorse, `Serious/critical a11y issues found on ${route}`)
        .toHaveLength(0);
    });
  }
});
