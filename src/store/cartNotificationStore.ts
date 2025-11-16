import { create } from 'zustand';

interface CartNotificationState {
  isVisible: boolean;
  productName: string;
  totalItems: number;
  totalPrice: number;
  showNotification: (
    productName: string,
    totalItems: number,
    totalPrice: number
  ) => void;
  hideNotification: () => void;
}

export const useCartNotificationStore = create<CartNotificationState>(
  (set) => ({
    isVisible: false,
    productName: '',
    totalItems: 0,
    totalPrice: 0,

    showNotification: (productName, totalItems, totalPrice) => {
      set({
        isVisible: true,
        productName,
        totalItems,
        totalPrice,
      });

      // Auto hide after 5 seconds
      setTimeout(() => {
        set({ isVisible: false });
      }, 5000);
    },

    hideNotification: () => {
      set({ isVisible: false });
    },
  })
);
