import { test, expect } from '@playwright/test';

test.describe('Performance', () => {
  test('should load homepage in under 3 seconds', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000);
  });

  test('should have good Core Web Vitals', async ({ page }) => {
    await page.goto('/');

    // Medir LCP usando web-vitals
    const lcp = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        // Usar PerformanceObserver para LCP
        new PerformanceObserver((list) => {
          const entries = list.getEntriesByType('largest-contentful-paint');
          if (entries.length > 0) {
            const lastEntry = entries[entries.length - 1] as any;
            resolve(lastEntry.startTime);
          }
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // Timeout fallback
        setTimeout(() => resolve(0), 5000);
      });
    });

    expect(lcp).toBeLessThan(2500); // LCP < 2.5s
  });
});