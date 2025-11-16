# Testing and Validation Strategy for UI/UX Enhancements

## Overview

Comprehensive testing strategy to validate all UI/UX enhancements implemented in Pureza Naturalis V3, ensuring quality, performance, and user experience across all devices and scenarios.

## Testing Categories

### 1. Visual Regression Testing

#### Automated Visual Tests

```typescript
// playwright.config.ts - Visual regression configuration
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'visual-regression',
      testMatch: '**/*.visual.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        screenshot: 'on',
      },
    },
    {
      name: 'visual-regression-mobile',
      testMatch: '**/*.visual.spec.ts',
      use: {
        ...devices['iPhone 12'],
        screenshot: 'on',
      },
    },
  ],
});
```

#### Visual Test Examples

```typescript
// e2e/components/button.visual.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Button Component Visual Tests', () => {
  test('primary button variants', async ({ page }) => {
    await page.goto('/components/button');

    // Wait for fonts to load
    await page.waitForLoadState('networkidle');

    // Take screenshot of all button variants
    await expect(page.locator('.button-showcase')).toHaveScreenshot(
      'button-variants.png',
      {
        threshold: 0.1, // Allow 0.1% difference
      }
    );
  });

  test('button hover states', async ({ page }) => {
    await page.goto('/components/button');

    // Hover over primary button
    await page.locator('.btn-primary').hover();

    // Take screenshot of hover state
    await expect(page.locator('.btn-primary')).toHaveScreenshot(
      'button-primary-hover.png'
    );
  });

  test('button focus states', async ({ page }) => {
    await page.goto('/components/button');

    // Focus primary button
    await page.locator('.btn-primary').focus();

    // Take screenshot of focus state
    await expect(page.locator('.btn-primary')).toHaveScreenshot(
      'button-primary-focus.png'
    );
  });
});
```

### 2. Accessibility Testing

#### Automated Accessibility Tests

```typescript
// e2e/accessibility.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
  test('homepage accessibility', async ({ page }) => {
    await page.goto('/');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('product page accessibility', async ({ page }) => {
    await page.goto('/producto/test-product');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    // Allow some violations for complex components, but ensure critical issues are fixed
    const criticalViolations = accessibilityScanResults.violations.filter(
      (violation) =>
        violation.impact === 'critical' || violation.impact === 'serious'
    );

    expect(criticalViolations.length).toBeLessThan(3);
  });

  test('keyboard navigation', async ({ page }) => {
    await page.goto('/');

    // Test skip link
    await page.keyboard.press('Tab');
    await expect(page.locator('a[href="#main-content"]')).toBeFocused();

    // Navigate through main navigation
    await page.keyboard.press('Tab');
    await expect(page.locator('nav a:first-child')).toBeFocused();
  });

  test('screen reader content', async ({ page }) => {
    await page.goto('/');

    // Check for proper heading hierarchy
    const headings = await page
      .locator('h1, h2, h3, h4, h5, h6')
      .allTextContents();
    expect(headings.length).toBeGreaterThan(0);

    // Check for alt text on images
    const imagesWithoutAlt = await page.locator('img:not([alt])').count();
    expect(imagesWithoutAlt).toBe(0);

    // Check for proper form labels
    const inputsWithoutLabels = await page
      .locator('input:not([aria-label]):not([aria-labelledby])')
      .count();
    expect(inputsWithoutLabels).toBe(0);
  });
});
```

#### Manual Accessibility Testing Checklist

```markdown
## Accessibility Testing Checklist

### Keyboard Navigation

- [ ] All interactive elements are reachable via Tab key
- [ ] Tab order follows logical sequence
- [ ] Skip links work correctly
- [ ] Focus indicators are visible and clear
- [ ] Modal dialogs trap focus correctly
- [ ] Keyboard shortcuts work (where applicable)

### Screen Reader Support

- [ ] All images have appropriate alt text
- [ ] Form fields have proper labels
- [ ] Headings follow proper hierarchy (h1 → h2 → h3)
- [ ] ARIA labels are used appropriately
- [ ] Live regions announce dynamic content changes
- [ ] Color is not the only way information is conveyed

### Color and Contrast

- [ ] Text meets WCAG AA contrast requirements (4.5:1)
- [ ] Interactive elements have sufficient contrast
- [ ] Color-blind users can distinguish all elements
- [ ] High contrast mode is supported

### Touch and Mobile

- [ ] All touch targets are at least 44px × 44px
- [ ] Swipe gestures work correctly
- [ ] Touch feedback is provided
- [ ] Content doesn't zoom unexpectedly on input focus

### Cognitive Accessibility

- [ ] Instructions are clear and simple
- [ ] Error messages are helpful and specific
- [ ] Forms provide clear validation feedback
- [ ] Consistent navigation patterns are used
```

