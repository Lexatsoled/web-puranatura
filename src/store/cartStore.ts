import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { Cart, CartItem, Product } from '../types/cart';

interface CartStore {
  cart: Cart;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    immer((set) => ({
      cart: {
        items: [],
        total: 0,
        count: 0,
      },
      addToCart: (product, quantity = 1) =>
        set((state) => {
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
      removeFromCart: (productId) =>
        set((state) => {
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
      updateQuantity: (productId, quantity) =>
        set((state) => {
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
        set((state) => {
          state.cart = {
            items: [],
            total: 0,
            count: 0,
          };
        }),
    })),
    {
      name: 'cart-storage',
    }
  )
);
