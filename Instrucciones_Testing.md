# 🧪 INSTRUCCIONES TESTING

> Guía completa de testing: unitarios, integración, E2E, cobertura  
> Stack: Vitest + React Testing Library + Playwright + Coverage

---

## 1. Configuración de Testing

### 1.1 Vitest Config

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData',
        'dist/'
      ],
      lines: 80,
      functions: 80,
      branches: 80,
      statements: 80
    },
    include: ['**/*.test.{ts,tsx}'],
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache']
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
```

### 1.2 Test Setup

```typescript
// src/test/setup.ts
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Limpieza después de cada test
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// Mock de localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
};
global.localStorage = localStorageMock as any;

// Mock de window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }))
});
```

---

## 2. Tests Unitarios

### 2.1 Test de Utilidad

```typescript
// src/utils/sanitizer.test.ts
import { describe, it, expect } from 'vitest';
import { sanitizeHTML, sanitizeText } from './sanitizer';

describe('sanitizer', () => {
  describe('sanitizeHTML', () => {
    it('debe permitir tags seguros', () => {
      const input = '<p>Texto <strong>importante</strong></p>';
      const output = sanitizeHTML(input);
      expect(output).toContain('<p>');
      expect(output).toContain('<strong>');
    });

    it('debe remover scripts', () => {
      const input = '<p>Texto</p><script>alert("XSS")</script>';
      const output = sanitizeHTML(input);
      expect(output).not.toContain('<script>');
      expect(output).not.toContain('alert');
    });

    it('debe remover event handlers', () => {
      const input = '<p onclick="alert(1)">Click</p>';
      const output = sanitizeHTML(input);
      expect(output).not.toContain('onclick');
    });

    it('debe preservar links seguros', () => {
      const input = '<a href="/productos">Ver productos</a>';
      const output = sanitizeHTML(input);
      expect(output).toContain('<a href="/productos">');
    });
  });

  describe('sanitizeText', () => {
    it('debe escapar caracteres HTML', () => {
      const input = '<script>alert("XSS")</script>';
      const output = sanitizeText(input);
      expect(output).toBe('&lt;script&gt;alert(&quot;XSS&quot;)&lt;&#x2F;script&gt;');
    });
  });
});
```

### 2.2 Test de Servicio (Backend)

```typescript
// backend/src/services/PasswordService.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { PasswordService } from './PasswordService';

