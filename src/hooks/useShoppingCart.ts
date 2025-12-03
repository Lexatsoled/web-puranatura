import { useCallback } from 'react';
import { useCartTotals } from './cart/useCartTotals';
import { useCartQuantity } from './cart/useCartQuantity';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  maxQuantity?: number;
  discount?: number;
  weight?: number;
  variants?: {
    id: string;
    name: string;
    price?: number;
  }[];
  selectedVariantId?: string;
};

export function useShoppingCart(opts: {
  items: CartItem[];
  taxRate?: number;
  shippingCost?: number;
  maxQuantityPerItem?: number;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onUpdateVariant?: (itemId: string, variantId: string) => void;
}) {
  const {
    items,
    taxRate = 0,
    shippingCost = 0,
    maxQuantityPerItem = 99,
    onUpdateQuantity,
    onUpdateVariant,
  } = opts;

  const totals = useCartTotals(items, taxRate, shippingCost);

  const handleQuantityChange = useCartQuantity(
    items,
    maxQuantityPerItem,
    onUpdateQuantity
  );

  const handleVariantChange = useCallback(
    (itemId: string, variantId: string) => {
      onUpdateVariant?.(itemId, variantId);
    },
    [onUpdateVariant]
  );

  return {
    subtotal: totals.subtotal,
    discount: totals.discount,
    tax: totals.tax,
    total: totals.total,
    totalItems: totals.totalItems,
    totalWeight: totals.totalWeight,
    handleQuantityChange,
    handleVariantChange,
  };
}

export default useShoppingCart;
