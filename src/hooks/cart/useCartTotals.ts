import { useMemo } from 'react';
import { CartItem } from '../useShoppingCart';

export const useCartTotals = (
  items: CartItem[],
  taxRate: number,
  shippingCost: number
) =>
  useMemo(() => {
    const subtotal = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    const discount = items.reduce(
      (acc, item) => acc + (item.discount || 0) * item.quantity,
      0
    );
    const taxableAmount = subtotal - discount;
    const tax = taxableAmount * taxRate;
    const total = taxableAmount + tax + shippingCost;
    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
    const totalWeight = items.reduce(
      (acc, item) => acc + (item.weight || 0) * item.quantity,
      0
    );

    return { subtotal, discount, tax, total, totalItems, totalWeight };
  }, [items, shippingCost, taxRate]);
