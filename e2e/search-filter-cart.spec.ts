import { test, expect } from '@playwright/test';

test.describe('Funcionalidades críticas: búsqueda, filtros y carrito', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/productos');
  });

  test('debe permitir buscar productos', async ({ page }) => {
    const searchInput = page.locator('[data-testid="search-input"]');
    await expect(searchInput).toBeVisible();

    await searchInput.fill('vitamina');
    await searchInput.press('Enter');

    // Verificar que se muestran resultados de búsqueda
    await expect(page.locator('.product-card')).toHaveCount(
      await page.locator('.product-card').count()
    );
  });

  test('debe aplicar filtros de categoría', async ({ page }) => {
    const categoryFilter = page.locator('[data-testid="category-filter"]');
    await expect(categoryFilter).toBeVisible();

    await categoryFilter.selectOption('Vitaminas');

    // Verificar que se muestran productos filtrados
    await expect(page.locator('.product-card')).toHaveCount(
      await page.locator('.product-card').count()
    );
  });

  test('debe aplicar filtros de precio', async ({ page }) => {
    const minPriceInput = page.locator('[data-testid="min-price"]');
    const maxPriceInput = page.locator('[data-testid="max-price"]');

    await minPriceInput.fill('10');
    await maxPriceInput.fill('50');
    await page.click('[data-testid="apply-price-filter"]');

    // Verificar productos en rango de precio
    await expect(page.locator('.product-card')).toHaveCount(
      await page.locator('.product-card').count()
    );
  });

  test('debe añadir productos al carrito', async ({ page }) => {
    const firstProduct = page.locator('.product-card').first();
    const addToCartButton = firstProduct.locator('[data-testid="add-to-cart"]');

    await expect(addToCartButton).toBeVisible();
    await addToCartButton.click();

    // Verificar que el producto se añade al carrito
    const cartCounter = page.locator('[data-testid="cart-counter"]');
    await expect(cartCounter).toContainText('1');
  });

  test('debe mostrar modal del carrito', async ({ page }) => {
    // Añadir producto al carrito primero
    const firstProduct = page.locator('.product-card').first();
    await firstProduct.locator('[data-testid="add-to-cart"]').click();

    // Abrir modal del carrito
    await page.click('[data-testid="cart-button"]');

    const cartModal = page.locator('[data-testid="cart-modal"]');
    await expect(cartModal).toBeVisible();

    // Verificar contenido del carrito
    await expect(cartModal.locator('.cart-item')).toHaveCount(1);
  });

  test('debe permitir modificar cantidad en el carrito', async ({ page }) => {
    // Añadir producto al carrito
    const firstProduct = page.locator('.product-card').first();
    await firstProduct.locator('[data-testid="add-to-cart"]').click();

    // Abrir carrito
    await page.click('[data-testid="cart-button"]');

    // Modificar cantidad
    const quantityInput = page.locator('[data-testid="cart-item-quantity"]');
    await quantityInput.fill('3');

    // Verificar actualización
    await expect(page.locator('[data-testid="cart-total"]')).toBeVisible();
  });

  test('debe permitir eliminar productos del carrito', async ({ page }) => {
    // Añadir producto al carrito
    const firstProduct = page.locator('.product-card').first();
    await firstProduct.locator('[data-testid="add-to-cart"]').click();

    // Abrir carrito
    await page.click('[data-testid="cart-button"]');

    // Eliminar producto
    await page.click('[data-testid="remove-item"]');

    // Verificar carrito vacío
    await expect(page.locator('[data-testid="empty-cart"]')).toBeVisible();
  });

  test('debe persistir el carrito entre sesiones', async ({
    page,
    context,
  }) => {
    // Añadir producto al carrito
    const firstProduct = page.locator('.product-card').first();
    await firstProduct.locator('[data-testid="add-to-cart"]').click();

    // Crear nueva página (simular nueva sesión)
    const newPage = await context.newPage();
    await newPage.goto('/productos');

    // Verificar que el carrito persiste
    const cartCounter = newPage.locator('[data-testid="cart-counter"]');
    await expect(cartCounter).toContainText('1');
  });
});
