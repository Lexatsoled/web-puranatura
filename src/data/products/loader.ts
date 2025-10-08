import { Product } from '@/types/product';

/**
 * Sistema de carga dinámica de productos con caché inteligente
 * Optimiza el bundle inicial cargando productos solo cuando se necesitan
 */

const productCache = new Map<string, Product[]>();

/**
 * Carga productos de una categoría específica
 */
export async function loadProductsByCategory(category: string): Promise<Product[]> {
  if (productCache.has(category)) {
    return productCache.get(category)!;
  }

  try {
    const allProductsModule = await import('./all-products');
    const allProducts = allProductsModule.products;
    
    const filtered = category === 'todos' 
      ? allProducts 
      : allProducts.filter((p: Product) => p.categories.includes(category));
    
    productCache.set(category, filtered);
    return filtered;
  } catch (error) {
    console.error(`Error loading products for category ${category}:`, error);
    return [];
  }
}

/**
 * Carga un producto específico por ID
 */
export async function loadProductById(productId: string): Promise<Product | undefined> {
  try {
    const allProducts = await loadProductsByCategory('todos');
    return allProducts.find(p => p.id === productId);
  } catch (error) {
    console.error(`Error loading product ${productId}:`, error);
    return undefined;
  }
}

/**
 * Pre-carga categorías populares en segundo plano
 */
export async function preloadCategories(categories: string[]): Promise<void> {
  await Promise.all(categories.map(cat => loadProductsByCategory(cat)));
}

/**
 * Limpia el caché de productos
 */
export function clearProductCache(): void {
  productCache.clear();
}

/**
 * Obtiene estadísticas del caché
 */
export function getCacheStats() {
  return {
    categoriesLoaded: productCache.size,
    categories: Array.from(productCache.keys()),
    totalProductsCached: Array.from(productCache.values()).reduce(
      (sum, products) => sum + products.length,
      0
    )
  };
}