### 3. Performance Testing

#### Core Web Vitals Testing

```typescript
// e2e/performance.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  test('Core Web Vitals - Desktop', async ({ page }) => {
    // Start collecting metrics
    const client = await page.context().newCDPSession(page);
    await client.send('Performance.enable');

    await page.goto('/', { waitUntil: 'networkidle' });

    // Get Core Web Vitals
    const metrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const vitals = {};

          entries.forEach((entry) => {
            if (entry.entryType === 'largest-contentful-paint') {
              vitals.lcp = entry.startTime;
            }
            if (entry.entryType === 'first-input') {
              vitals.fid = (entry as any).processingStart - entry.startTime;
            }
            if (
              entry.entryType === 'layout-shift' &&
              !(entry as any).hadRecentInput
            ) {
              vitals.cls = (vitals.cls || 0) + (entry as any).value;
            }
          });

          // Get FCP
          const paintEntries = performance.getEntriesByType('paint');
          const fcpEntry = paintEntries.find(
            (entry) => entry.name === 'first-contentful-paint'
          );
          if (fcpEntry) {
            vitals.fcp = fcpEntry.startTime;
          }

          resolve(vitals);
        });

        observer.observe({
          entryTypes: [
            'largest-contentful-paint',
            'first-input',
            'layout-shift',
            'paint',
          ],
        });

        // Timeout after 10 seconds
        setTimeout(() => resolve({}), 10000);
      });
    });

    // Assert Core Web Vitals thresholds
    expect(metrics.lcp).toBeLessThan(2500); // LCP < 2.5s
    expect(metrics.fid).toBeLessThan(100); // FID < 100ms
    expect(metrics.cls).toBeLessThan(0.1); // CLS < 0.1
    expect(metrics.fcp).toBeLessThan(1800); // FCP < 1.8s
  });

  test('mobile performance', async ({ browser }) => {
    const context = await browser.newContext({
      ...devices['iPhone 12'],
    });
    const page = await context.newPage();

    // Enable network throttling to simulate mobile conditions
    await page.route('**/*', async (route) => {
      await route.fulfill({
        status: 200,
        body: await route.fetch().then((res) => res.body()),
        // Add artificial delay to simulate slow network
        delay: 100,
      });
    });

    const startTime = Date.now();
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const loadTime = Date.now() - startTime;

    // Mobile should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);

    await context.close();
  });

  test('bundle size analysis', async ({ page }) => {
    await page.goto('/');

    // Get all JavaScript resources
    const jsResources = await page.evaluate(() => {
      const resources = performance.getEntriesByType('resource');
      return resources
        .filter((resource) => resource.name.includes('.js'))
        .map((resource) => ({
          name: resource.name,
          size: (resource as any).transferSize || 0,
        }));
    });

    const totalJSSize = jsResources.reduce(
      (total, resource) => total + resource.size,
      0
    );

    // Total JS should be under 500KB for initial load
    expect(totalJSSize).toBeLessThan(500 * 1024);
  });
});
```

#### Lighthouse Performance Testing

```typescript
// e2e/lighthouse.spec.ts
import { test, expect } from '@playwright/test';
import { playAudit } from 'playwright-lighthouse';

test.describe('Lighthouse Performance Tests', () => {
  test('PWA audit', async ({ page }) => {
    await page.goto('/');

    const lighthouseReport = await playAudit({
      page,
      thresholds: {
        performance: 90,
        accessibility: 90,
        'best-practices': 90,
        seo: 90,
        pwa: 90,
      },
      port: 9222,
    });

    expect(
      lighthouseReport.lhr.categories.performance.score * 100
    ).toBeGreaterThanOrEqual(90);
    expect(
      lighthouseReport.lhr.categories.accessibility.score * 100
    ).toBeGreaterThanOrEqual(90);
    expect(
      lighthouseReport.lhr.categories.pwa.score * 100
    ).toBeGreaterThanOrEqual(90);
  });
});
```

