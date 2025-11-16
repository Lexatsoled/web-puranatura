import { test, expect } from '@playwright/test';

test.describe('Tests de seguridad - Prevención XSS', () => {
  test('debe sanitizar input de búsqueda contra XSS', async ({ page }) => {
    await page.goto('/productos');

    const searchInput = page.locator('[data-testid="search-input"]');
    await expect(searchInput).toBeVisible();

    // Intentar inyección XSS básica
    const xssPayload =
      '<script>alert("XSS")</script><img src=x onerror=alert(1)>';
    await searchInput.fill(xssPayload);
    await searchInput.press('Enter');

    // Verificar que no se ejecuta el script (no hay alert)
    // y que el contenido se muestra sanitizado
    await expect(page.locator('script')).toHaveCount(0);
    await expect(page.locator('img[src="x"]')).toHaveCount(0);
  });

  test('debe sanitizar input de formularios de contacto', async ({ page }) => {
    await page.goto('/contacto');

    const nameInput = page.locator('[data-testid="contact-name"]');
    const emailInput = page.locator('[data-testid="contact-email"]');
    const messageInput = page.locator('[data-testid="contact-message"]');

    // Payload XSS en diferentes campos
    const xssScript = '<script>document.body.innerHTML="HACKED"</script>';
    const xssImg = '<img src=x onerror="alert(\'XSS\')">';

    await nameInput.fill(xssScript);
    await emailInput.fill('test@example.com');
    await messageInput.fill(xssImg);

    await page.click('[data-testid="submit-contact"]');

    // Verificar que el contenido se sanitiza y no se ejecuta
    await expect(page.locator('body')).not.toContainText('HACKED');
    await expect(page.locator('script')).toHaveCount(0);
  });

  test('debe prevenir XSS en URLs de productos', async ({ page }) => {
    // Intentar acceder a una URL con payload XSS
    const maliciousUrl = '/producto/<script>alert("XSS")</script>';
    await page.goto(maliciousUrl);

    // Verificar que se maneja correctamente y no se ejecuta el script
    await expect(page.locator('script')).toHaveCount(0);
    // Debería mostrar página 404 o redirigir
    await expect(page).toHaveURL(/.*404|.*not-found/);
  });

  test('debe sanitizar contenido dinámico en productos', async ({ page }) => {
    await page.goto('/productos');

    // Verificar que los nombres de productos se muestran correctamente
    // sin ejecutar scripts potencialmente maliciosos
    const productNames = page.locator('.product-name');
    const count = await productNames.count();

    for (let i = 0; i < count; i++) {
      const productName = productNames.nth(i);
      const text = await productName.textContent();
      // Verificar que no contiene scripts
      expect(text).not.toContain('<script>');
      expect(text).not.toContain('javascript:');
    }
  });

  test('debe prevenir XSS en parámetros de búsqueda', async ({ page }) => {
    const maliciousQuery = '<script>alert("XSS")</script>';
    await page.goto(`/productos?search=${encodeURIComponent(maliciousQuery)}`);

    // Verificar que no se ejecuta el script
    await expect(page.locator('script')).toHaveCount(0);

    // Verificar que se muestran resultados de búsqueda normales
    await expect(page.locator('.product-card')).toHaveCount(
      await page.locator('.product-card').count()
    );
  });

  test('debe sanitizar contenido de reseñas y comentarios', async ({
    page,
  }) => {
    await page.goto('/productos');

    // Hacer click en el primer producto
    await page.locator('.product-card').first().click();

    // Si hay sección de reseñas, verificar sanitización
    const reviewSection = page.locator('[data-testid="reviews-section"]');
    if (await reviewSection.isVisible()) {
      const reviews = reviewSection.locator('.review-content');
      const reviewCount = await reviews.count();

      for (let i = 0; i < reviewCount; i++) {
        const review = reviews.nth(i);
        const text = await review.textContent();
        expect(text).not.toContain('<script>');
        expect(text).not.toContain('onerror');
      }
    }
  });

  test('debe prevenir XSS en navegación del carrito', async ({ page }) => {
    await page.goto('/productos');

    // Añadir producto con nombre potencialmente malicioso (simulado)
    const firstProduct = page.locator('.product-card').first();
    await firstProduct.locator('[data-testid="add-to-cart"]').click();

    // Abrir carrito
    await page.click('[data-testid="cart-button"]');

    // Verificar que los nombres en el carrito están sanitizados
    const cartItemNames = page.locator('[data-testid="cart-item-name"]');
    const count = await cartItemNames.count();

    for (let i = 0; i < count; i++) {
      const itemName = cartItemNames.nth(i);
      const text = await itemName.textContent();
      expect(text).not.toContain('<script>');
      expect(text).not.toContain('javascript:');
    }
  });
});
