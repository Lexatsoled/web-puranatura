// Use plain rendering and CSS for cart item listing (no framer-motion)
import { CartItem } from '../../hooks/useShoppingCart';
import { CartItemRow } from './CartItemRow';

// removal of framer-motion variants — CSS handles layout/appearance

export const CartItemsList = ({
  items,
  currencySymbol,
  maxQuantityPerItem,
  handleQuantityChange,
  handleVariantChange,
  onRemoveItem,
}: {
  items: CartItem[];
  currencySymbol: string;
  maxQuantityPerItem: number;
  handleQuantityChange: (itemId: string, quantity: number) => void;
  handleVariantChange: (itemId: string, variantId: string) => void;
  onRemoveItem: (itemId: string) => void;
}) => (
  <div className="divide-y divide-gray-200">
    {items.map((item) => (
      <CartItemRow
        key={item.id}
        item={item}
        currencySymbol={currencySymbol}
        maxQuantityPerItem={maxQuantityPerItem}
        handleQuantityChange={handleQuantityChange}
        handleVariantChange={handleVariantChange}
        onRemoveItem={onRemoveItem}
      />
    ))}
  </div>
);
