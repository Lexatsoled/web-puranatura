import { test, expect } from '@playwright/test';
import { clickWhenReady } from './helpers/interaction';

test.describe('Funcionalidades críticas: búsqueda, filtros y carrito', () => {
  test.beforeEach(async ({ page }) => {
    // Capture console messages and page errors for debugging
    page.on('console', (m) => console.log('[PAGE LOG]', m.text()));
    page.on('pageerror', (err) => console.log('[PAGE ERROR]', err.message));
    await page.goto('/tienda');
    // Esperar explícitamente que el input de búsqueda esté visible (sincroniza la vista)
    const searchInput = page.locator('[data-testid="search-input"]');
    await searchInput.waitFor({ state: 'visible', timeout: 20000 });
    // Además, esperar que al menos un product card esté presente
    await page.waitForSelector(
      '.product-card, [data-testid^="product-card-"]',
      {
        timeout: 20000,
      }
    );
  });

  test('debe permitir buscar productos', async ({ page }) => {
    const searchInput = page.locator('[data-testid="search-input"]');
    await expect(searchInput).toBeVisible();

    // Capturar el número inicial de resultados
    const cards = page.locator('[data-testid^="product-card-"]');
    const initialCount = await cards.count();
    expect(initialCount).toBeGreaterThan(0);

    // Ejecutar búsqueda y esperar resultados filtrados
    await searchInput.fill('vitamina');
    await searchInput.press('Enter');

    // Esperar que al menos un card visible coincida con la búsqueda
    await cards.first().waitFor({ state: 'visible', timeout: 10000 });
    const newCount = await cards.count();
    expect(newCount).toBeGreaterThan(0);

    // Verificar que al menos un producto visible coincide con la búsqueda
    const term = 'vitamina';
    let matches = 0;
    for (let i = 0; i < newCount; i++) {
      const card = cards.nth(i);
      const title = (await card.locator('h3').innerText()).toLowerCase();
      const descEl = card.locator('p');
      const desc = (await descEl.count())
        ? (await descEl.first().innerText()).toLowerCase()
        : '';
      if (title.includes(term) || desc.includes(term)) matches++;
    }
    expect(
      matches,
      `No se encontraron productos que contengan "${term}" en título o descripción`
    ).toBeGreaterThan(0);
  });

  test('debe permitir añadir productos al carrito', async ({ page }) => {
    const cards = page.locator('[data-testid^="product-card-"]');

    // Buscar el primer producto cuyo botón 'Añadir' esté habilitado
    const total = await cards.count();
    let clicked = false;
    for (let i = 0; i < total; i++) {
      const card = cards.nth(i);
      // Preferir el selector explícito `data-testid="add-to-cart"` si existe
      const addBtn = card.locator('button[data-testid="add-to-cart"]');
      if ((await addBtn.count()) === 1 && (await addBtn.isEnabled())) {
        await clickWhenReady(addBtn);
        clicked = true;
        break;
      }

      // Fallback: buscar entre los botones del card uno cuyo texto indique 'añadir' / 'agregar' / 'add'
      const buttons = card.locator('button');
      const btnCount = await buttons.count();
      for (let j = 0; j < btnCount; j++) {
        const b = buttons.nth(j);
        if (!(await b.isEnabled())) continue;
        const text = (await b.innerText()).toLowerCase();
        if (
          text.includes('añadir') ||
          text.includes('agregar') ||
          text.includes('add')
        ) {
          await clickWhenReady(b);
          clicked = true;
          break;
        }
      }
      if (clicked) break;
    }

    expect(clicked).toBeTruthy();
    const cartCounter = page.locator('[data-testid="cart-counter"]');
    await expect(cartCounter).toHaveText(/1/);
  });
});
