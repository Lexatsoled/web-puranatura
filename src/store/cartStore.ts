import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { Cart } from '../types/cart';
import { Product } from '../types/product';

interface CartStore {
  cart: Cart;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const createCartStore = () =>
  immer((set) => ({
    cart: {
      items: [],
      total: 0,
      count: 0,
    },
    addToCart: (product: Product, quantity = 1) =>
      set((state: CartStore) => {
        const existingItem = state.cart.items.find(
          (item) => item.product.id === product.id
        );

        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          state.cart.items.push({ product, quantity });
        }

        state.cart.count = state.cart.items.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        state.cart.total = state.cart.items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        );
      }),
    removeFromCart: (productId: string) =>
      set((state: CartStore) => {
        state.cart.items = state.cart.items.filter(
          (item) => item.product.id !== productId
        );
        state.cart.count = state.cart.items.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        state.cart.total = state.cart.items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        );
      }),
    updateQuantity: (productId: string, quantity: number) =>
      set((state: CartStore) => {
        const item = state.cart.items.find(
          (item) => item.product.id === productId
        );
        if (item) {
          item.quantity = quantity;
          state.cart.count = state.cart.items.reduce(
            (sum, item) => sum + item.quantity,
            0
          );
          state.cart.total = state.cart.items.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0
          );
        }
      }),
    clearCart: () =>
      set((state: CartStore) => {
        state.cart = {
          items: [],
          total: 0,
          count: 0,
        };
      }),
  }));

const storeInitializer =
  process.env.NODE_ENV === 'test'
    ? createCartStore()
    : (persist(createCartStore(), {
        name: 'cart-storage',
        // use getStorage so we can lazily access localStorage when it's available
        getStorage: () => {
          try {
            if (typeof window !== 'undefined' && window.localStorage) {
              return window.localStorage;
            }
          } catch {
            // ignore
          }

          // fallback to a no-op storage to avoid errors in test/node environments
          return {
            getItem: (_: string) => null,
            setItem: (_: string, __: string) => undefined,
            removeItem: (_: string) => undefined,
            clear: () => undefined,
          } as unknown as Storage;
        },
      } as any) as any);

export const useCartStore = create<CartStore>()(storeInitializer as any);
