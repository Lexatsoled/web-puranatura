import { Order, OrderStatus } from './types';

export const STATUS_STYLES: Record<
  OrderStatus,
  { color: string; label: string }
> = {
  pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pendiente' },
  processing: { color: 'bg-blue-100 text-blue-800', label: 'Procesando' },
  shipped: { color: 'bg-purple-100 text-purple-800', label: 'Enviado' },
  delivered: { color: 'bg-green-100 text-green-800', label: 'Entregado' },
  cancelled: { color: 'bg-red-100 text-red-800', label: 'Cancelado' },
};

export const sampleOrders: Order[] = [
  {
    id: 'PN-2025-001',
    date: new Date('2025-07-28'),
    items: [
      {
        id: '1',
        name: 'Aceite Esencial de Lavanda Organico',
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
        name: 'Infusion Detox Natural',
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
  {
    id: 'PN-2025-003',
    date: new Date('2025-08-01'),
    items: [
      {
        id: '4',
        name: 'Crema Hidratante de Aloe Vera',
        price: 32.0,
        quantity: 1,
        image: '/api/placeholder/80/80',
      },
      {
        id: '5',
        name: 'Complejo B Natural',
        price: 22.75,
        quantity: 2,
        image: '/api/placeholder/80/80',
      },
    ],
    total: 77.5,
    status: 'processing',
    estimatedDelivery: new Date('2025-08-05'),
  },
];
