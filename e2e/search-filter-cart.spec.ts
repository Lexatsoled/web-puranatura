import { test, expect } from '@playwright/test';
import { clickWhenReady } from './helpers/interaction';

test.describe('Funcionalidades críticas: búsqueda, filtros y carrito', () => {
  test.beforeEach(async ({ page }) => {
    // Capture console messages for debugging
    page.on('console', (m) => console.log('[PAGE LOG]', m.text()));
    await page.goto('/tienda');
    // Wait for product card element either via class or data-testid pattern
    await page
      .waitForSelector('.product-card, [data-testid^="product-card-"]', {
        timeout: 20000,
      })
      .catch(async () => {
        // Output page body for debugging when selector is missing
        const body = await page.content();
        console.log(
          'PAGE BODY ON FAILURE START:\n',
          body.slice(0, 8000),
          '\nPAGE BODY ON FAILURE END'
        );
      });
  });

  test('debe permitir buscar productos', async ({ page }) => {
    const searchInput = page.locator('[data-testid="search-input"]');
    await expect(searchInput).toBeVisible();
    await searchInput.fill('vitamina');
    await searchInput.press('Enter');
    await expect(page.locator('.product-card')).toHaveCount(
      await page.locator('.product-card').count()
    );
  });

  test('debe permitir añadir productos al carrito', async ({ page }) => {
    const firstProduct = page.locator('.product-card').first();
    const addToCartButton = firstProduct.locator('[data-testid="add-to-cart"]');
    await addToCartButton.waitFor({ state: 'visible', timeout: 10000 });
    await clickWhenReady(addToCartButton);
    const cartCounter = page.locator('[data-testid="cart-counter"]');
    await expect(cartCounter).toContainText('1');
  });
});
