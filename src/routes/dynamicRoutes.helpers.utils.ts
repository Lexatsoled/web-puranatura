/**
 * Utility functions for dynamic route helpers
 * Extracted to reduce cyclomatic complexity in main module
 */

const FALLBACK_PRODUCTS_PATH = '/data/fallback-products.json';
const PRODUCT_API = '/api/products';

/**
 * Determines if the endpoint is requesting a single product
 */
export function isSingleProductRequest(endpoint: string): boolean {
  return (
    endpoint.startsWith(PRODUCT_API) &&
    endpoint !== PRODUCT_API &&
    !endpoint.endsWith('/products')
  );
}

/**
 * Extracts product ID from API endpoint URL
 */
export function extractProductId(endpoint: string): string {
  return endpoint.substring(endpoint.lastIndexOf('/') + 1);
}

/**
 * Attempts to load products from fallback JSON file
 */
async function loadFallbackData(): Promise<any> {
  const fallback = await fetch(FALLBACK_PRODUCTS_PATH);
  if (!fallback.ok) {
    throw new Error('Fallback file not available');
  }
  return await fallback.json();
}

/**
 * Attempts to retrieve product data from fallback source
 * @throws Error if fallback is not available or product not found
 */
export async function tryProductFallback<T>(endpoint: string): Promise<T> {
  if (!endpoint.startsWith(PRODUCT_API)) {
    throw new Error('Not a product endpoint');
  }

  const fallbackJson = await loadFallbackData();
  const products = fallbackJson.products ?? [];

  // Handle full product list request
  if (endpoint === PRODUCT_API || endpoint.endsWith('/products')) {
    return products as unknown as T;
  }

  // Handle single product request
  const id = extractProductId(endpoint);
  const product = products.find((p: any) => String(p.id) === id);

  if (!product) {
    throw new Error(`Product ${id} not found in fallback`);
  }

  return product as T;
}
