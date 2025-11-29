import { test, expect } from '@playwright/test';

test('Store page shows seeded products', async ({ page, baseURL }) => {
  // Visit store page
  await page.goto('/tienda');

  // Wait for at least one product card to appear
  const cards = await page.locator('[data-testid^="product-card-"]').first();
  await expect(cards).toBeVisible({ timeout: 10000 });

  // Check there are at least 1 product cards
  const cardCount = await page
    .locator('[data-testid^="product-card-"]')
    .count();
  expect(cardCount).toBeGreaterThan(0);

  // Basic assertions on first product: name and price exist (use specific selectors)
  const firstCard = page.locator('[data-testid^="product-card-"]').first();
  await expect(firstCard.locator('h3')).toBeVisible();
  // price is displayed in an element with text-xl class
  await expect(firstCard.locator('.text-xl')).toBeVisible();
});
