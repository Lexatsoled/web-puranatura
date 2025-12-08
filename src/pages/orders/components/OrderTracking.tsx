import React from 'react';
import { Order } from '../types';

export const OrderTracking: React.FC<{ order: Order }> = ({ order }) => {
  if (!order.trackingNumber) return null;

  return (
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
            Entrega estimada: {order.estimatedDelivery.toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
};
