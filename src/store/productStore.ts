import { create } from 'zustand';
import { productApi } from '@/services/productApi';
import type { Product } from '@/types/product';

const CACHE_TTL = 30 * 1000;

type PaginationState = {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
};

type ProductListCacheEntry = {
  items: Product[];
  pagination: PaginationState;
  timestamp: number;
};

type ProductCacheEntry = {
  product: Product;
  timestamp: number;
};

type ProductStoreState = {
  products: Product[];
  featured: Product[];
  loading: boolean;
  error: string | null;
  pagination: PaginationState;
  listCache: Record<string, ProductListCacheEntry>;
  productCache: Record<string, ProductCacheEntry>;
  featuredTimestamp: number | null;
  fetchingKeys: Set<string>; // Track in-flight requests
  fetchProducts: (params?: {
    category?: string;
    search?: string;
    featured?: boolean;
    page?: number;
    limit?: number;
  }) => Promise<Product[]>;
  fetchProductById: (id: string, force?: boolean) => Promise<Product | null>;
  fetchFeatured: (force?: boolean) => Promise<Product[]>;
  searchProducts: (query: string, limit?: number) => Promise<Product[]>;
  clearCache: () => void;
};

const initialPagination: PaginationState = {
  page: 1,
  totalPages: 1,
  total: 0,
  limit: 20,
};

const buildListKey = (params: Record<string, unknown>) =>
  JSON.stringify(
    Object.keys(params)
      .sort()
      .reduce<Record<string, unknown>>((acc, key) => {
        acc[key] = params[key];
        return acc;
      }, {})
  );

export const useProductStore = create<ProductStoreState>((set, get) => ({
  products: [],
  featured: [],
  loading: false,
  error: null,
  pagination: initialPagination,
  listCache: {},
  productCache: {},
  featuredTimestamp: null,
  fetchingKeys: new Set<string>(),

  async fetchProducts(params = {}) {
    const key = buildListKey(params);
    const requestedPage =
      typeof params.page === 'number' && params.page > 0 ? params.page : 1;
    const cacheEntry = get().listCache[key];
    const now = Date.now();

    // Return cached data if available
    if (requestedPage === 1 && cacheEntry && now - cacheEntry.timestamp < CACHE_TTL) {
      set({
        products: cacheEntry.items,
        pagination: cacheEntry.pagination,
        error: null,
      });
      return cacheEntry.items;
    }

    // Prevent duplicate concurrent requests for the same key
    const { fetchingKeys } = get();
    if (fetchingKeys.has(key)) {
      // Silent deduplication - this is working as expected
      return get().products; // Return current products while fetching
    }

    // Mark this key as being fetched
    set((state) => {
      const nextKeys = new Set(state.fetchingKeys);
      nextKeys.add(key);
      return { fetchingKeys: nextKeys, loading: true, error: null };
    });

    try {
      // Detectar si es búsqueda por sistema (categoría que empieza con "sistema-")
      let response;
      if (params.category && typeof params.category === 'string' && params.category.startsWith('sistema-')) {
        const systemId = params.category.replace('sistema-', '');
        response = await productApi.fetchBySystem({
          systemId,
          search: params.search,
          featured: params.featured,
          page: params.page,
          limit: params.limit,
        });
      } else {
        response = await productApi.fetchProducts(params);
      }

      const { items, page, limit, total, totalPages } = response;
      const pagination: PaginationState = { page, limit, total, totalPages };
      const shouldAppend = requestedPage > 1;

      set((state) => {
        const nextProducts = shouldAppend
          ? [
              ...state.products,
              ...items.filter(
                (incoming) => !state.products.some((existing) => existing.id === incoming.id)
              ),
            ]
          : items;

        const nextState: Partial<ProductStoreState> = {
          products: nextProducts,
          pagination,
          loading: false,
          error: null,
        };

        if (!shouldAppend) {
          nextState.listCache = {
            ...state.listCache,
            [key]: {
              items,
              pagination,
              timestamp: now,
            },
          };
        }

        return nextState;
      });

      // hydrate product cache
      set((state) => {
        const nextCache = { ...state.productCache };
        items.forEach((product) => {
          nextCache[product.id] = {
            product,
            timestamp: now,
          };
        });
        return { productCache: nextCache };
      });

      return items;
    } catch (error) {
      set({ loading: false, error: error instanceof Error ? error.message : 'Error al cargar productos' });
      throw error;
    } finally {
      // Always remove the key from fetchingKeys when done
      set((state) => {
        const nextKeys = new Set(state.fetchingKeys);
        nextKeys.delete(key);
        return { fetchingKeys: nextKeys };
      });
    }
  },

  async fetchProductById(id, force = false) {
    const cacheEntry = get().productCache[id];
    const now = Date.now();
    if (!force && cacheEntry && now - cacheEntry.timestamp < CACHE_TTL) {
      return cacheEntry.product;
    }

    set({ loading: true, error: null });
    try {
      const product = await productApi.fetchProductById(id);
      set((state) => ({
        loading: false,
        productCache: {
          ...state.productCache,
          [id]: {
            product,
            timestamp: now,
          },
        },
      }));
      return product;
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Error al cargar el producto',
      });
      return null;
    }
  },

  async fetchFeatured(force = false) {
    const now = Date.now();
    const { featured, featuredTimestamp } = get();

    if (!force && featured.length > 0 && featuredTimestamp && now - featuredTimestamp < CACHE_TTL) {
      return featured;
    }

    set({ loading: true, error: null });
    try {
      const products = await productApi.fetchFeatured();
      set({
        featured: products,
        featuredTimestamp: now,
        loading: false,
        error: null,
      });
      return products;
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Error al cargar productos destacados',
      });
      throw error;
    }
  },

  async searchProducts(query, limit) {
    try {
      const products = await productApi.search(query, limit);
      // hydrate cache for quick detail access
      const now = Date.now();
      set((state) => {
        const nextCache = { ...state.productCache };
        products.forEach((product) => {
          nextCache[product.id] = {
            product,
            timestamp: now,
          };
        });
        return { productCache: nextCache };
      });
      return products;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error al buscar productos',
      });
      throw error;
    }
  },

  clearCache() {
    set({
      listCache: {},
      productCache: {},
      featuredTimestamp: null,
    });
  },
}));

export type ProductStore = typeof useProductStore;