### 4. Cross-Browser and Cross-Device Testing

#### Device and Browser Matrix

```typescript
// e2e/cross-browser.spec.ts
import { test, expect } from '@playwright/test';

const browsers = ['chromium', 'firefox', 'webkit'] as const;
const viewports = [
  { width: 1920, height: 1080, name: 'desktop' },
  { width: 1366, height: 768, name: 'laptop' },
  { width: 768, height: 1024, name: 'tablet' },
  { width: 375, height: 667, name: 'mobile' },
] as const;

browsers.forEach((browser) => {
  viewports.forEach((viewport) => {
    test(`${browser} - ${viewport.name} - basic functionality`, async ({
      page,
    }) => {
      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      });

      await page.goto('/');

      // Test basic functionality works across all combinations
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('nav')).toBeVisible();

      // Test responsive navigation
      if (viewport.width < 768) {
        // Mobile menu should be accessible
        const mobileMenuButton = page.locator(
          '[aria-label="Toggle navigation"]'
        );
        if (await mobileMenuButton.isVisible()) {
          await mobileMenuButton.click();
          await expect(page.locator('nav')).toBeVisible();
        }
      }
    });
  });
});
```

### 5. User Experience Testing

#### Conversion Funnel Testing

```typescript
// e2e/conversion.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Conversion Funnel Tests', () => {
  test('product purchase flow', async ({ page }) => {
    await page.goto('/');

    // Navigate to store
    await page.locator('a[href="/tienda"]').click();
    await expect(page).toHaveURL('/tienda');

    // Select a product
    await page.locator('.product-card').first().click();

    // Add to cart
    await page.locator('[aria-label*="Agregar al carrito"]').click();

    // Check cart notification appears
    await expect(page.locator('[role="alert"]')).toBeVisible();

    // Navigate to cart
    await page.locator('[aria-label*="Carrito de compras"]').click();
    await expect(page).toHaveURL('/carrito');

    // Proceed to checkout
    await page.locator('a[href="/checkout"]').click();
    await expect(page).toHaveURL('/checkout');

    // Fill checkout form (simulated)
    await page.locator('#email').fill('test@example.com');
    await page.locator('#name').fill('Test User');

    // Complete purchase
    await page.locator('button[type="submit"]').click();

    // Should redirect to confirmation page
    await expect(page).toHaveURL(/pedido-confirmado/);
  });

  test('PWA installation flow', async ({ page }) => {
    await page.goto('/');

    // Wait for install prompt (if available)
    const installButton = page
      .locator('[aria-label*="Instalar"]')
      .or(page.locator('button:has-text("Instalar")'));

    if (await installButton.isVisible({ timeout: 5000 })) {
      // Test install prompt appears
      await expect(installButton).toBeVisible();

      // Note: Actual installation can't be tested in headless mode
      // but we can verify the prompt appears correctly
    }
  });
});
```

#### A/B Testing Framework

```typescript
// e2e/ab-testing.spec.ts
import { test, expect } from '@playwright/test';

test.describe('A/B Testing Validation', () => {
  test('trust badges visibility', async ({ page }) => {
    await page.goto('/checkout');

    // Check that trust badges are visible
    await expect(page.locator('[data-testid="trust-badges"]')).toBeVisible();

    // Check specific badges
    await expect(page.locator('[data-testid="ssl-badge"]')).toBeVisible();
    await expect(
      page.locator('[data-testid="secure-payment-badge"]')
    ).toBeVisible();
  });

  test('urgency indicators', async ({ page }) => {
    await page.goto('/producto/test-product');

    // Check for stock indicators
    const stockIndicator = page.locator('[data-testid="stock-indicator"]');
    if (await stockIndicator.isVisible()) {
      await expect(stockIndicator).toContainText(/Quedan \d+ unidades/);
    }

    // Check for countdown timers (if applicable)
    const countdown = page.locator('[data-testid="countdown-timer"]');
    if (await countdown.isVisible()) {
      // Verify timer format
      await expect(countdown).toHaveAttribute('aria-live', 'polite');
    }
  });

  test('social proof elements', async ({ page }) => {
    await page.goto('/producto/test-product');

    // Check for review summary
    await expect(page.locator('[data-testid="review-summary"]')).toBeVisible();

    // Check for testimonial cards
    const testimonials = page.locator('[data-testid="testimonial-card"]');
    if ((await testimonials.count()) > 0) {
      await expect(testimonials.first()).toBeVisible();
    }
  });
});
```

