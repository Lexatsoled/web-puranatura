import { Page } from '@playwright/test';

type Product = any;

async function fetchProduct(
  page: Page,
  productId?: string
): Promise<Product | null> {
  try {
    const apiBase = (
      process.env.VITE_API_URL ||
      process.env.API_BASE ||
      process.env.BASE_URL ||
      'http://localhost:5173'
    ).replace(/\/$/, '');
    const url = productId
      ? `${apiBase}/api/v1/products/${productId}`
      : `${apiBase}/api/v1/products?limit=1`;
    let body: any = null;
    try {
      body = await page.evaluate(async (u) => {
        try {
          const r = await fetch(u, { credentials: 'same-origin' });
          if (!r.ok) return null;
          return r.json();
        } catch (e) {
          return null;
        }
      }, url);
    } catch (_err) {}
    if (!body) {
      try {
        const resp = await page.request.get(url);
        if (resp.ok()) {
          body = await resp.json();
        }
      } catch (_e) {}
    }
    if (!body) {
      return null;
    }
    if (body?.product) return body.product;
    if (Array.isArray(body?.products) && body.products.length)
      return body.products[0];
    return body ?? null;
  } catch {
    return {
      id: productId ?? 'fallback-product-1',
      name: 'Vitamina C - Fallback',
      price: 9.99,
      slug: 'vitamina-c-fallback',
      images: [
        {
          thumbnail: '/assets/fallback-product-thumb.jpg',
          full: '/assets/fallback-product.jpg',
        },
      ],
    } as Product;
  }
}

function buildCartState(product: Product, quantity: number) {
  const qty = Math.max(1, Math.floor(quantity || 1));
  const item = { product, quantity: qty };
  const total = (product?.price ?? 0) * qty;
  const count = qty;
  return { cart: { items: [item], total, count }, isOpen: false };
}

export async function seedCart(
  page: Page,
  opts?: { productId?: string; quantity?: number }
) {
  const product = await fetchProduct(page, opts?.productId);
  if (!product)
    throw new Error('Could not fetch product from backend to seed cart');
  const quantity = opts?.quantity ?? 1;
  const stateJson = JSON.stringify(buildCartState(product, quantity));
  const ctx = page.context();
  await ctx.addInitScript(
    ({ key, value }: { key: string; value: string }) => {
      try {
        localStorage.setItem(key, value);
        try {
          const parsed = JSON.parse(value);
          localStorage.setItem(
            key,
            JSON.stringify({ state: parsed, version: 2 })
          );
        } catch {}
      } catch {}
    },
    { key: 'pureza-naturalis-cart-storage', value: stateJson }
  );
  try {
    await page.evaluate(
      (k, v) => {
        try {
          localStorage.setItem(k, v);
          try {
            const parsed = JSON.parse(v);
            localStorage.setItem(
              k,
              JSON.stringify({ state: parsed, version: 2 })
            );
          } catch {}
        } catch {}
      },
      'pureza-naturalis-cart-storage',
      stateJson
    );
  } catch {}
  const maxWaitMs = 5000;
  const intervalMs = 250;
  const start = Date.now();
  while (Date.now() - start < maxWaitMs) {
    try {
      const probe = await ctx.newPage();
      try {
        const baseUrl = process.env.BASE_URL || 'http://localhost:5173';
        await probe.goto(baseUrl, { waitUntil: 'load', timeout: 10000 });
        const seedCheck = await probe
          .evaluate(() => localStorage.getItem('pureza-naturalis-cart-storage'))
          .catch(() => null);
        if (seedCheck) {
          await probe.close();
          return product;
        }
      } finally {
        await probe.close();
      }
    } catch {}
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  return product;
}

export async function clearCart(page: Page) {
  await page.addInitScript((key: string) => {
    try {
      localStorage.setItem(
        key,
        JSON.stringify({
          cart: { items: [], total: 0, count: 0 },
          isOpen: false,
        })
      );
    } catch {}
  }, 'pureza-naturalis-cart-storage');
}
export async function seedCartWithFirstProduct(page: Page, quantity = 1) {
  await seedCart(page, { quantity });
}
export default { seedCart, clearCart, seedCartWithFirstProduct };
