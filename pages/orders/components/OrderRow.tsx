import React from 'react';
// Use CSS-only transitions for order rows (no framer-motion)
import { Order } from '../types';
import { formatCurrency } from '../../../src/utils/intl';
import { OrderStatusBadge } from './OrderStatusBadge';
import { OrderTracking } from './OrderTracking';
import { OrderProducts } from './OrderProducts';

type Props = {
  order: Order;
  selected: boolean;
  onToggle: () => void;
};

export const OrderRow: React.FC<Props> = ({ order, selected, onToggle }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-transform duration-150">
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
          <OrderStatusBadge status={order.status} />
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold text-gray-900">
            {formatCurrency(order.total)}
          </p>
          <button
            onClick={onToggle}
            className="text-green-600 hover:text-green-700 text-sm font-medium"
          >
            {selected ? 'Ocultar detalles' : 'Ver detalles'}
          </button>
        </div>
      </div>
    </div>

    <OrderTracking order={order} />

    {selected && (
      <div className="px-6 py-4 transition-all duration-150">
        <OrderProducts order={order} />
        <div className="mt-6 flex space-x-3 flex-wrap">
          {order.status === 'delivered' && (
            <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm">
              Comprar de nuevo
            </button>
          )}
          {order.status === 'shipped' && (
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm">
              Rastrear envio
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
      </div>
    )}
  </div>
);
