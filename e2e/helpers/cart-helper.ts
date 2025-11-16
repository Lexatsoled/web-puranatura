import { Page, Browser } from '@playwright/test';
import fs from 'fs';
import path from 'path';

type Product = any;

async function fetchProduct(
  page: Page,
  productId?: string
): Promise<Product | null> {
  try {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001';
    const url = productId
      ? `${backendUrl}/api/v1/products/${productId}`
      : `${backendUrl}/api/v1/products?limit=1`;
    const resp = await page.request.get(url);
    if (!resp.ok()) return null;
    const body = await resp.json();
    // Backend sometimes returns { product } or { products: [...] }
    if (body.product) return body.product;
    if (Array.isArray(body.products) && body.products.length > 0)
      return body.products[0];
    if (Array.isArray(body.items) && body.items.length > 0)
      return body.items[0];
    return body;
  } catch (err) {
    // best-effort; return null so caller can handle
    return null;
  }
}

function buildCartState(product: Product, quantity: number) {
  const qty = Math.max(1, Math.floor(quantity));
  const item = { product, quantity: qty };
  const total = (product?.price ?? 0) * qty;
  const count = qty;
  return {
    cart: {
      items: [item],
      total,
      count,
    },
    isOpen: false,
  };
}

/**
 * Seed the browser's localStorage persisted cart before the app initializes.
 * Uses `page.addInitScript` so the value exists when the app reads persisted state.
 */
export async function seedCart(
  page: Page,
  opts?: { productId?: string; quantity?: number }
) {
  const product = await fetchProduct(page, opts?.productId);
  if (!product)
    throw new Error('Could not fetch product from backend to seed cart');
  const quantity = opts?.quantity ?? 1;
  const state = buildCartState(product, quantity);

  // Add init script before navigation so Zustand sees the persisted value on startup.
  // Serialize the state and write it directly into the page's localStorage
  // before navigation. Using page.evaluate here is more deterministic than
  // addInitScript in some CI environments where argument serialization may
  // be troublesome.
  const stateJson = JSON.stringify(state);
  // Use addInitScript so the persisted value exists when the app first
  // initializes on navigation. Pass a single payload object to avoid
  // argument serialization issues in some Playwright environments.
  // Add init script in the context so it applies consistently across pages
  const context = page.context();
  await context.addInitScript(
    ({
      persistKey,
      serializedState,
    }: {
      persistKey: string;
      serializedState: string;
    }) => {
      try {
        localStorage.setItem(persistKey, serializedState);
        try {
          const parsed = JSON.parse(serializedState);
          localStorage.setItem(
            persistKey,
            JSON.stringify({ state: parsed, version: 2 })
          );
        } catch (e) {
          // ignore parse errors
        }
      } catch (e) {
        // ignore
      }
    },
    { persistKey: 'pureza-naturalis-cart-storage', serializedState: stateJson }
  );

  // Fallback: attempt to write directly to the current page's localStorage
  // This can fail in certain contexts (about:blank or cross-origin) but is an
  // helpful last resort that increases determinism in CI environments.
  try {
    await page.evaluate(
      (k, s) => {
        try {
          localStorage.setItem(k, s);
          try {
            const parsed = JSON.parse(s);
            localStorage.setItem(
              k,
              JSON.stringify({ state: parsed, version: 2 })
            );
          } catch (e) {
            void e;
          }
        } catch (e) {
          void e;
        }
      },
      'pureza-naturalis-cart-storage',
      stateJson
    );
  } catch (e) {
    // ignore evaluation errors -- we rely on the initScript for final persistence
    void e;
  }

  // Ensure the current page is on the app origin so the initScript runs there
  try {
    const currentUrl = await page.evaluate(() => location?.href ?? '');
    if (currentUrl === 'about:blank' || !currentUrl.startsWith(baseUrl)) {
      // Navigate to the root of the app (no-op if already there) and wait for load
      await page
        .goto(baseUrl + '/', { waitUntil: 'load', timeout: 20000 })
        .catch(() => {});
    }
  } catch (e) {
    // ignore errors - probe fallback will still attempt to seed
    void e;
  }

  // If reading localStorage on the existing page fails, create a small probe
  // page on the app origin to ensure the initScript ran and the persisted
  // cart state is present. This is helpful in CI/browser combos where the
  // current page may be about:blank or cross-origin.
  try {
    const baseUrl = (process.env.BASE_URL || 'http://localhost:3000').replace(
      /\/+$/,
      ''
    );
    const current = await page.evaluate(() => ({ url: location?.href ?? '' }));
    const storageCheck = await page
      .evaluate(() => localStorage.getItem('pureza-naturalis-cart-storage'))
      .catch(() => null);
    if (!storageCheck) {
      const probe = await context.newPage();
      try {
        await probe.goto(baseUrl + '/', { waitUntil: 'load', timeout: 20000 });
        // Give the initScript a moment to run
        await probe.waitForTimeout(100);
        const seedCheck = await probe
          .evaluate(() => localStorage.getItem('pureza-naturalis-cart-storage'))
          .catch(() => null);
        // If seedCheck is null, attempt to directly set it on probe
        if (!seedCheck) {
          await probe.evaluate(
            (k, s) => {
              try {
                localStorage.setItem(k, s);
              } catch (e) {
                void e;
              }
            },
            'pureza-naturalis-cart-storage',
            stateJson
          );
        }
      } finally {
        await probe.close();
      }
    }
  } catch (e) {
    // ignore — probe logic is just a best-effort to ensure persistence
  }

  // Verify persistence: attempt to read the storage from the app origin using
  // a probe page for a short time window. Retry a couple of times to work
  // around flakiness in some browsers or CI combinations (notably WebKit).
  const baseUrl = (process.env.BASE_URL || 'http://localhost:3000').replace(
    /\/+$/,
    ''
  );
  const maxWaitMs = 30000; // extend verification window on CI where startup may be slower
  const intervalMs = 250;
  const tryUntil = (ms: number) => new Promise((res) => setTimeout(res, ms));
  const verifyStart = Date.now();
  let persisted = false;
  while (Date.now() - verifyStart < maxWaitMs) {
    try {
      const probe = await context.newPage();
      try {
        await probe.goto(baseUrl + '/', { waitUntil: 'load', timeout: 20000 });
        const seedCheck = await probe
          .evaluate(() => localStorage.getItem('pureza-naturalis-cart-storage'))
          .catch(() => null);
        if (seedCheck) {
          persisted = true;
          return product;
        }
        // If nothing found, try to set it directly as a fallback and then re-check next loop
        await probe.evaluate(
          (k, s) => {
            try {
              localStorage.setItem(k, s);
              try {
                const parsed = JSON.parse(s);
                localStorage.setItem(
                  k,
                  JSON.stringify({ state: parsed, version: 2 })
                );
              } catch (e) {
                void e;
              }
            } catch (e) {
              void e;
            }
            // stray baseUrl removed; this is the evaluate() contract
          },
          'pureza-naturalis-cart-storage',
          stateJson
        );
      } finally {
        await probe.close();
      }
    } catch (e) {
      // ignore - just retry after interval
      void e;
    }
    await tryUntil(intervalMs);
  }

  if (!persisted) {
    // best-effort notice in logs; do not throw so tests can re-seed, but keep
    // an indicator in case ops needs to investigate flaky seed behavior.
    console.warn(
      '[E2E-DIAG] seedCart: localStorage key not detected after retries (baseUrl=' +
        baseUrl +
        ')'
    );
  }

  return product;
}

