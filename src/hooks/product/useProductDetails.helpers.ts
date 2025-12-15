import { ApiProduct, mapApiProduct } from '../../utils/productMapper';
import { Product } from '../../types/product';
import { sanitizeProductContent } from '../../utils/contentSanitizers';
import { products as staticProducts } from '../../data/products';

let fallbackCache: Product[] | null = null;

const FALLBACK_JSON_PATH = '/data/fallback-products.json';

// Don't map legacy products as they are already in Product format
const sanitizeFallbackProducts = (products: Product[]) =>
  products.map((legacy) => sanitizeProductContent(legacy));

export const getFallbackProducts = async (): Promise<Product[]> => {
  if (fallbackCache) return fallbackCache;

  // 1. Try JSON for "hot" updates if available
  try {
    const res = await fetch(FALLBACK_JSON_PATH, { cache: 'force-cache' });
    if (res.ok) {
      const parsed = await res.json();
      if (parsed && Array.isArray(parsed.products)) {
        fallbackCache = sanitizeFallbackProducts(parsed.products);
        return fallbackCache;
      }
    }
  } catch {
    // ignore
  }

  // 2. Reliable Static Fallback (bundled)
  // This guarantees we always have data if JSON fails, avoiding "Failed to resolve" dynamic errors
  fallbackCache = sanitizeFallbackProducts(staticProducts);
  return fallbackCache;
};

interface HandleProductFetchArgs {
  api: ReturnType<typeof import('../../utils/api').useApi>;
  productId: string;
  isActive: () => boolean;
  onProduct: (product: Product | null) => void;
  onStatus: (status: 'loading' | 'ready' | 'error') => void;
}

export const handleProductFetch = async ({
  api,
  productId,
  isActive,
  onProduct,
  onStatus,
}: HandleProductFetchArgs) => {
  onStatus('loading');
  try {
    // Attempt API fetch
    const apiProduct = await api.get<ApiProduct>(`/products/${productId}`);
    if (!isActive()) return;
    const normalized = sanitizeProductContent(mapApiProduct(apiProduct));
    onProduct(normalized);
    onStatus('ready');
  } catch (apiError) {
    if (!isActive()) return;
    console.warn(
      `Product API failed for ${productId}, trying fallback...`,
      apiError
    );

    try {
      const fallbackProducts = await getFallbackProducts();
      const fallback = fallbackProducts.find((item) => item.id === productId);
      if (fallback) {
        onProduct(sanitizeProductContent(fallback));
        onStatus('ready');
      } else {
        console.warn(`Product ${productId} not found in fallback.`);
        onProduct(null);
        onStatus('error');
      }
    } catch (fallbackError) {
      console.error('Critical: Fallback fetch failed', fallbackError);
      onProduct(null);
      onStatus('error');
    }
  }
};
