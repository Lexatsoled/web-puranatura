import React from 'react';
import { OrderStatus } from '../types';
import { STATUS_STYLES } from '../constants';

export const OrderStatusBadge: React.FC<{ status: OrderStatus }> = ({
  status,
}) => {
  const meta = STATUS_STYLES[status] || STATUS_STYLES.pending;
  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${meta.color}`}
    >
      {meta.label}
    </span>
  );
};
