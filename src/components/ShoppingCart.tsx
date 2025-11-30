import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OptimizedImage } from './OptimizedImage';

interface CartItem {
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
}

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

import useShoppingCart from '../hooks/useShoppingCart';

const ShoppingCart: React.FC<ShoppingCartProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onUpdateVariant,
  onCheckout,
  isLoading = false,
  currencySymbol = '€',
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

  // Manejadores de eventos optimizados
  // handlers provided by useShoppingCart

  // Animaciones de elementos
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

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Carrito de Compra
      </h2>

      {items.length === 0 ? (
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
      ) : (
        <>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="divide-y divide-gray-200"
          >
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  exit="exit"
                  className="py-6 flex items-center"
                >
                  {/* Imagen del producto */}
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

                  {/* Detalles del producto */}
                  <div className="ml-6 flex-1">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-800">
                          {item.name}
                        </h3>
                        {item.variants && item.variants.length > 0 && (
                          <select
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                            value={item.selectedVariantId}
                            onChange={(e) =>
                              handleVariantChange(item.id, e.target.value)
                            }
                          >
                            {item.variants.map((variant) => (
                              <option key={variant.id} value={variant.id}>
                                {variant.name}
                                {variant.price &&
                                  ` (+${currencySymbol}${variant.price.toFixed(
                                    2
                                  )})`}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
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
                    </div>

                    {/* Controles de cantidad */}
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <button
                          className="p-1 rounded-full hover:bg-gray-100"
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                        >
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
                        </button>
                        <span className="text-gray-600 select-none w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          className="p-1 rounded-full hover:bg-gray-100"
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity + 1)
                          }
                          disabled={
                            item.quantity >=
                            (item.maxQuantity || maxQuantityPerItem)
                          }
                        >
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
                        </button>
                      </div>
                      <button
                        className="text-red-600 hover:text-red-700"
                        onClick={() => onRemoveItem(item.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Resumen del carrito */}
          <div className="mt-8 border-t border-gray-200 pt-8">
            <div className="space-y-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({totalItems} productos)</span>
                <span>
                  {currencySymbol}
                  {subtotal.toFixed(2)}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Descuento</span>
                  <span>
                    -{currencySymbol}
                    {discount.toFixed(2)}
                  </span>
                </div>
              )}
              {shippingCost > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Envío</span>
                  <span>
                    {currencySymbol}
                    {shippingCost.toFixed(2)}
                  </span>
                </div>
              )}
              {tax > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>IVA ({(taxRate * 100).toFixed(0)}%)</span>
                  <span>
                    {currencySymbol}
                    {tax.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold text-gray-900">
                <span>Total</span>
                <span>
                  {currencySymbol}
                  {total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Botón de checkout */}
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
          </div>
        </>
      )}
    </div>
  );
};

export default ShoppingCart;
