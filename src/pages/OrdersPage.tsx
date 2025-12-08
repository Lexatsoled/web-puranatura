import React, { useMemo, useState } from 'react';
// prefer CSS transitions for lightweight page animations
import { useAuthStore } from '../store/authStore';
import { sampleOrders } from './orders/constants';
import { Order } from './orders/types';
import { OrderRow } from './orders/components/OrderRow';

const OrdersPage: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore((state) => ({
    user: state.user,
    isAuthenticated: state.isAuthenticated,
  }));
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const hasOrders = useMemo(() => sampleOrders.length > 0, []);

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Acceso Denegado
          </h2>
          <p className="text-gray-600">
            Debes iniciar sesion para ver tus pedidos.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Pedidos</h1>
          <p className="text-gray-600">
            Revisa el estado de tus pedidos y el historial de compras
          </p>
        </div>

        {!hasOrders ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center transition-opacity duration-300 transform">
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
              No tienes pedidos aun
            </h3>
            <p className="text-gray-600 mb-6">
              Cuando realices tu primera compra, aparecera aqui.
            </p>
            <button className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors">
              Explorar Productos
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {sampleOrders.map((order) => (
              <OrderRow
                key={order.id}
                order={order}
                selected={selectedOrder?.id === order.id}
                onToggle={() =>
                  setSelectedOrder(
                    selectedOrder?.id === order.id ? null : order
                  )
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
