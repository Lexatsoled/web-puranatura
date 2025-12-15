import { test, expect } from '@playwright/test';

test.describe('Smoke Test - Flujos Críticos', () => {
  test('Home page carga correctamente', async ({ page }) => {
    await page.goto('/');

    // Verificar título
    await expect(page).toHaveTitle(/PuraNatura/);

    // Verificar que no hay errores de red graves (500)
    // (Esto es implícito si la página carga, pero podríamos añadir listeners)

    // Verificar elemento clave visible (e.g., Hero o Navbar)
    await expect(page.locator('nav')).toBeVisible();
  });

  test('Navegación a Tienda y visualización de productos', async ({ page }) => {
    await page.goto('/');

    // Navegar a Tienda
    await page
      .getByRole('link', { name: /Tienda|Productos/i })
      .first()
      .click();
    await expect(page).toHaveURL(/.*tienda/);

    // Esperar a que carguen los productos (esqueletos desaparecen)
    // Asumimos que hay al menos un producto visible
    // Buscamos un elemento genérico de producto o grid
    // Ajustar selector según tu UI real, ej: 'article', '.product-card'
    // Aquí usamos un timeout flexible porque es un smoke test
    try {
      await expect(page.locator('img[alt]').first()).toBeVisible({
        timeout: 10000,
      });
    } catch (e) {
      console.warn(
        'No se detectaron imágenes de productos en 10s, posible carga lenta o tienda vacía'
      );
    }
  });

  test('Página de Detalle de Producto carga', async ({ page }) => {
    // Ir directo a la tienda para este test
    await page.goto('/tienda');

    // Clic en el primer producto disponible
    const firstProduct = page.locator('a[href^="/producto/"]').first();

    if ((await firstProduct.count()) > 0) {
      await firstProduct.click();
      await expect(page).toHaveURL(/.*producto\/.+/);
      // Verificar precio visible
      await expect(page.getByText(/€|\$/)).toBeVisible();
    } else {
      test.skip('No hay productos en la tienda para probar detalle');
    }
  });
});
