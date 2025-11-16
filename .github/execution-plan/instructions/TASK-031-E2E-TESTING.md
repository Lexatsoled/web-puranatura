# TASK-031: Testing End-to-End (E2E)

## 📋 INFORMACIÓN

**ID**: TASK-031 | **Fase**: 3 | **Prioridad**: ALTA | **Estimación**: 4h

## 🎯 OBJETIVO

Implementar tests E2E con Playwright para flujos críticos de usuario, integrado en CI.

## 🛠️ IMPLEMENTACIÓN

### Paso 1: Instalar Playwright

```bash
npm init playwright@latest
```

### Paso 2: Configuración Playwright

**Archivo**: `playwright.config.ts`

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### Paso 3: Page Object Model

**Archivo**: `e2e/pages/ProductsPage.ts`

```typescript
import { Page, Locator } from '@playwright/test';

export class ProductsPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly categoryFilter: Locator;
  readonly productCards: Locator;
  readonly addToCartButtons: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.getByPlaceholder('Buscar productos...');
    this.categoryFilter = page.getByRole('combobox', { name: 'Categoría' });
    this.productCards = page.getByRole('article');
    this.addToCartButtons = page.getByRole('button', { name: /añadir al carrito/i });
  }

  async goto() {
    await this.page.goto('/products');
  }

  async search(query: string) {
    await this.searchInput.fill(query);
    await this.searchInput.press('Enter');
  }

  async filterByCategory(category: string) {
    await this.categoryFilter.selectOption(category);
  }

  async addFirstProductToCart() {
    await this.addToCartButtons.first().click();
  }

  async getProductCount() {
    return this.productCards.count();
  }
}
```

**Archivo**: `e2e/pages/CartPage.ts`

```typescript
import { Page, Locator } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly totalAmount: Locator;
  readonly checkoutButton: Locator;
  readonly emptyCartMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.getByRole('listitem');
    this.totalAmount = page.getByTestId('cart-total');
    this.checkoutButton = page.getByRole('button', { name: /proceder al pago/i });
    this.emptyCartMessage = page.getByText(/carrito está vacío/i);
  }

  async goto() {
    await this.page.goto('/cart');
  }

  async getItemCount() {
    return this.cartItems.count();
  }

  async removeItem(index: number) {
    await this.cartItems.nth(index).getByRole('button', { name: /eliminar/i }).click();
  }

  async checkout() {
    await this.checkoutButton.click();
  }
}
```

### Paso 4: Tests de Flujo de Compra

**Archivo**: `e2e/checkout.spec.ts`

```typescript
import { test, expect } from '@playwright/test';
import { ProductsPage } from './pages/ProductsPage';
import { CartPage } from './pages/CartPage';

test.describe('Checkout Flow', () => {
  test('should complete full checkout process', async ({ page }) => {
    // 1. Navegar a productos
    const productsPage = new ProductsPage(page);
    await productsPage.goto();

    // 2. Buscar producto
    await productsPage.search('vitamina c');
    await page.waitForLoadState('networkidle');

    // Verificar resultados
    const productCount = await productsPage.getProductCount();
    expect(productCount).toBeGreaterThan(0);

    // 3. Añadir al carrito
    await productsPage.addFirstProductToCart();

    // Verificar notificación
    await expect(page.getByText(/producto añadido/i)).toBeVisible();

    // 4. Ir al carrito
    const cartPage = new CartPage(page);
    await cartPage.goto();

    // Verificar item en carrito
    const itemCount = await cartPage.getItemCount();
    expect(itemCount).toBe(1);

    // 5. Proceder al checkout
    await cartPage.checkout();

    // Verificar redirección a checkout
    await expect(page).toHaveURL(/\/checkout/);

    // 6. Rellenar formulario
    await page.getByLabel(/nombre/i).fill('Test User');
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/dirección/i).fill('Calle Test 123');
    await page.getByLabel(/ciudad/i).fill('Madrid');
    await page.getByLabel(/código postal/i).fill('28001');

    // 7. Confirmar orden
    await page.getByRole('button', { name: /confirmar pedido/i }).click();

    // 8. Verificar confirmación
    await expect(page.getByText(/pedido confirmado/i)).toBeVisible();
    await expect(page).toHaveURL(/\/orders\/\d+/);
  });

  test('should validate empty cart checkout', async ({ page }) => {
    const cartPage = new CartPage(page);
    await cartPage.goto();

    // Verificar mensaje de carrito vacío
    await expect(cartPage.emptyCartMessage).toBeVisible();

    // Botón checkout debe estar deshabilitado
    await expect(cartPage.checkoutButton).toBeDisabled();
  });

  test('should update cart quantities', async ({ page }) => {
    // Añadir producto
    const productsPage = new ProductsPage(page);
    await productsPage.goto();
    await productsPage.addFirstProductToCart();

    // Ir a carrito
    const cartPage = new CartPage(page);
    await cartPage.goto();

    // Incrementar cantidad
    const quantityInput = page.getByRole('spinbutton').first();
    await quantityInput.fill('3');
    await quantityInput.press('Enter');

    // Verificar total actualizado
    await expect(cartPage.totalAmount).not.toHaveText('0');
  });
});
```

