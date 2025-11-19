import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

interface Order {
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

const OrdersPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Datos de ejemplo de pedidos
  const sampleOrders: Order[] = [
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

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Acceso Denegado
          </h2>
          <p className="text-gray-600">
            Debes iniciar sesión para ver tus pedidos.
          </p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'processing':
        return 'Procesando';
      case 'shipped':
        return 'Enviado';
      case 'delivered':
        return 'Entregado';
      case 'cancelled':
        return 'Cancelado';
      default:
        return 'Desconocido';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Pedidos</h1>
          <p className="text-gray-600">
            Revisa el estado de tus pedidos y el historial de compras
          </p>
        </div>

        {sampleOrders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center"
          >
            <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No tienes pedidos aún
            </h3>
            <p className="text-gray-600 mb-6">
              Cuando realices tu primera compra, aparecerá aquí.
            </p>
            <button className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors">
              Explorar Productos
            </button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {sampleOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                {/* Header del pedido */}
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Pedido #{order.id}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Realizado el {order.date.toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}
                      >
                        {getStatusText(order.status)}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">
                        €{order.total.toFixed(2)}
                      </p>
                      <button
                        onClick={() =>
                          setSelectedOrder(
                            selectedOrder?.id === order.id ? null : order
                          )
                        }
                        className="text-green-600 hover:text-green-700 text-sm font-medium"
                      >
                        {selectedOrder?.id === order.id
                          ? 'Ocultar detalles'
                          : 'Ver detalles'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Información de seguimiento */}
                {order.trackingNumber && (
                  <div className="px-6 py-3 bg-blue-50 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <svg
                          className="w-5 h-5 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                          />
                        </svg>
                        <span className="text-sm text-blue-800">
                          <strong>Seguimiento:</strong> {order.trackingNumber}
                        </span>
                      </div>
                      {order.estimatedDelivery && (
                        <span className="text-sm text-blue-600">
                          Entrega estimada:{' '}
                          {order.estimatedDelivery.toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Detalles del pedido (expandible) */}
                {selectedOrder?.id === order.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-6 py-4"
                  >
                    <h4 className="text-md font-medium text-gray-900 mb-4">
                      Productos ({order.items.length})
                    </h4>
                    <div className="space-y-3">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                            <span className="text-2xl">🌿</span>
                          </div>
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900">
                              {item.name}
                            </h5>
                            <p className="text-sm text-gray-600">
                              Cantidad: {item.quantity} × €
                              {item.price.toFixed(2)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">
                              €{(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Acciones del pedido */}
                    <div className="mt-6 flex space-x-3">
                      {order.status === 'delivered' && (
                        <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm">
                          Comprar de nuevo
                        </button>
                      )}
                      {order.status === 'shipped' && (
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm">
                          Rastrear envío
                        </button>
                      )}
                      {order.status === 'pending' && (
                        <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors text-sm">
                          Cancelar pedido
                        </button>
                      )}
                      <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors text-sm">
                        Descargar factura
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
