import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OptimizedImage } from './OptimizedImage';
import useShoppingCart, { CartItem } from '../hooks/useShoppingCart';

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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, x: -20 },
};

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
            containerVariants={containerVariants}
            itemVariants={itemVariants}
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

const CartEmptyState = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="text-center py-12"
  >
    <svg
      className="mx-auto h-12 w-12 text-gray-400 mb-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1}
        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
      />
    </svg>
    <p className="text-gray-600 mb-4">Tu carrito está vacío</p>
    <button className="text-green-600 hover:text-green-700 font-medium">
      Continuar comprando
    </button>
  </motion.div>
);

const CartItemsList = ({
  items,
  containerVariants,
  itemVariants,
  currencySymbol,
  maxQuantityPerItem,
  handleQuantityChange,
  handleVariantChange,
  onRemoveItem,
}: {
  items: CartItem[];
  containerVariants: typeof containerVariants;
  itemVariants: typeof itemVariants;
  currencySymbol: string;
  maxQuantityPerItem: number;
  handleQuantityChange: (itemId: string, quantity: number) => void;
  handleVariantChange: (itemId: string, variantId: string) => void;
  onRemoveItem: (itemId: string) => void;
}) => (
  <motion.div
    variants={containerVariants}
    initial="hidden"
    animate="visible"
    className="divide-y divide-gray-200"
  >
    <AnimatePresence>
      {items.map((item) => (
        <CartItemRow
          key={item.id}
          item={item}
          itemVariants={itemVariants}
          currencySymbol={currencySymbol}
          maxQuantityPerItem={maxQuantityPerItem}
          handleQuantityChange={handleQuantityChange}
          handleVariantChange={handleVariantChange}
          onRemoveItem={onRemoveItem}
        />
      ))}
    </AnimatePresence>
  </motion.div>
);

const CartItemRow = ({
  item,
  itemVariants,
  currencySymbol,
  maxQuantityPerItem,
  handleQuantityChange,
  handleVariantChange,
  onRemoveItem,
}: {
  item: CartItem;
  itemVariants: typeof itemVariants;
  currencySymbol: string;
  maxQuantityPerItem: number;
  handleQuantityChange: (itemId: string, quantity: number) => void;
  handleVariantChange: (itemId: string, variantId: string) => void;
  onRemoveItem: (itemId: string) => void;
}) => (
  <motion.div
    variants={itemVariants}
    exit="exit"
    className="py-6 flex items-center"
  >
    <ProductImageCell item={item} />
    <div className="ml-6 flex-1">
      <div className="flex justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-800">{item.name}</h3>
          {item.variants && item.variants.length > 0 && (
            <VariantSelect
              item={item}
              currencySymbol={currencySymbol}
              handleVariantChange={handleVariantChange}
            />
          )}
        </div>
        <PriceBlock item={item} currencySymbol={currencySymbol} />
      </div>
      <CartQuantityControl
        item={item}
        maxQuantityPerItem={maxQuantityPerItem}
        handleQuantityChange={handleQuantityChange}
        onRemoveItem={onRemoveItem}
      />
    </div>
  </motion.div>
);

