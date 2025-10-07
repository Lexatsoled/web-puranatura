import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../types/product';
import { showSuccessNotification, showErrorNotification } from './notificationStore';

interface WishlistStore {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  toggleItem: (product: Product) => void;
  getItemCount: () => number;
  hasItems: () => boolean;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        set((state) => {
          if (!state.items.find(item => item.id === product.id)) {
            showSuccessNotification(`${product.name} añadido a la lista de deseos`);
            return { items: [...state.items, product] };
          }
          showErrorNotification(`${product.name} ya está en tu lista de deseos`);
          return state;
        });
      },

      removeItem: (productId) => {
        const item = get().items.find(item => item.id === productId);
        if (item) {
          showSuccessNotification(`${item.name} eliminado de la lista de deseos`);
        }

        set((state) => ({
          items: state.items.filter(item => item.id !== productId)
        }));
      },

      isInWishlist: (productId) => {
        return get().items.some(item => item.id === productId);
      },

      toggleItem: (product) => {
        const isInList = get().isInWishlist(product.id);
        if (isInList) {
          get().removeItem(product.id);
        } else {
          get().addItem(product);
        }
      },

      clearWishlist: () => {
        const itemCount = get().items.length;
        if (itemCount > 0) {
          showSuccessNotification(`Lista de deseos vaciada (${itemCount} productos eliminados)`);
        }
        set({ items: [] });
      },

      getItemCount: () => get().items.length,

      hasItems: () => get().items.length > 0,
    }),
    {
      name: 'pureza-naturalis-wishlist-storage',
      version: 1,
    }
  )
);
