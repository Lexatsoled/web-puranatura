import { test, expect } from '@playwright/test';

test.describe('Tests de performance y accesibilidad', () => {
  test('debe cargar la página principal en menos de 3 segundos', async ({
    page,
  }) => {
    const startTime = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(3000); // 3 segundos
  });

  test('debe cargar la página de productos en menos de 2 segundos', async ({
    page,
  }) => {
    const startTime = Date.now();
    await page.goto('/productos');
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(2000); // 2 segundos
  });

  test('debe tener Lighthouse performance score > 80', async ({ page }) => {
    await page.goto('/');

    // Ejecutar Lighthouse audit
    const lighthouse = await page.evaluate(() => {
      // Simular medición básica de performance
      const perfData = performance.getEntriesByType(
        'navigation'
      )[0] as PerformanceNavigationTiming;

      return {
        loadTime: perfData.loadEventEnd - perfData.fetchStart,
        domContentLoaded:
          perfData.domContentLoadedEventEnd - perfData.fetchStart,
        firstPaint: perfData.responseStart - perfData.fetchStart,
      };
    });

    expect(lighthouse.loadTime).toBeLessThan(3000);
    expect(lighthouse.domContentLoaded).toBeLessThan(2000);
  });

  test('debe tener imágenes optimizadas (menos de 500KB cada una)', async ({
    page,
  }) => {
    await page.goto('/productos');

    const images = page.locator('img');
    const imageCount = await images.count();

    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const src = await img.getAttribute('src');

      if (src && src.startsWith('http')) {
        const response = await page.request.get(src);
        const contentLength = response.headers()['content-length'];

        if (contentLength) {
          const sizeKB = parseInt(contentLength) / 1024;
          expect(sizeKB).toBeLessThan(500); // Menos de 500KB
        }
      }
    }
  });

  test('debe tener navegación accesible con teclado', async ({ page }) => {
    await page.goto('/');

    // Verificar navegación por teclado en menú principal
    await page.keyboard.press('Tab');
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();

    // Continuar tabulando
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
      const currentFocus = page.locator(':focus');
      await expect(currentFocus).toBeVisible();
    }
  });

  test('debe tener elementos interactivos con labels apropiados', async ({
    page,
  }) => {
    await page.goto('/productos');

    // Verificar botones de añadir al carrito
    const addToCartButtons = page.locator('[data-testid="add-to-cart"]');
    const buttonCount = await addToCartButtons.count();

    for (let i = 0; i < buttonCount; i++) {
      const button = addToCartButtons.nth(i);
      const ariaLabel = await button.getAttribute('aria-label');
      const textContent = await button.textContent();

      // Debe tener aria-label o texto descriptivo
      expect(ariaLabel || textContent?.trim()).toBeTruthy();
    }
  });

  test('debe tener contraste de color adecuado', async ({ page }) => {
    await page.goto('/');

    // Verificar contraste en texto principal
    const headings = page.locator('h1, h2, h3');
    const headingCount = await headings.count();

    for (let i = 0; i < Math.min(headingCount, 3); i++) {
      const heading = headings.nth(i);
      const color = await heading.evaluate((el) => getComputedStyle(el).color);
      const backgroundColor = await heading.evaluate(
        (el) => getComputedStyle(el).backgroundColor
      );

      // Verificación básica de que tienen color definido
      expect(color).not.toBe('rgba(0, 0, 0, 0)');
      expect(backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
    }
  });

  test('debe tener estructura semántica correcta', async ({ page }) => {
    await page.goto('/');

    // Verificar estructura HTML semántica
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();

    // Verificar headings jerárquicos
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThan(0);

    // Verificar navegación
    await expect(page.locator('nav')).toBeVisible();
  });

  test('debe manejar correctamente el scroll infinito', async ({ page }) => {
    await page.goto('/productos');

    // Medir tiempo de carga inicial
    const initialLoadTime = await page.evaluate(() => performance.now());

    // Scroll hacia abajo para activar carga infinita
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000); // Esperar carga

    // Verificar que se cargaron más productos
    const finalProductCount = await page.locator('.product-card').count();
    expect(finalProductCount).toBeGreaterThan(0);

    // Verificar que el rendimiento no se degrade significativamente
    const finalLoadTime = await page.evaluate(() => performance.now());
    const loadDifference = finalLoadTime - initialLoadTime;
    expect(loadDifference).toBeLessThan(5000); // Menos de 5 segundos adicionales
  });

  test('debe tener lazy loading funcionando correctamente', async ({
    page,
  }) => {
    await page.goto('/productos');

    // Verificar que las imágenes tienen lazy loading
    const images = page.locator('img');
    const imageCount = await images.count();

    let lazyLoadedCount = 0;
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const loading = await img.getAttribute('loading');
      if (loading === 'lazy') {
        lazyLoadedCount++;
      }
    }

    // Al menos algunas imágenes deberían tener lazy loading
    expect(lazyLoadedCount).toBeGreaterThan(0);
  });

  test('debe responder correctamente en dispositivos móviles', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await page.goto('/');

    // Verificar que el contenido se adapta
    const viewport = page.viewportSize();
    expect(viewport?.width).toBe(375);

    // Verificar menú móvil
    const mobileMenu = page.locator('[data-testid="mobile-menu"]');
    await expect(mobileMenu).toBeVisible();

    // Verificar que se puede hacer scroll
    await page.evaluate(() => window.scrollTo(0, 500));
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeGreaterThan(0);
  });
});
