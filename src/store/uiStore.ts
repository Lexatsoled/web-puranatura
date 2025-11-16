import { create } from 'zustand';
import { SortOption } from '../types/product';

/**
 * Store: UIStore (Zustand)
 * Propósito: Gestionar estado de interfaz de la tienda (paneles, filtros,
 *            paginación, modo de vista) desacoplado de los datos.
 * Estructura:
 *  - productFilters: filtros cohesivos aplicados a listados
 *  - banderas de UI: apertura de carrito/menú/filtros
 *  - paginación y preferencia de vista (grid/list)
 * Acciones: helpers para alternar categorías, rango de precios, stock, etc.
 */

export interface ExtendedProductFilters {
  categories: string[];
  priceRange: [number, number];
  sortBy: SortOption;
  searchTerm: string;
  inStock: boolean;
  onSale: boolean;
  tags: string[];
  rating?: number;
}

interface UIStore {
  isCartOpen: boolean;
  isMenuOpen: boolean;
  isFilterOpen: boolean;
  productFilters: ExtendedProductFilters;
  searchTerm: string;
  currentPage: number;
  itemsPerPage: number;
  viewMode: 'grid' | 'list';

  // Actions
  setIsCartOpen: (isOpen: boolean) => void;
  setIsMenuOpen: (isOpen: boolean) => void;
  setIsFilterOpen: (isOpen: boolean) => void;
  setProductFilters: (filters: Partial<ExtendedProductFilters>) => void;
  setSearchTerm: (term: string) => void;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (count: number) => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  resetFilters: () => void;

  // Filter helpers
  toggleCategory: (category: string) => void;
  setPriceRange: (range: [number, number]) => void;
  setSortBy: (sortBy: SortOption) => void;
  toggleInStock: () => void;
  toggleOnSale: () => void;
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
}

const defaultFilters: ExtendedProductFilters = {
  categories: [],
  priceRange: [0, 10000],
  sortBy: 'default',
  searchTerm: '',
  inStock: false,
  onSale: false,
  tags: [],
};

export const useUIStore = create<UIStore>((set, get) => ({
  isCartOpen: false,
  isMenuOpen: false,
  isFilterOpen: false,
  productFilters: defaultFilters,
  searchTerm: '',
  currentPage: 1,
  itemsPerPage: 12,
  viewMode: 'grid',

  setIsCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
  setIsMenuOpen: (isOpen) => set({ isMenuOpen: isOpen }),
  setIsFilterOpen: (isOpen) => set({ isFilterOpen: isOpen }),

  setProductFilters: (filters) =>
    set((state) => ({
      productFilters: { ...state.productFilters, ...filters },
      currentPage: 1, // Reset page when filters change
    })),

  setSearchTerm: (term) =>
    set({
      searchTerm: term,
      productFilters: { ...get().productFilters, searchTerm: term },
      currentPage: 1,
    }),

  setCurrentPage: (page) => set({ currentPage: page }),
  setItemsPerPage: (count) => set({ itemsPerPage: count, currentPage: 1 }),
  setViewMode: (mode) => set({ viewMode: mode }),

  resetFilters: () =>
    set({
      productFilters: defaultFilters,
      searchTerm: '',
      currentPage: 1,
    }),

  // Filter helpers
  toggleCategory: (category) =>
    set((state) => {
      const categories = state.productFilters.categories.includes(category)
        ? state.productFilters.categories.filter((c) => c !== category)
        : [...state.productFilters.categories, category];

      return {
        productFilters: { ...state.productFilters, categories },
        currentPage: 1,
      };
    }),

  setPriceRange: (range) =>
    set((state) => ({
      productFilters: { ...state.productFilters, priceRange: range },
      currentPage: 1,
    })),

  setSortBy: (sortBy) =>
    set((state) => ({
      productFilters: { ...state.productFilters, sortBy },
      currentPage: 1,
    })),

  toggleInStock: () =>
    set((state) => ({
      productFilters: {
        ...state.productFilters,
        inStock: !state.productFilters.inStock,
      },
      currentPage: 1,
    })),

  toggleOnSale: () =>
    set((state) => ({
      productFilters: {
        ...state.productFilters,
        onSale: !state.productFilters.onSale,
      },
      currentPage: 1,
    })),

  addTag: (tag) =>
    set((state) => {
      if (!state.productFilters.tags.includes(tag)) {
        return {
          productFilters: {
            ...state.productFilters,
            tags: [...state.productFilters.tags, tag],
          },
          currentPage: 1,
        };
      }
      return state;
    }),

  removeTag: (tag) =>
    set((state) => ({
      productFilters: {
        ...state.productFilters,
        tags: state.productFilters.tags.filter((t) => t !== tag),
      },
      currentPage: 1,
    })),
}));
