import { useCallback } from 'react';
import { CartItem } from '../useShoppingCart';

export const useCartQuantity = (
  items: CartItem[],
  maxQuantityPerItem: number,
  onUpdateQuantity: (itemId: string, quantity: number) => void
) =>
  useCallback(
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
