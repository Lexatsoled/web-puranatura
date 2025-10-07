import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { Product } from '../../types';
import { showSuccessNotification, showErrorNotification, showWarningNotification } from './notificationStore';
import { useCartNotificationStore } from './cartNotificationStore';

interface CartItem {
  product: Product;
  quantity: number;
}

interface Cart {
  items: CartItem[];
  total: number;
  count: number;
}

interface CartStore {
  cart: Cart;
  isOpen: boolean;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setCartOpen: (isOpen: boolean) => void;
  getItemQuantity: (productId: string) => number;
  hasItems: () => boolean;
}

export const useCartStore = create<CartStore>()(
  persist(
    immer((set, get) => ({
      cart: {
        items: [],
        total: 0,
        count: 0,
      },
      isOpen: false,

      addToCart: (product, quantity = 1) => {
        // Check stock availability
        if (product.stock <= 0) {
          showErrorNotification(`❌ Lo sentimos, ${product.name} está agotado`);
          return;
        }

        const currentQuantity = get().getItemQuantity(product.id);
        const newQuantity = currentQuantity + quantity;

        if (newQuantity > product.stock) {
          showWarningNotification(`⚠️ Solo hay ${product.stock} unidades disponibles de ${product.name}`);
          return;
        }

        set((state) => {
          const existingItem = state.cart.items.find(
            (item) => item.product.id === product.id
          );

          if (existingItem) {
            existingItem.quantity += quantity;
          } else {
            state.cart.items.push({ product, quantity });
          }

          // Recalculate totals
          state.cart.count = state.cart.items.reduce(
            (sum, item) => sum + item.quantity,
            0
          );
          state.cart.total = state.cart.items.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0
          );

          // Show cart notification - Piping Rock style
          const totalItems = state.cart.count;
          const totalValue = state.cart.total;
          
          // Use the cart notification store
          useCartNotificationStore.getState().showNotification(
            product.name,
            totalItems,
            totalValue
          );
        });
      },

      removeFromCart: (productId) => {
        const item = get().cart.items.find(item => item.product.id === productId);
        
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

          // Show enhanced notification with updated cart info
          if (item) {
            const remainingItems = state.cart.count;
            const remainingValue = state.cart.total;
            
            let message = `🗑️ ${item.product.name} eliminado del carrito`;
            
            if (remainingItems > 0) {
              message += `\n📦 Quedan: ${remainingItems} producto${remainingItems > 1 ? 's' : ''} • $${remainingValue.toFixed(2)}`;
              showSuccessNotification(message, 5000, {
                label: 'Ver carrito',
                onClick: () => get().setCartOpen(true)
              });
            } else {
              message += `\n🛒 Carrito vacío`;
              showSuccessNotification(message, 4000);
            }
          }
        });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }

        const item = get().cart.items.find(item => item.product.id === productId);
        if (item && quantity > item.product.stock) {
          showWarningNotification(`⚠️ Solo hay ${item.product.stock} unidades disponibles`);
          return;
        }

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
        });
      },

      clearCart: () => {
        const itemCount = get().cart.items.length;
        if (itemCount > 0) {
          showSuccessNotification(`🧹 Carrito vaciado (${itemCount} producto${itemCount > 1 ? 's' : ''} eliminado${itemCount > 1 ? 's' : ''})`);
        }
        
        set((state) => {
          state.cart = {
            items: [],
            total: 0,
            count: 0,
          };
        });
      },

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      setCartOpen: (isOpen) => set({ isOpen }),

      getItemQuantity: (productId) => {
        const item = get().cart.items.find(item => item.product.id === productId);
        return item ? item.quantity : 0;
      },

      hasItems: () => get().cart.items.length > 0,
    })),
    {
      name: 'pureza-naturalis-cart-storage',
      version: 2,
    }
  )
);