const ProductImageCell = ({ item }: { item: CartItem }) => (
  <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden">
    {item.image ? (
      <OptimizedImage
        src={item.image}
        alt={item.name}
        className="w-full h-full object-cover"
        aspectRatio={1}
      />
    ) : (
      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
        <svg
          className="w-8 h-8 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    )}
  </div>
);

const VariantSelect = ({
  item,
  currencySymbol,
  handleVariantChange,
}: {
  item: CartItem;
  currencySymbol: string;
  handleVariantChange: (itemId: string, variantId: string) => void;
}) => (
  <select
    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
    value={item.selectedVariantId}
    onChange={(e) => handleVariantChange(item.id, e.target.value)}
  >
    {item.variants?.map((variant) => (
      <option key={variant.id} value={variant.id}>
        {variant.name}
        {variant.price && ` (+${currencySymbol}${variant.price.toFixed(2)})`}
      </option>
    ))}
  </select>
);

const PriceBlock = ({
  item,
  currencySymbol,
}: {
  item: CartItem;
  currencySymbol: string;
}) => (
  <div className="text-right">
    <p className="text-lg font-medium text-gray-900">
      {currencySymbol}
      {(item.price * item.quantity).toFixed(2)}
    </p>
    {item.discount && (
      <p className="text-sm text-green-600">
        Ahorro: {currencySymbol}
        {(item.discount * item.quantity).toFixed(2)}
      </p>
    )}
  </div>
);

const CartQuantityControl = ({
  item,
  maxQuantityPerItem,
  handleQuantityChange,
  onRemoveItem,
}: {
  item: CartItem;
  maxQuantityPerItem: number;
  handleQuantityChange: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
}) => (
  <div className="mt-4 flex items-center justify-between">
    <div className="flex items-center space-x-3">
      <QuantityButton
        disabled={item.quantity <= 1}
        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
      >
        <span className="sr-only">Reducir cantidad</span>
        <svg
          className="w-6 h-6 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 12H4"
          />
        </svg>
      </QuantityButton>
      <span className="text-gray-600 select-none w-8 text-center">
        {item.quantity}
      </span>
      <QuantityButton
        disabled={item.quantity >= (item.maxQuantity || maxQuantityPerItem)}
        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
      >
        <span className="sr-only">Incrementar cantidad</span>
        <svg
          className="w-6 h-6 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      </QuantityButton>
    </div>
    <button
      className="text-red-600 hover:text-red-700"
      onClick={() => onRemoveItem(item.id)}
    >
      Eliminar
    </button>
  </div>
);

const QuantityButton = ({
  disabled,
  onClick,
  children,
}: {
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    className="p-1 rounded-full hover:bg-gray-100"
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);

const CartSummary = ({
  summary,
  onCheckout,
  isLoading,
  currencySymbol,
}: {
  summary: {
    currencySymbol: string;
    subtotal: number;
    discount: number;
    shippingCost: number;
    tax: number;
    taxRate: number;
    total: number;
    totalItems: number;
  };
  onCheckout?: () => void;
  isLoading: boolean;
  currencySymbol: string;
}) => (
  <div className="mt-8 border-t border-gray-200 pt-8">
    <div className="space-y-4">
      <SummaryRow
        label={`Subtotal (${summary.totalItems} productos)`}
        value={summary.subtotal}
        currencySymbol={currencySymbol}
      />
      {summary.discount > 0 && (
        <SummaryRow
          label="Descuento"
          value={-summary.discount}
          prefix="-"
          currencySymbol={currencySymbol}
          className="text-green-600"
        />
      )}
      {summary.shippingCost > 0 && (
        <SummaryRow
          label="Envío"
          value={summary.shippingCost}
          currencySymbol={currencySymbol}
        />
      )}
      {summary.tax > 0 && (
        <SummaryRow
          label={`IVA (${(summary.taxRate * 100).toFixed(0)}%)`}
          value={summary.tax}
          currencySymbol={currencySymbol}
        />
      )}
      <div className="flex justify-between text-lg font-bold text-gray-900">
        <span>Total</span>
        <span>
          {currencySymbol}
          {summary.total.toFixed(2)}
        </span>
      </div>
    </div>
    <CheckoutButton onCheckout={onCheckout} isLoading={isLoading} />
  </div>
);

const SummaryRow = ({
  label,
  value,
  prefix = '',
  currencySymbol,
  className = 'text-gray-600',
}: {
  label: string;
  value: number;
  prefix?: string;
  currencySymbol: string;
  className?: string;
}) => (
  <div className={`flex justify-between ${className}`}>
    <span>{label}</span>
    <span>
      {prefix}
      {currencySymbol}
      {Math.abs(value).toFixed(2)}
    </span>
  </div>
);

const CheckoutButton = ({
  isLoading,
  onCheckout,
}: {
  isLoading: boolean;
  onCheckout?: () => void;
}) => (
  <button
    className={`w-full mt-8 px-6 py-3 rounded-lg font-semibold text-white ${
      isLoading
        ? 'bg-gray-400 cursor-not-allowed'
        : 'bg-green-600 hover:bg-green-700'
    } transition-colors`}
    onClick={onCheckout}
    disabled={isLoading}
  >
    {isLoading ? (
      <span className="flex items-center justify-center">
        <svg
          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        Procesando...
      </span>
    ) : (
      'Finalizar Compra'
    )}
  </button>
);

export default ShoppingCart;
