import { useCallback } from 'react';
import { CartItem } from './useShoppingCart';

export const useCartItemState = ({
  item,
  maxQuantityPerItem,
  handleQuantityChange,
  handleVariantChange,
}: {
  item: CartItem;
  maxQuantityPerItem: number;
  handleQuantityChange: (itemId: string, quantity: number) => void;
  handleVariantChange: (itemId: string, variantId: string) => void;
}) => {
  const increment = useCallback(
    () => handleQuantityChange(item.id, item.quantity + 1),
    [handleQuantityChange, item.id, item.quantity]
  );

  const decrement = useCallback(
    () => handleQuantityChange(item.id, item.quantity - 1),
    [handleQuantityChange, item.id, item.quantity]
  );

  const selectVariant = useCallback(
    (variantId: string) => handleVariantChange(item.id, variantId),
    [handleVariantChange, item.id]
  );

  const isMaxReached =
    item.quantity >= (item.maxQuantity || maxQuantityPerItem);

  return {
    increment,
    decrement,
    selectVariant,
    isMaxReached,
  };
};
