import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { showErrorNotification } from '../store/notificationStore';
import { OptimizedImage } from '../components/OptimizedImage';

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, clearCart, hasItems } =
    useCartStore();

  const [isConfirmingClear, setIsConfirmingClear] = useState(false);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleClearCart = () => {
    clearCart();
    setIsConfirmingClear(false);
  };

  const handleCheckout = () => {
    if (!hasItems()) {
      showErrorNotification('Tu carrito está vacío');
      return;
    }
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    navigate('/tienda');
  };

  const formatPrice = (price: number) => {
    return `DOP $${price.toFixed(2)}`;
  };

  const resolveProductImage = (product: typeof cart.items[number]['product']) => {
    const [primary] = product.images ?? [];
    return (
      primary?.full ||
      primary?.thumbnail ||
      '/placeholder-product.jpg'
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Carrito de Compras
          </h1>
          <p className="text-gray-600">
            {cart.count > 0 ? (
              <>
                Tienes {cart.count}{' '}
                {cart.count === 1 ? 'producto' : 'productos'} en tu carrito
              </>
            ) : (
              'Tu carrito está vacío'
            )}
          </p>
        </motion.div>

        {cart.items.length === 0 ? (
          /* Empty Cart */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="max-w-md mx-auto">
              <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-16 h-16 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3" data-testid="empty-cart-message">
                Tu carrito está vacío
              </h2>
              <p className="text-gray-500 mb-8">
                ¡Descubre nuestros productos naturales y comienza tu journey
                hacia el bienestar!
              </p>
              <div className="space-y-3 sm:space-y-0 sm:space-x-3 sm:flex sm:justify-center">
                <button
                  onClick={handleContinueShopping}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Explorar productos
                </button>
                <button
                  onClick={() => navigate('/servicios')}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-emerald-300 text-base font-medium rounded-md text-emerald-700 bg-emerald-50 hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
                >
                  Ver servicios
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          /* Cart Content */
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
            {/* Cart Items */}
            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white shadow-sm rounded-lg"
              >
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium text-gray-900">
                      Productos ({cart.count})
                    </h2>
                    {cart.items.length > 0 && (
                      <button
                        onClick={() => setIsConfirmingClear(true)}
                        className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
                      >
                        Vaciar carrito
                      </button>
                    )}
                  </div>
                </div>

                <div className="divide-y divide-gray-200">
                  <AnimatePresence>
                    {cart.items.map((item, index) => (
                      <motion.div
                        key={item.product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-6 flex"
                      >
                        <div className="flex-shrink-0">
                          <OptimizedImage
                            src={resolveProductImage(item.product)}
                            alt={item.product.name}
                            width={96}
                            height={96}
                            className="w-24 h-24 rounded-md"
                            sizes="96px"
                          />
                        </div>

                        <div className="ml-4 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between">
                              <div>
                                <h3 className="text-base font-medium text-gray-900">
                                  {item.product.name}
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                  {item.product.categories
                                    ? item.product.categories.join(', ')
                                    : ''}
                                </p>
                                <p className="mt-1 text-sm text-gray-600">
                                  SKU: {item.product.sku}
                                </p>
                              </div>
                              <button
                                onClick={() => removeFromCart(item.product.id)}
                                className="text-red-400 hover:text-red-600 transition-colors p-1"
                                aria-label="Eliminar producto"
                              >
                                <svg
                                  className="w-5 h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              </button>
                            </div>

                            <div className="mt-4 flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <span className="text-sm text-gray-500">
                                  Cantidad:
                                </span>
                                <div className="flex items-center border border-gray-300 rounded-md">
                                  <button
                                    onClick={() =>
                                      handleQuantityChange(
                                        item.product.id,
                                        item.quantity - 1
                                      )
                                    }
                                    className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={item.quantity <= 1}
                                    aria-label="Disminuir cantidad"
                                  >
                                    <svg
                                      className="w-4 h-4"
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

                                  <span className="px-4 py-2 text-sm font-medium min-w-[3rem] text-center">
                                    {item.quantity}
                                  </span>

                                  <button
                                    onClick={() =>
                                      handleQuantityChange(
                                        item.product.id,
                                        item.quantity + 1
                                      )
                                    }
                                    className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={
                                      item.quantity >= item.product.stock
                                    }
                                    aria-label="Aumentar cantidad"
                                  >
                                    <svg
                                      className="w-4 h-4"
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
                                {item.quantity >= item.product.stock && (
                                  <span className="text-xs text-orange-600">
                                    Stock limitado
                                  </span>
                                )}
                              </div>

                              <div className="text-right">
                                <p className="text-sm text-gray-500">
                                  Precio unitario
                                </p>
                                <p className="text-lg font-semibold text-emerald-600">
                                  {formatPrice(item.product.price)}
                                </p>
                                {item.quantity > 1 && (
                                  <p className="text-sm text-gray-900 font-medium">
                                    Total:{' '}
                                    {formatPrice(
                                      item.product.price * item.quantity
                                    )}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Continue Shopping */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-6"
              >
                <button
                  onClick={handleContinueShopping}
                  className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Continuar comprando
                </button>
              </motion.div>
            </div>

            {/* Order Summary */}
            <div className="mt-16 lg:mt-0 lg:col-span-5">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white shadow-sm rounded-lg sticky top-8"
              >
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">
                    Resumen del pedido
                  </h2>
                </div>

                <div className="px-6 py-4 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">
                      {formatPrice(cart.total)}
                    </span>
                  </div>

                  {/* Shipping */}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Envío</span>
                    <span className="font-medium">
                      {cart.total >= 3000 ? (
                        <span className="text-emerald-600">Gratis</span>
                      ) : (
                        formatPrice(200)
                      )}
                    </span>
                  </div>

                  {/* Free shipping progress */}
                  {cart.total < 3000 && cart.total > 0 && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                      <p className="text-sm text-blue-700 mb-2">
                        Añade {formatPrice(3000 - cart.total)} más para{' '}
                        <strong>envío gratis</strong>
                      </p>
                      <div className="w-full bg-blue-200 rounded-full h-2">
                        <div
                          className={`bg-blue-600 h-2 rounded-full transition-all duration-500`}
                          style={{
                            width: `${Math.min((cart.total / 3000) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {cart.total >= 3000 && (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-md">
                      <p className="text-sm text-emerald-700 flex items-center">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        ¡Felicidades! Tienes <strong>envío gratis</strong>
                      </p>
                    </div>
                  )}

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-base font-medium">
                      <span className="text-gray-900">Total</span>
                      <span className="text-emerald-600" data-testid="cart-total">
                        {formatPrice(
                          cart.total + (cart.total >= 3000 ? 0 : 200)
                        )}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Impuestos incluidos
                    </p>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="w-full mt-6 bg-emerald-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
                  >
                    Proceder al pago
                  </button>

                  {/* Trust indicators */}
                  <div className="mt-6 text-center text-sm text-gray-500">
                    <div className="flex items-center justify-center space-x-6">
                      <div className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-1 text-emerald-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Pago seguro
                      </div>
                      <div className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-1 text-emerald-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                          />
                        </svg>
                        Envío rápido
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {/* Confirmation Dialog */}
        <AnimatePresence>
          {isConfirmingClear && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg p-6 max-w-md w-full"
              >
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Confirmar acción
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  ¿Estás seguro de que quieres vaciar el carrito? Esta acción
                  eliminará todos los productos y no se puede deshacer.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsConfirmingClear(false)}
                    className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleClearCart}
                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                  >
                    Vaciar carrito
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CartPage;