export async function clearCart(page: Page) {
  const empty = { cart: { items: [], total: 0, count: 0 }, isOpen: false };
  const emptyJson = JSON.stringify(empty);
  const context = page.context();
  await context.addInitScript(
    ({
      persistKey,
      serializedState,
    }: {
      persistKey: string;
      serializedState: string;
    }) => {
      try {
        localStorage.setItem(persistKey, serializedState);
        try {
          const parsed = JSON.parse(serializedState);
          localStorage.setItem(
            persistKey,
            JSON.stringify({ state: parsed, version: 2 })
          );
        } catch (e) {
          // ignore — best-effort
          void e;
        }
      } catch (e) {
        // ignore — best-effort
        void e;
      }
    },
    { persistKey: 'pureza-naturalis-cart-storage', serializedState: emptyJson }
  );
}

/**
 * Seed the given page and export the storage state to a file path.
 * Returns the generated storage path for reuse in subsequent contexts.
 */
export async function seedCartAndSaveStorageState(
  page: Page,
  filename?: string,
  opts?: { productId?: string; quantity?: number }
) {
  const storageDir = path.join(process.cwd(), 'tmp', 'e2e-storage');
  if (!fs.existsSync(storageDir)) fs.mkdirSync(storageDir, { recursive: true });
  const fileName =
    filename ||
    `storage-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.json`;
  const filePath = path.join(storageDir, fileName);
  await seedCart(page, opts);
  try {
    await page.context().storageState({ path: filePath });
  } catch (e) {
    // ignore storageState write errors — we still keep the seeding for this context
    console.warn(
      '[E2E-DIAG] seedCartAndSaveStorageState: failed to write storageState',
      e?.message || e
    );
  }
  return filePath;
}

/**
 * Seed the given page, write storageState, then create a new context + page from that storage.
 * Returns the newly created page and context to the caller; the caller must close the returned context when done.
 */
export async function seedCartAndCreatePreseededPage(
  page: Page,
  browser: Browser,
  opts?: { productId?: string; quantity?: number }
) {
  const storagePath = await seedCartAndSaveStorageState(page, undefined, opts);
  const ctx = await browser.newContext({ storageState: storagePath });
  const newPage = await ctx.newPage();
  // navigate to app root to ensure any init scripts run properly
  const baseUrl = (process.env.BASE_URL || 'http://localhost:3000').replace(
    /\/+$/,
    ''
  );
  try {
    await newPage.goto(baseUrl + '/', { waitUntil: 'load', timeout: 20000 });
  } catch (e) {
    // ignore navigation errors; the context still has sandboxed storage
  }
  return { page: newPage, context: ctx, storagePath };
}

export async function seedCartWithFirstProduct(page: Page, quantity = 1) {
  await seedCart(page, { quantity });
}

export default {
  seedCart,
  clearCart,
  seedCartWithFirstProduct,
};
