import { test, expect } from '@playwright/test';

test.describe('Navegación de la aplicación', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('debe cargar la página principal correctamente', async ({ page }) => {
    await expect(page).toHaveTitle(/Pureza Naturalis/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('debe navegar a la página de productos', async ({ page }) => {
    await page.click('text=Productos');
    await expect(page).toHaveURL(/.*productos/);
    await expect(page.locator('.product-card')).toHaveCount(
      await page.locator('.product-card').count()
    );
  });

  test('debe navegar a la página de servicios', async ({ page }) => {
    await page.click('text=Servicios');
    await expect(page).toHaveURL(/.*servicios/);
  });

  test('debe navegar a la página de blog', async ({ page }) => {
    await page.click('text=Blog');
    await expect(page).toHaveURL(/.*blog/);
  });

  test('debe navegar a la página de contacto', async ({ page }) => {
    await page.click('text=Contacto');
    await expect(page).toHaveURL(/.*contacto/);
  });

  test('debe mostrar el menú móvil en pantallas pequeñas', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();
  });

  test('debe permitir navegación desde el footer', async ({ page }) => {
    // Scroll to footer
    await page.locator('footer').scrollIntoViewIfNeeded();

    // Click on footer links
    await page.click('footer a:has-text("Productos")');
    await expect(page).toHaveURL(/.*productos/);
  });
});
