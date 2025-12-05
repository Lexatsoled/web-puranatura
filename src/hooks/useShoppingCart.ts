import { useCartQuantity } from './cart/useCartQuantity';
import { useCartTotals } from './cart/useCartTotals';
import { useCartVariants } from './cart/useCartVariants';
import { UseShoppingCartOptions } from './cart/types';

export * from './cart/types';

export function useShoppingCart({
  items,
  taxRate = 0,
  shippingCost = 0,
  maxQuantityPerItem = 99,
  onUpdateQuantity,
  onUpdateVariant,
}: UseShoppingCartOptions) {
  const totals = useCartTotals(items, taxRate, shippingCost);

  const handleQuantityChange = useCartQuantity(
    items,
    maxQuantityPerItem,
    onUpdateQuantity
  );

  const handleVariantChange = useCartVariants(onUpdateVariant);

  return {
    ...totals,
    handleQuantityChange,
    handleVariantChange,
  };
}

export default useShoppingCart;
