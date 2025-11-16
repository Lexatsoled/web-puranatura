import type { Product } from '../types/product';
import * as ProductRepository from './ProductRepository';

// En entorno de tests podemos haber expuesto un ProductRepository mock en globalThis
// (vitest.setup.tsx). Usarlo si existe para que la implementación real delegue en él
// y los tests puedan espiar/mockear las funciones.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const repo: any = (globalThis as any).ProductRepository || ProductRepository;

// Compat layer: implementar la API sincrónica esperada por los tests.
// En tiempo de tests, `ProductRepository` se mofea para devolver datos de prueba.
export const ProductService = {
  getProducts(filters?: any, sortBy?: string): Product[] {
    const all = repo.getAll?.();
    let list = all || [];
    if (filters) {
      if (repo.filter) {
        list = repo.filter(filters);
      }
    }
    if (sortBy && repo.sort) {
      list = repo.sort(list, sortBy);
    }
    return list;
  },

  getProductById(id: string): Product {
    if (!id || typeof id !== 'string') throw new Error('ID de producto inválido');
  const p = repo.getById?.(id);
    if (!p) throw new Error(`Producto con ID ${id} no encontrado`);
    return p;
  },

  validateProductForCart(productId: string, quantity: number) {
    try {
  const p: Product = repo.getById(productId);
      if (!p) return { valid: false, message: 'Producto agotado', availableStock: 0 };
      if (p.stock === 0) return { valid: false, message: 'Producto agotado', availableStock: 0 };
      if (quantity <= 0) return { valid: false, message: 'Cantidad debe ser mayor a 0' };
      if (quantity > p.stock)
        return { valid: false, message: `Solo hay ${p.stock} unidades disponibles`, availableStock: p.stock };
      return { valid: true };
    } catch (err: any) {
      return { valid: false, message: err?.message ?? 'Error desconocido' };
    }
  },

  calculateDiscountedPrice(product: Product) {
    const originalPrice = product.compareAtPrice ?? product.price;
    const finalPrice = product.price;
    if (product.compareAtPrice && product.compareAtPrice > product.price) {
      const discountPercentage = Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100);
      return {
        originalPrice: product.compareAtPrice,
        finalPrice: product.price,
        discountPercentage,
        hasDiscount: true,
      };
    }
    return { originalPrice, finalPrice, discountPercentage: 0, hasDiscount: false };
  },

  getRelatedProducts(productId: string, limit = 4) {
    try {
      const p = repo.getById?.(productId);
      if (!p) return [];
      if (repo.getRelatedProducts) return repo.getRelatedProducts(productId, limit);
      return [];
    } catch {
      return [];
    }
  },

  getFeaturedProducts(limit?: number) {
  const featured = repo.getFeatured?.() || [];
  const newProducts = repo.getNewProducts?.() || [];
  const best = repo.getBestSellers?.() || [];
    const combined = [...featured, ...newProducts, ...best];
    // Remove duplicates by id
    const map = new Map<string, Product>();
    for (const p of combined) {
      if (!map.has(p.id)) map.set(p.id, p);
    }
    const result = Array.from(map.values());
    return typeof limit === 'number' ? result.slice(0, limit) : result;
  },

  searchProducts(query: string) {
    if (!query || query.length < 3) return { products: [], totalResults: 0, searchTerm: query };
  const results = repo.search?.(query) || [];
    // Rank: items with term in name first
    const q = query.toLowerCase();
    results.sort((a: Product, b: Product) => {
      const aName = (a.name || '').toLowerCase();
      const bName = (b.name || '').toLowerCase();
      const aHas = aName.includes(q) ? 0 : 1;
      const bHas = bName.includes(q) ? 0 : 1;
      return aHas - bHas;
    });
    return { products: results, totalResults: results.length, searchTerm: query };
  },

  getProductStats() {
  const all = repo.getAll?.() || [];
  const featured = repo.getFeatured?.() || [];
  const newProducts = repo.getNewProducts?.() || [];
  const best = repo.getBestSellers?.() || [];
    return {
      totalProducts: all.length,
      inStockProducts: all.filter((p: Product) => p.stock > 0).length,
      outOfStockProducts: all.filter((p: Product) => p.stock === 0).length,
      featuredProducts: featured.length,
      newProducts: newProducts.length,
      bestSellers: best.length,
    };
  },

  validateProduct(product: any) {
    const errors: string[] = [];
    if (!product || typeof product !== 'object') return { valid: false, errors: ['ID de producto requerido y debe ser string', 'Nombre de producto requerido y debe ser string', 'Descripción de producto requerida y debe ser string'] };
    if (!product.id || typeof product.id !== 'string') errors.push('ID de producto requerido y debe ser string');
    if (!product.name || typeof product.name !== 'string') errors.push('Nombre de producto requerido y debe ser string');
    if (!product.description || typeof product.description !== 'string') errors.push('Descripción de producto requerida y debe ser string');
    return { valid: errors.length === 0, errors };
  },

  formatPrice(price: number, currency = 'RDS') {
    return `${price.toFixed(2)} ${currency}`;
  },

  calculateUnitPrice(product: any) {
  const note = product.priceNote;
  let text: string | undefined;
  if (!note) return null;
  if (Array.isArray(note)) text = note[0];
  else text = note;
  if (!text) return null;
  const match = text.match(/(\d+(?:[\.,]\d+)?)\s*RDS/i);
  if (!match) return null;
  // Normalize decimal separator and strip decimals if integer
  const num = parseFloat(match[1].replace(',', '.'));
  const formatted = Number.isInteger(num) ? String(num) : num.toFixed(2);
  return `${formatted} RDS`;
  },
};

export default ProductService;