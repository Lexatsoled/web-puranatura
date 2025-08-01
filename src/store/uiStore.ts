import { create } from 'zustand';
import { ProductFilters } from '../types/product';

interface UIStore {
  isCartOpen: boolean;
  isMenuOpen: boolean;
  productFilters: ProductFilters;
  searchTerm: string;
  setIsCartOpen: (isOpen: boolean) => void;
  setIsMenuOpen: (isOpen: boolean) => void;
  setProductFilters: (filters: Partial<ProductFilters>) => void;
  setSearchTerm: (term: string) => void;
  resetFilters: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isCartOpen: false,
  isMenuOpen: false,
  productFilters: {},
  searchTerm: '',
  setIsCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
  setIsMenuOpen: (isOpen) => set({ isMenuOpen: isOpen }),
  setProductFilters: (filters) =>
    set((state) => ({
      productFilters: { ...state.productFilters, ...filters },
    })),
  setSearchTerm: (term) => set({ searchTerm: term }),
  resetFilters: () =>
    set({
      productFilters: {},
      searchTerm: '',
    }),
}));
