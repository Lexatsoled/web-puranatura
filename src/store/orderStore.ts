import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Order {
  id: string;
  date: Date;
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  estimatedDelivery?: Date;
}

interface OrderState {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  loadOrders: () => Promise<void>;
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  clearError: () => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, _get) => ({
      orders: [],
      isLoading: false,
      error: null,

      loadOrders: async () => {
        set({ isLoading: true, error: null });
        try {
          // Mock loading orders - replace with real API call
          const mockOrders: Order[] = [
            {
              id: 'PN-2025-001',
              date: new Date('2025-07-28'),
              items: [
                {
                  id: '1',
                  name: 'Aceite Esencial de Lavanda Orgánico',
                  price: 24.99,
                  quantity: 2,
                  image: '/api/placeholder/80/80',
                },
                {
                  id: '2',
                  name: 'Suplemento de Vitamina D3',
                  price: 18.5,
                  quantity: 1,
                  image: '/api/placeholder/80/80',
                },
              ],
              total: 68.48,
              status: 'delivered',
              trackingNumber: 'TN789123456',
              estimatedDelivery: new Date('2025-07-30'),
            },
            {
              id: 'PN-2025-002',
              date: new Date('2025-07-30'),
              items: [
                {
                  id: '3',
                  name: 'Infusión Detox Natural',
                  price: 15.99,
                  quantity: 3,
                  image: '/api/placeholder/80/80',
                },
              ],
              total: 47.97,
              status: 'shipped',
              trackingNumber: 'TN789123457',
              estimatedDelivery: new Date('2025-08-02'),
            },
          ];

          set({ orders: mockOrders, isLoading: false });
  } catch {
          set({
            error: 'Failed to load orders',
            isLoading: false
          });
        }
      },

      addOrder: (order: Order) => {
        set((state) => ({
          orders: [order, ...state.orders],
        }));
      },

      updateOrderStatus: (orderId: string, status: Order['status']) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId ? { ...order, status } : order
          ),
        }));
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'order-store',
      partialize: (state) => ({
        orders: state.orders,
      }),
    }
  )
);

export default useOrderStore;