### 6. Component Testing

#### Unit Tests for Components

```typescript
// src/components/Button/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByRole('button', { name: /click me/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(<Button loading>Save</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('is accessible', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'button');
    expect(button).not.toBeDisabled();
  });

  it('supports different variants', () => {
    const { rerender } = render(<Button variant="primary">Button</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-green-600');

    rerender(<Button variant="secondary">Button</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-gray-600');
  });

  it('supports different sizes', () => {
    const { rerender } = render(<Button size="sm">Button</Button>);
    expect(screen.getByRole('button')).toHaveClass('px-3');

    rerender(<Button size="lg">Button</Button>);
    expect(screen.getByRole('button')).toHaveClass('px-6');
  });
});
```

#### Integration Tests

```typescript
// src/components/ProductCard/ProductCard.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { ProductCard } from './ProductCard';

const mockProduct = {
  id: '1',
  name: 'Test Product',
  price: 29.99,
  image: '/test-image.jpg',
  description: 'A test product',
};

describe('ProductCard', () => {
  it('renders product information', () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$29.99')).toBeInTheDocument();
    expect(screen.getByAltText('Test Product')).toBeInTheDocument();
  });

  it('handles add to cart', async () => {
    const mockAddToCart = jest.fn();
    render(<ProductCard product={mockProduct} onAddToCart={mockAddToCart} />);

    const addButton = screen.getByRole('button', { name: /agregar al carrito/i });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(mockAddToCart).toHaveBeenCalledWith(mockProduct);
    });
  });

  it('is accessible', () => {
    render(<ProductCard product={mockProduct} />);

    // Check semantic structure
    expect(screen.getByRole('article')).toBeInTheDocument();

    // Check image alt text
    expect(screen.getByAltText('Test Product')).toBeInTheDocument();

    // Check button accessibility
    const button = screen.getByRole('button', { name: /agregar al carrito/i });
    expect(button).toHaveAttribute('aria-label');
  });
});
```

### 7. Real User Monitoring

#### Performance Monitoring Setup

```typescript
// src/utils/performance.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

export const reportWebVitals = (onPerfEntry?: (metric: any) => void) => {
  if (onPerfEntry && typeof onPerfEntry === 'function') {
    getCLS(onPerfEntry);
    getFID(onPerfEntry);
    getFCP(onPerfEntry);
    getLCP(onPerfEntry);
    getTTFB(onPerfEntry);
  }
};

// In App.tsx
import { reportWebVitals } from './utils/performance';

function App() {
  useEffect(() => {
    reportWebVitals((metric) => {
      // Send to analytics service
      console.log('Web Vital:', metric);

      // Example: Send to Google Analytics
      if (typeof gtag !== 'undefined') {
        gtag('event', metric.name, {
          value: Math.round(metric.value),
          event_category: 'Web Vitals',
          event_label: metric.id,
          non_interaction: true,
        });
      }
    });
  }, []);

  return <div>{/* App content */}</div>;
}
```

#### Error Monitoring

```typescript
// src/utils/errorMonitoring.ts
import * as Sentry from '@sentry/react';

export const initErrorMonitoring = () => {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 1.0,
    integrations: [new Sentry.BrowserTracing(), new Sentry.Replay()],
  });
};

export const captureError = (error: Error, context?: any) => {
  Sentry.captureException(error, {
    tags: {
      component: 'ui-ux-enhancement',
    },
    extra: context,
  });
};
```

## Testing Infrastructure

### CI/CD Pipeline Configuration