describe('PasswordService', () => {
  describe('hash', () => {
    it('debe hashear contraseña', async () => {
      const password = 'Password123!';
      const hash = await PasswordService.hash(password);
      
      expect(hash).toBeTruthy();
      expect(hash).not.toBe(password);
      expect(hash).toMatch(/^\$2[ayb]\$.{56}$/); // bcrypt format
    });

    it('debe generar diferentes hashes para misma contraseña', async () => {
      const password = 'Password123!';
      const hash1 = await PasswordService.hash(password);
      const hash2 = await PasswordService.hash(password);
      
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('verify', () => {
    it('debe verificar contraseña correcta', async () => {
      const password = 'Password123!';
      const hash = await PasswordService.hash(password);
      const isValid = await PasswordService.verify(password, hash);
      
      expect(isValid).toBe(true);
    });

    it('debe rechazar contraseña incorrecta', async () => {
      const password = 'Password123!';
      const hash = await PasswordService.hash(password);
      const isValid = await PasswordService.verify('WrongPassword', hash);
      
      expect(isValid).toBe(false);
    });
  });

  describe('validateStrength', () => {
    it('debe aceptar contraseña fuerte', () => {
      const result = PasswordService.validateStrength('Password123!');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('debe rechazar contraseña corta', () => {
      const result = PasswordService.validateStrength('Pass1!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Debe tener al menos 8 caracteres');
    });

    it('debe rechazar sin mayúscula', () => {
      const result = PasswordService.validateStrength('password123!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Debe contener al menos una mayúscula');
    });

    it('debe rechazar sin número', () => {
      const result = PasswordService.validateStrength('Password!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Debe contener al menos un número');
    });
  });
});
```

### 2.3 Test de Componente

```typescript
// src/components/ProductCard/ProductCard.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCard } from './ProductCard';

describe('ProductCard', () => {
  const mockProduct = {
    productId: '1',
    name: 'Producto Test',
    price: 19.99
  };

  it('debe renderizar información del producto', () => {
    render(<ProductCard {...mockProduct} />);
    
    expect(screen.getByText('Producto Test')).toBeInTheDocument();
    expect(screen.getByText('$19.99')).toBeInTheDocument();
  });

  it('debe llamar onAddToCart al hacer click', async () => {
    const onAddToCart = vi.fn();
    render(<ProductCard {...mockProduct} onAddToCart={onAddToCart} />);
    
    const button = screen.getByRole('button', { name: /agregar/i });
    fireEvent.click(button);
    
    expect(onAddToCart).toHaveBeenCalledWith('1');
  });

  it('debe deshabilitar botón mientras carga', async () => {
    const onAddToCart = vi.fn(() => new Promise(resolve => setTimeout(resolve, 100)));
    render(<ProductCard {...mockProduct} onAddToCart={onAddToCart} />);
    
    const button = screen.getByRole('button', { name: /agregar/i });
    fireEvent.click(button);
    
    expect(button).toBeDisabled();
    expect(screen.getByText('Agregando...')).toBeInTheDocument();
  });

  it('debe aplicar className custom', () => {
    const { container } = render(
      <ProductCard {...mockProduct} className="custom-class" />
    );
    
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
```

### 2.4 Test de Custom Hook

```typescript
// src/hooks/useProducts.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useProducts } from './useProducts';
import { ProductService } from '@/services/ProductService';

vi.mock('@/services/ProductService');

describe('useProducts', () => {
  const mockProducts = [
    { id: '1', name: 'Producto 1', price: 10 },
    { id: '2', name: 'Producto 2', price: 20 }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe cargar productos exitosamente', async () => {
    vi.mocked(ProductService.getProducts).mockResolvedValue(mockProducts);

    const { result } = renderHook(() => useProducts());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.products).toEqual(mockProducts);
    expect(result.current.error).toBeNull();
  });

  it('debe manejar errores', async () => {
    const error = new Error('Error de red');
    vi.mocked(ProductService.getProducts).mockRejectedValue(error);

    const { result } = renderHook(() => useProducts());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.products).toEqual([]);
    expect(result.current.error).toEqual(error);
  });

  it('debe limpiar al desmontar', async () => {
    vi.mocked(ProductService.getProducts).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve(mockProducts), 100))
    );

    const { unmount } = renderHook(() => useProducts());
    unmount();

    // No debe actualizar estado después de desmontar
    await new Promise(resolve => setTimeout(resolve, 150));
  });
});
```

---

## 3. Tests de Integración

### 3.1 Test de Flujo Completo (Frontend)

```typescript
// src/pages/LoginPage/LoginPage.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { LoginPage } from './LoginPage';
import { AuthProvider } from '@/contexts/AuthContext';
import { AuthService } from '@/services/AuthService';

vi.mock('@/services/AuthService');

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('LoginPage Integration', () => {
  it('debe realizar login completo exitosamente', async () => {
    const mockUser = { id: '1', email: 'test@example.com', name: 'Test User' };
    vi.mocked(AuthService.login).mockResolvedValue({
      user: mockUser,
      accessToken: 'token123',
      refreshToken: 'refresh123'
    });

    renderWithProviders(<LoginPage />);

    // Llenar formulario
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    fireEvent.click(submitButton);

    // Verificar loading state
    expect(submitButton).toBeDisabled();

    // Verificar llamada al servicio
    await waitFor(() => {
      expect(AuthService.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'Password123!'
      });
    });
  });

  it('debe mostrar errores de validación', async () => {
    renderWithProviders(<LoginPage />);

    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/email requerido/i)).toBeInTheDocument();
      expect(screen.getByText(/contraseña requerida/i)).toBeInTheDocument();
    });
  });

  it('debe manejar errores de autenticación', async () => {
    vi.mocked(AuthService.login).mockRejectedValue(
      new Error('Credenciales inválidas')
    );

    renderWithProviders(<LoginPage />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'WrongPassword' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/credenciales inválidas/i)).toBeInTheDocument();
    });
  });
});
```

### 3.2 Test de API (Backend)

```typescript
// backend/src/routes/auth.routes.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import { app } from '../app';
import { db } from '@/config/database';

describe('Auth API Integration', () => {
  beforeEach(async () => {
    // Limpiar DB
    await db.query('DELETE FROM users');
    await db.query('DELETE FROM refresh_tokens');
  });

  afterEach(async () => {
    await db.query('DELETE FROM users');
    await db.query('DELETE FROM refresh_tokens');
  });

  describe('POST /api/auth/register', () => {
    it('debe registrar usuario nuevo', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'newuser@example.com',
          password: 'Password123!',
          name: 'New User'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body.user.email).toBe('newuser@example.com');
    });

    it('debe rechazar email duplicado', async () => {
      // Primer registro
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'duplicate@example.com',
          password: 'Password123!',
          name: 'User One'
        });

      // Segundo registro con mismo email
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'duplicate@example.com',
          password: 'Password123!',
          name: 'User Two'
        });

      expect(response.status).toBe(409);
      expect(response.body.error).toContain('ya existe');
    });

    it('debe rechazar contraseña débil', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'weak@example.com',
          password: 'weak',
          name: 'Weak User'
        });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Crear usuario de prueba
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Password123!',
          name: 'Test User'
        });
    });

    it('debe autenticar usuario válido', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Password123!'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
    });

    it('debe rechazar contraseña incorrecta', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'WrongPassword123!'
        });

      expect(response.status).toBe(401);
    });

    it('debe aplicar rate limiting', async () => {
      const requests = [];
      for (let i = 0; i < 6; i++) {
        requests.push(
          request(app)
            .post('/api/auth/login')
            .send({
              email: 'test@example.com',
              password: 'WrongPassword'
            })
        );
      }

      const responses = await Promise.all(requests);
      const lastResponse = responses[5];

      expect(lastResponse.status).toBe(429);
    });
  });
});
```

---

## 4. Tests E2E con Playwright

### 4.1 Configuración Playwright

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    }
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI
  }
});
```

