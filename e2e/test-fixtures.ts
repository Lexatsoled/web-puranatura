import { test as base, expect } from '@playwright/test';

export const test = base.extend({
  page: async ({ page }, use) => {
    page.on('pageerror', (error) => console.log('[PAGE ERROR]', String(error)));
    page.on('response', (r) => {
      if (r.url().includes('/api/v1/products'))
        console.log('[API RESPONSE]', r.status(), r.url());
    });
    await page.addInitScript(() => {
      (function () {
        const disableOverlays = () => {
          try {
            const vw = window.innerWidth || 0;
            const vh = window.innerHeight || 0;
            const els = Array.from(document.querySelectorAll('body *'));
            els.forEach((el: any) => {
              try {
                const s = window.getComputedStyle(el);
                el.style.transition = 'none';
                el.style.animation = 'none';
                const pos = s.position;
                const z = parseInt(s.zIndex) || 0;
                const rect = el.getBoundingClientRect();
                if (
                  (pos === 'fixed' || pos === 'absolute') &&
                  rect.width >= vw * 0.8 &&
                  rect.height >= vh * 0.25 &&
                  z > 0
                ) {
                  el.style.pointerEvents = 'none';
                  el.style.visibility = 'hidden';
                }
                if (
                  (el.tagName === 'IFRAME' ||
                    el.getAttribute('role') === 'dialog') &&
                  rect.width >= vw * 0.5 &&
                  rect.height >= vh * 0.2
                ) {
                  el.style.pointerEvents = 'none';
                  el.style.visibility = 'hidden';
                }
              } catch (e) {}
            });
          } catch (e) {}
        };
        disableOverlays();
        new MutationObserver(disableOverlays).observe(
          document.documentElement,
          { childList: true, subtree: true }
        );
      })();
    });

    const sampleProduct = {
      id: 'fallback-product-1',
      name: 'Vitamina C - Fallback',
      description: 'Producto de prueba',
      price: 9.99,
      stock: 10,
      categories: ['Vitaminas'],
      images: [
        {
          thumbnail: '/assets/fallback-product-thumb.jpg',
          full: '/assets/fallback-product.jpg',
        },
      ],
    } as any;
    const sampleProducts = [
      sampleProduct,
      {
        ...sampleProduct,
        id: 'fallback-product-2',
        name: 'Vitamina D - Fallback',
        price: 5.99,
      },
      {
        ...sampleProduct,
        id: 'fallback-product-3',
        name: 'Vitamina B - Fallback',
        price: 14.99,
      },
    ];

    await page.route('**/api/v1/products*', async (route, request) => {
      try {
        const url = new URL(request.url());
        const pathParts = url.pathname.split('/').filter(Boolean);
        const last = pathParts[pathParts.length - 1] ?? '';
        const isProductId =
          Boolean(last && Number.isNaN(Number(last)) === false) ||
          /[a-z0-9\-]{6,}/i.test(last);
        if (isProductId && url.pathname.includes('/api/v1/products/')) {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ product: { ...sampleProduct, id: last } }),
          });
          return;
        }
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ products: sampleProducts }),
        });
      } catch (e) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ products: sampleProducts }),
        });
      }
    });

    await page.route('**/api/v1/orders', async (route, request) => {
      if (request.method() === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ success: true, orderId: 'TEST-123' }),
        });
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ orders: [] }),
      });
    });

    await page.route('**/api/v1/auth/login', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          token: 'E2E-FAKE-TOKEN',
          user: { id: 'e2e-user', name: 'E2E User' },
        }),
      });
    });
    await page.route('**/api/v1/auth/register', async (route) => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          token: 'E2E-FAKE-TOKEN',
          user: { id: 'e2e-user', name: 'E2E User' },
        }),
      });
    });

    await use(page);
  },
});

export { expect };
