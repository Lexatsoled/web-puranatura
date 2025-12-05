import { ApiProduct, mapApiProduct } from '../../utils/productMapper';
import { Product } from '../../types/product';
import { sanitizeProductContent } from '../../utils/contentSanitizers';

let fallbackCache: Product[] | null = null;

const FALLBACK_MODULE_PATH = '../../data/products';

const sanitizeFallbackProducts = (products: ApiProduct[]) =>
  products.map((legacy) => sanitizeProductContent(mapApiProduct(legacy)));

export const getFallbackProducts = async (): Promise<Product[]> => {
  if (fallbackCache) return fallbackCache;
  const fallbackModule = await import(FALLBACK_MODULE_PATH);
  fallbackCache = sanitizeFallbackProducts(fallbackModule.products);
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
    const apiProduct = await api.get<ApiProduct>(`/products/${productId}`);
    if (!isActive()) return;
    const normalized = sanitizeProductContent(mapApiProduct(apiProduct));
    onProduct(normalized);
    onStatus('ready');
  } catch {
    if (!isActive()) return;
    const fallbackProducts = await getFallbackProducts();
    const fallback = fallbackProducts.find((item) => item.id === productId);
    if (fallback) {
      onProduct(fallback);
      onStatus('ready');
    } else {
      onProduct(null);
      onStatus('error');
    }
  }
};
