import { Product } from '../../../types/product';
import { sanitizeProductContent } from '../../../utils/contentSanitizers';
import { Category, DEFAULT_CATEGORY } from '../constants';

export const FALLBACK_MESSAGE =
  'Mostrando catálogo provisional mientras conectamos con la API.';

type FallbackResult = {
  products: Product[];
  categories: Category[];
};

export const loadFallbackProducts = async (): Promise<FallbackResult> => {
  // Try loading a static JSON payload first (served from /data/fallback-products.json).
  // This keeps large static data out of JS bundles and lets the browser cache the file.
  try {
    const res = await fetch('/data/fallback-products.json', { cache: 'force-cache' });
    if (res.ok) {
      const parsed = await res.json();
      // Expected shape: { products: Product[], productCategories: Category[] }
      if (parsed && Array.isArray(parsed.products)) {
        const fallbackProducts = parsed.products.map((product: Product) =>
          sanitizeProductContent(product)
        );
        const merged = [DEFAULT_CATEGORY, ...(parsed.productCategories ?? [])];
        const deduped = Array.from(
          new Map(merged.map((category: Category) => [category.id, category])).values()
        );
        return {
          products: fallbackProducts,
          categories: deduped,
        };
      }
    }
  } catch (e) {
    // If the fetch fails (file not present or network error), try a dev-only dynamic import.
    // We intentionally avoid importing the TS dataset in production builds to keep it out of bundles.
    // eslint-disable-next-line no-console
    console.debug('fallback JSON not available or failed to parse', e);

    if (import.meta.env?.DEV) {
      try {
        const fallbackModule = await import('../../../../data/products.ts');
        const fallbackProducts = fallbackModule.products.map((product) =>
          sanitizeProductContent(product)
        );
        const merged = [DEFAULT_CATEGORY, ...fallbackModule.productCategories];
        const deduped = Array.from(
          new Map(
            merged.map((category: Category) => [category.id, category])
          ).values()
        );
        return {
          products: fallbackProducts,
          categories: deduped,
        };
      } catch (err) {
        console.debug('dev fallback import failed:', err);
      }
    }
    // Production fallback: return an empty product set and categories list containing default.
    return {
      products: [],
      categories: [DEFAULT_CATEGORY],
    };
  }
  // If we reach here, the JSON fetch did not return a usable payload and any
  // dev-only fallback also failed — we already returned an empty production
  // fallback above, so this branch is unreachable. Still return a safe default
  // to satisfy TypeScript typing.
  return {
    products: [],
    categories: [DEFAULT_CATEGORY],
  };
};