### Paso 5: Tests de Autenticación

**Archivo**: `e2e/auth.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should login successfully', async ({ page }) => {
    await page.goto('/login');

    await page.getByLabel(/email/i).fill('user@example.com');
    await page.getByLabel(/contraseña/i).fill('password123');
    await page.getByRole('button', { name: /iniciar sesión/i }).click();

    // Verificar redirección y estado
    await expect(page).toHaveURL('/');
    await expect(page.getByText(/bienvenido/i)).toBeVisible();
  });

  test('should show validation errors', async ({ page }) => {
    await page.goto('/login');

    // Enviar formulario vacío
    await page.getByRole('button', { name: /iniciar sesión/i }).click();

    // Verificar errores
    await expect(page.getByText(/email es obligatorio/i)).toBeVisible();
    await expect(page.getByText(/contraseña es obligatoria/i)).toBeVisible();
  });

  test('should register new user', async ({ page }) => {
    await page.goto('/register');

    await page.getByLabel(/nombre/i).fill('New User');
    await page.getByLabel(/email/i).fill(`test${Date.now()}@example.com`);
    await page.getByLabel(/^contraseña$/i).fill('SecurePass123');
    await page.getByLabel(/confirmar contraseña/i).fill('SecurePass123');
    
    await page.getByRole('button', { name: /registrarse/i }).click();

    // Verificar registro exitoso
    await expect(page).toHaveURL('/');
    await expect(page.getByText(/cuenta creada/i)).toBeVisible();
  });
});
```

### Paso 6: Tests de Performance

**Archivo**: `e2e/performance.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Performance', () => {
  test('should load homepage in under 3 seconds', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000);
  });

  test('should have good Core Web Vitals', async ({ page }) => {
    await page.goto('/');

    // Medir LCP
    const lcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          resolve(lastEntry.renderTime || lastEntry.loadTime);
        }).observe({ entryTypes: ['largest-contentful-paint'] });
      });
    });

    expect(lcp).toBeLessThan(2500); // LCP < 2.5s
  });
});
```

### Paso 7: Fixtures y Helpers

**Archivo**: `e2e/fixtures/auth.ts`

```typescript
import { test as base } from '@playwright/test';

type AuthFixtures = {
  authenticatedPage: Page;
};

export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page }, use) => {
    // Login
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('user@example.com');
    await page.getByLabel(/contraseña/i).fill('password123');
    await page.getByRole('button', { name: /iniciar sesión/i }).click();
    await page.waitForURL('/');

    await use(page);
  },
});

export { expect } from '@playwright/test';
```

### Paso 8: CI Integration

**Archivo**: `.github/workflows/playwright.yml`

```yaml
name: Playwright Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright Browsers
        run: npx playwright install --with-deps
      
      - name: Run Playwright tests
        run: npx playwright test
      
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

### Paso 9: Scripts package.json

```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug",
    "test:e2e:headed": "playwright test --headed",
    "test:e2e:report": "playwright show-report"
  }
}
```

## ✅ CRITERIOS DE ACEPTACIÓN

- [x] Playwright configurado
- [x] Page Object Model
- [x] Tests de checkout completo
- [x] Tests de autenticación
- [x] Tests de performance
- [x] CI integration
- [x] Reports HTML/JSON
- [x] Multi-browser testing

## 🧪 VALIDACIÓN

```bash
# Run all tests
npm run test:e2e

# Run with UI
npm run test:e2e:ui

# Debug mode
npm run test:e2e:debug

# Specific test
npx playwright test checkout.spec.ts

# View report
npm run test:e2e:report
```

---

**Status**: COMPLETO ✅
