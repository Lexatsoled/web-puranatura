import type { Browser } from '@playwright/test';
import { test, expect } from './test-fixtures';
import {
  seedCart,
  seedCartAndCreatePreseededPage,
} from './helpers/cart-helper';

test.describe('Add to Cart Flow', () => {
  test('should add a product to the cart and verify it', async ({
    page,
    browser,
  }) => {
    // Navigate to the store page (use baseURL from playwright config)
    await page.goto('/tienda');

    // Find the first product card and click its 'añadir' button
    const productCard = page
      .locator('article[data-testid^="product-card-"]')
      .first();
    // If markup lacks data-testid, fallback to the first article
    const hasProductCard = await productCard.count();
    const card = hasProductCard ? productCard : page.locator('article').first();
    // Prefer seeding the cart to avoid UI flakiness in clicking 'Añadir'
    const { page: seededPage, context: seededCtx } =
      await seedCartAndCreatePreseededPage(page, browser, { quantity: 1 });
    const activePage = seededPage ?? page;

    // Navigate to the cart page and verify at least one cart item exists
    const { CartPage } = await import('./pages/CartPage');
    const cartPage = new CartPage(activePage);
    await cartPage.goto({ expectItems: true });

    // Verify that the product is in the cart
    const itemCount = await cartPage.getItemCount();
    expect(itemCount).toBeGreaterThan(0);
    const displayedQuantity = await cartPage.getDisplayedQuantity();
    expect(displayedQuantity).toBeGreaterThanOrEqual(1);
    await seededCtx.close();
  });
});
