import type { Product } from '../types/product';

// Implementación ligera y sincrónica para pruebas. En tiempo de tests, estas funciones se mofean
// y se reemplazan por vi.mocked(...).mockReturnValue(...)

export function getAll(): Product[] {
  return [];
}

export function getById(_id: string): Product | undefined {
  return undefined;
}

export function filter(_filters: Record<string, unknown>): Product[] {
  return [];
}

export function sort(list: Product[], _sortBy?: string): Product[] {
  return list;
}

export function getRelatedProducts(_productId: string, _limit = 4): Product[] {
  return [];
}

export function getFeatured(): Product[] {
  return [];
}

export function getNewProducts(): Product[] {
  return [];
}

export function getBestSellers(): Product[] {
  return [];
}

export function search(_query: string): Product[] {
  return [];
}

export function getProductStats() {
  const all = getAll();
  return {
    total: all.length,
  };
}