### 4.2 Test E2E - Flujo de Compra

```typescript
// e2e/purchase-flow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Purchase Flow', () => {
  test('debe completar flujo de compra exitosamente', async ({ page }) => {
    // 1. Navegar a productos
    await page.goto('/productos');
    await expect(page).toHaveTitle(/Productos/i);

    // 2. Buscar producto
    await page.fill('[data-testid="search-input"]', 'vitamina');
    await page.press('[data-testid="search-input"]', 'Enter');
    await expect(page.locator('[data-testid="product-card"]')).toHaveCount(5);

    // 3. Ver detalle de producto
    await page.click('[data-testid="product-card"]:first-child');
    await expect(page).toHaveURL(/\/productos\/\d+/);
    await expect(page.locator('h1')).toContainText('Vitamina');

    // 4. Agregar al carrito
    await page.click('[data-testid="add-to-cart-button"]');
    await expect(page.locator('[data-testid="cart-badge"]')).toContainText('1');

    // 5. Ir al carrito
    await page.click('[data-testid="cart-button"]');
    await expect(page).toHaveURL('/carrito');
    await expect(page.locator('[data-testid="cart-item"]')).toHaveCount(1);

    // 6. Actualizar cantidad
    await page.fill('[data-testid="quantity-input"]', '2');
    await expect(page.locator('[data-testid="cart-total"]')).toContainText('39.98');

    // 7. Proceder a checkout
    await page.click('[data-testid="checkout-button"]');
    await expect(page).toHaveURL('/checkout');
  });

  test('debe persistir carrito en localStorage', async ({ page, context }) => {
    // Agregar producto al carrito
    await page.goto('/productos');
    await page.click('[data-testid="product-card"]:first-child');
    await page.click('[data-testid="add-to-cart-button"]');

    // Cerrar y reabrir página
    await page.close();
    const newPage = await context.newPage();
    await newPage.goto('/');

    // Verificar que carrito persiste
    await expect(newPage.locator('[data-testid="cart-badge"]')).toContainText('1');
  });
});
```

### 4.3 Test E2E - Autenticación

```typescript
// e2e/auth-flow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('debe registrar y autenticar usuario nuevo', async ({ page }) => {
    // 1. Ir a registro
    await page.goto('/registro');

    // 2. Llenar formulario
    await page.fill('[name="name"]', 'Usuario Prueba');
    await page.fill('[name="email"]', `test-${Date.now()}@example.com`);
    await page.fill('[name="password"]', 'Password123!');
    await page.fill('[name="confirmPassword"]', 'Password123!');

    // 3. Enviar formulario
    await page.click('button[type="submit"]');

    // 4. Verificar redirección y autenticación
    await expect(page).toHaveURL('/');
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
  });

  test('debe hacer login con usuario existente', async ({ page }) => {
    await page.goto('/login');

    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'Password123!');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/');
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
  });

  test('debe hacer logout correctamente', async ({ page }) => {
    // Login primero
    await page.goto('/login');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'Password123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/');

    // Logout
    await page.click('[data-testid="user-menu"]');
    await page.click('[data-testid="logout-button"]');

    // Verificar
    await expect(page).toHaveURL('/login');
    await expect(page.locator('[data-testid="user-menu"]')).not.toBeVisible();
  });
});
```

---

## 5. Comandos de Testing

### 5.1 Package.json Scripts

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:watch": "vitest --watch",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug"
  }
}
```

### 5.2 Flujo de Testing

```bash
# Tests unitarios en watch mode
npm run test:watch

# Tests unitarios con cobertura
npm run test:coverage

# Tests E2E
npm run test:e2e

# Tests E2E con UI
npm run test:e2e:ui

# Todos los tests
npm run test:run && npm run test:e2e
```

---

## 6. Checklist de Testing

- [ ] Tests unitarios para todas las utilidades
- [ ] Tests de servicios (frontend y backend)
- [ ] Tests de componentes React
- [ ] Tests de custom hooks
- [ ] Tests de integración de flujos completos
- [ ] Tests E2E de user journeys críticos
- [ ] Cobertura > 80% en todos los módulos
- [ ] Mocks correctos para APIs externas
- [ ] Tests de edge cases y errores
- [ ] Tests de accesibilidad básica
- [ ] CI/CD ejecutando tests automáticamente

---

**Estado**: ✅ Guía de Testing Completa
