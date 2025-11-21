import { test as base, expect } from '@playwright/test';

export const test = base.extend({
  page: async ({ page }, use) => {
    page.on('pageerror', (error) => console.log('[PAGE ERROR]', String(error)));
    page.on('response', (r) => {
      if (r.url().includes('/api/products'))
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
        const root = document?.documentElement;
        if (root) {
          new MutationObserver(disableOverlays).observe(root, {
            childList: true,
            subtree: true,
          });
        }
      })();
    });

    const sampleProduct = {
      id: 'fallback-product-1',
      name: 'Vitamina C - Fallback',
      slug: 'vitamina-c-fallback',
      description: 'Producto de prueba',
      category: 'vitaminas',
      price: 9.99,
      stock: 10,
      imageUrl:
        'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&w=600&q=80',
    } as any;
    const sampleProducts = [
      sampleProduct,
      {
        ...sampleProduct,
        id: 'fallback-product-2',
        name: 'Vitamina D - Fallback',
        slug: 'vitamina-d-fallback',
        price: 5.99,
      },
      {
        ...sampleProduct,
        id: 'fallback-product-3',
        name: 'Vitamina B - Fallback',
        slug: 'vitamina-b-fallback',
        price: 14.99,
      },
    ];

    const fulfillJson = async (route: any, body: any, status = 200) => {
      await route.fulfill({
        status,
        contentType: 'application/json',
        body: JSON.stringify(body),
      });
    };

    await page.route('**/api/**/products*', async (route, request) => {
      try {
        const url = new URL(request.url());
        const pathParts = url.pathname.split('/').filter(Boolean);
        const last = pathParts[pathParts.length - 1] ?? '';
        const isProductId =
          Boolean(last && Number.isNaN(Number(last)) === false) ||
          /[a-z0-9\-]{6,}/i.test(last);
        if (isProductId && url.pathname.includes('/api/')) {
          await fulfillJson(route, {
            product: { ...sampleProduct, id: last, slug: `${last}-slug` },
          });
          return;
        }
        await fulfillJson(route, { products: sampleProducts });
      } catch (e) {
        await fulfillJson(route, { products: sampleProducts });
      }
    });

    await page.route('**/api/**/orders*', async (route, request) => {
      if (request.method() === 'POST') {
        await fulfillJson(route, { success: true, orderId: 'TEST-123' }, 201);
        return;
      }
      await fulfillJson(route, { orders: [] });
    });

    await page.route('**/api/**/auth/login', async (route) => {
      await fulfillJson(route, {
        token: 'E2E-FAKE-TOKEN',
        user: { id: 'e2e-user', name: 'E2E User' },
      });
    });
    await page.route('**/api/**/auth/register', async (route) => {
      await fulfillJson(
        route,
        {
          token: 'E2E-FAKE-TOKEN',
          user: { id: 'e2e-user', name: 'E2E User' },
        },
        201
      );
    });

    await use(page);
  },
});

export { expect };
