import { useApi } from '../utils/api';
import { Order } from '../pages/orders/types'; // Or wherever the Order type is defined in frontend

// Define the payload structure expected by the backend
interface CreateOrderPayload {
  items: {
    productId: string;
    quantity: number;
  }[];
}

export const useOrdersService = () => {
  const api = useApi();

  return {
    getMyOrders: () => api.get<Order[]>('/orders'),

    createOrder: (items: CreateOrderPayload['items']) =>
      api.post<Order>('/orders', { items }),

    getOrderById: (orderId: string) => api.get<Order>(`/orders/${orderId}`),
  };
};
