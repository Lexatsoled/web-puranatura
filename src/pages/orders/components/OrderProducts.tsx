import React from 'react';
import { Order } from '../types';
import { formatCurrency } from '../../../utils/intl';

export const OrderProducts: React.FC<{ order: Order }> = ({ order }) => (
  <div>
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
            <span className="text-2xl"></span>
          </div>
          <div className="flex-1">
            <h5 className="font-medium text-gray-900">{item.name}</h5>
            <p className="text-sm text-gray-600">
              Cantidad: {item.quantity} {formatCurrency(item.price)}
            </p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-gray-900">
              {formatCurrency(item.price * item.quantity)}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
);