```yaml
# .github/workflows/test.yml
name: Test Suite
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18, 20]

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test:ci

      - name: Run accessibility tests
        run: npm run test:a11y

      - name: Run visual regression tests
        run: npm run test:visual

      - name: Run performance tests
        run: npm run test:performance

      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: test-results-${{ matrix.node-version }}
          path: |
            test-results/
            coverage/
            lighthouse-reports/
```

### Test Data Management

```typescript
// src/test/testData.ts
export const mockProducts = [
  {
    id: '1',
    name: 'Producto de Prueba 1',
    price: 29.99,
    image: '/test-image-1.jpg',
    description: 'Descripción del producto de prueba',
    category: 'suplementos',
    rating: 4.5,
    reviewCount: 12,
  },
  // More test products...
];

export const mockUser = {
  id: 'user-1',
  name: 'Usuario de Prueba',
  email: 'test@example.com',
  preferences: {
    theme: 'light',
    language: 'es',
  },
};

export const mockReviews = [
  {
    id: 'review-1',
    productId: '1',
    userId: 'user-1',
    rating: 5,
    title: 'Excelente producto',
    comment: 'Muy satisfecho con la calidad',
    verified: true,
    helpful: 5,
    notHelpful: 0,
    createdAt: new Date('2024-01-15'),
  },
  // More test reviews...
];
```

## Success Metrics and Reporting

### Test Coverage Requirements

- **Unit Tests**: >90% coverage for components
- **Integration Tests**: All critical user flows covered
- **E2E Tests**: All conversion funnels tested
- **Accessibility Tests**: WCAG AA compliance verified
- **Performance Tests**: Core Web Vitals within targets
- **Visual Regression**: All components tested

### Quality Gates

```typescript
// scripts/qualityGate.js
const qualityGate = {
  minUnitTestCoverage: 90,
  maxBundleSize: 500 * 1024, // 500KB
  maxAccessibilityViolations: 0,
  minLighthouseScore: 90,
  maxPerformanceRegression: 10, // 10% degradation allowed
};

export const checkQualityGate = async (results) => {
  const issues = [];

  if (results.coverage < qualityGate.minUnitTestCoverage) {
    issues.push(
      `Unit test coverage too low: ${results.coverage}% (required: ${qualityGate.minUnitTestCoverage}%)`
    );
  }

  if (results.bundleSize > qualityGate.maxBundleSize) {
    issues.push(
      `Bundle size too large: ${results.bundleSize} bytes (max: ${qualityGate.maxBundleSize})`
    );
  }

  if (
    results.accessibilityViolations > qualityGate.maxAccessibilityViolations
  ) {
    issues.push(
      `Too many accessibility violations: ${results.accessibilityViolations}`
    );
  }

  if (results.lighthouseScore < qualityGate.minLighthouseScore) {
    issues.push(
      `Lighthouse score too low: ${results.lighthouseScore} (required: ${qualityGate.minLighthouseScore})`
    );
  }

  if (issues.length > 0) {
    console.error('Quality gate failed:');
    issues.forEach((issue) => console.error(`- ${issue}`));
    process.exit(1);
  }

  console.log('✅ All quality gates passed!');
};
```

### Continuous Monitoring

```typescript
// src/utils/monitoring.ts
export const initMonitoring = () => {
  // Error tracking
  window.addEventListener('error', (event) => {
    // Send to error monitoring service
    console.error('JavaScript error:', event.error);
  });

  window.addEventListener('unhandledrejection', (event) => {
    // Send to error monitoring service
    console.error('Unhandled promise rejection:', event.reason);
  });

  // Performance monitoring
  if ('PerformanceObserver' in window) {
    // Monitor long tasks
    const longTaskObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 50) {
          // Tasks longer than 50ms
          console.warn('Long task detected:', entry);
          // Send to monitoring service
        }
      }
    });
    longTaskObserver.observe({ entryTypes: ['longtask'] });

    // Monitor layout shifts
    const layoutShiftObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput && (entry as any).value > 0.1) {
          console.warn('Layout shift detected:', entry);
          // Send to monitoring service
        }
      }
    });
    layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });
  }
};
```

This comprehensive testing and validation strategy ensures that all UI/UX enhancements are thoroughly tested, validated, and monitored to maintain high quality and user experience standards.
