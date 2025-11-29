import { useMemo, useCallback } from 'react';

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

  const { subtotal, discount, tax, total, totalItems, totalWeight } =
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
    }, [items, taxRate, shippingCost]);

  const handleQuantityChange = useCallback(
    (itemId: string, newQuantity: number) => {
      const item = items.find((i) => i.id === itemId);
      if (!item) return;

      const validQuantity = Math.min(
        Math.max(1, newQuantity),
        item.maxQuantity || maxQuantityPerItem
      );
      onUpdateQuantity(itemId, validQuantity);
    },
    [items, maxQuantityPerItem, onUpdateQuantity]
  );

  const handleVariantChange = useCallback(
    (itemId: string, variantId: string) => {
      onUpdateVariant?.(itemId, variantId);
    },
    [onUpdateVariant]
  );

  return {
    subtotal,
    discount,
    tax,
    total,
    totalItems,
    totalWeight,
    handleQuantityChange,
    handleVariantChange,
  };
}

export default useShoppingCart;
