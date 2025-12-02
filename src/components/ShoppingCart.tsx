import React from 'react';
import useShoppingCart, { CartItem } from '../hooks/useShoppingCart';
import { CartEmptyState } from './cart/CartEmptyState';
import { CartItemsList } from './cart/CartItemsList';
import { CartSummary } from './cart/CartSummary';

interface ShoppingCartProps {
  items: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onUpdateVariant?: (itemId: string, variantId: string) => void;
  onCheckout?: () => void;
  isLoading?: boolean;
  currencySymbol?: string;
  shippingCost?: number;
  taxRate?: number;
  discountCode?: string;
  maxQuantityPerItem?: number;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onUpdateVariant,
  onCheckout,
  isLoading = false,
  currencySymbol = 'DOP ',
  shippingCost = 0,
  taxRate = 0,
  maxQuantityPerItem = 99,
}) => {
  const {
    subtotal,
    discount,
    tax,
    total,
    totalItems,
    handleQuantityChange,
    handleVariantChange,
  } = useShoppingCart({
    items,
    taxRate,
    shippingCost,
    maxQuantityPerItem,
    onUpdateQuantity,
    onUpdateVariant,
  });

  const summary = {
    currencySymbol,
    subtotal,
    discount,
    shippingCost,
    tax,
    taxRate,
    total,
    totalItems,
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Carrito de Compra
      </h2>

      {items.length === 0 ? (
        <CartEmptyState />
      ) : (
        <>
          <CartItemsList
            items={items}
            currencySymbol={currencySymbol}
            maxQuantityPerItem={maxQuantityPerItem}
            handleQuantityChange={handleQuantityChange}
            handleVariantChange={handleVariantChange}
            onRemoveItem={onRemoveItem}
          />
          <CartSummary
            summary={summary}
            onCheckout={onCheckout}
            isLoading={isLoading}
            currencySymbol={currencySymbol}
          />
        </>
      )}
    </div>
  );
};

export default ShoppingCart;
