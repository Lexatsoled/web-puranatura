import { test, expect } from '@playwright/test';

test.describe('Add to Cart Flow', () => {
  test('should add a product to the cart and verify it', async ({ page }) => {
    // Navigate to the store page
    await page.goto('http://localhost:3500/tienda');

    // Find a product and click the "Add to Cart" button
    // This assumes a product with the name "Product A" exists from our previous tests
    const productCard = page.locator('article', { hasText: 'Product A' });
    await productCard.getByRole('button', { name: /añadir/i }).click();

    // Verify that the cart count in the header updates
    const cartLink = page.locator('a[href="/cart"]');
    await expect(cartLink).toContainText('1');

    // Navigate to the cart page
    await cartLink.click();

    // Verify that the product is in the cart
    const cartItem = page.locator('.cart-item', { hasText: 'Product A' });
    await expect(cartItem).toBeVisible();
    await expect(cartItem.getByLabelText('Quantity')).toHaveValue('1');
  });
});
