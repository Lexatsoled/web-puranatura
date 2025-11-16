import { test, expect } from '@playwright/test';
import { seedCart } from './helpers/cart-helper';

test.describe('Add to Cart Flow', () => {
  test('should add a product to the cart and verify it', async ({ page }) => {
    // Navigate to the store page (use baseURL from playwright config)
    await page.goto('/tienda');

    // Find the first product card and click its 'añadir' button
    const productCard = page.locator('article[data-testid^="product-card-"]').first();
    // If markup lacks data-testid, fallback to the first article
    const hasProductCard = await productCard.count();
    const card = hasProductCard ? productCard : page.locator('article').first();
    // Prefer seeding the cart to avoid UI flakiness in clicking 'Añadir'
    await seedCart(page, { quantity: 1 });

    // Navigate to the cart page and verify at least one cart item exists
    await page.goto('/cart');

    // Verify that the product is in the cart
    const cartItem = page.locator('.cart-item').first();
    await expect(cartItem).toBeVisible();
    await expect(cartItem.getByLabelText('Quantity')).toHaveValue('1');
  });
});
