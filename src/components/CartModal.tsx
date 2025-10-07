import React from 'react';
import { useCartStore } from '../store/cartStore';
import { OptimizedImage } from './OptimizedImage';
import { AnimatePresence, motion } from 'framer-motion';
import { CartItem } from '../types/cart';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCartStore();

  if (!isOpen) return null;

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity >= 1) {
      updateQuantity(productId, newQuantity);
    }
  };

  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-lg bg-gray-50 shadow-xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header - Amazon-inspired */}
            <div className="bg-white border-b shadow-sm">
              <div className="flex justify-between items-center p-4 pb-3">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Carrito de Compras
                  </h2>
                  {cart.items.length > 0 && (
                    <p className="text-sm text-gray-600 mt-1">
                      {itemCount} {itemCount === 1 ? 'artículo' : 'artículos'}
                    </p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-2"
                  aria-label="Cerrar carrito"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Subtotal Section - Prominent like Amazon */}
              {cart.items.length > 0 && (
                <div className="px-4 pb-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-medium text-gray-900">
                        Subtotal ({itemCount} {itemCount === 1 ? 'artículo' : 'artículos'}):
                      </span>
                      <span className="text-xl font-bold text-green-700">
                        DOP ${cart.total.toFixed(2)}
                      </span>
                    </div>
                    <button className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-sm">
                      Proceder al Pago
                    </button>
                  </div>
                </div>
              )}
            </div>

            {cart.items.length === 0 ? (
              <div className="flex-grow flex flex-col items-center justify-center text-center p-8">
                <div className="bg-white rounded-xl p-8 shadow-sm max-w-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-20 w-20 text-gray-300 mb-4 mx-auto"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Tu carrito está vacío
                  </h3>
                  <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                    ¡Explora nuestra tienda y encuentra productos increíbles para tu bienestar natural!
                  </p>
                  <button
                    onClick={onClose}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors w-full"
                  >
                    Seguir comprando
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Items List - Clean Amazon-style */}
                <div className="flex-grow overflow-y-auto bg-gray-50">
                  <div className="p-4 space-y-3">
                    {cart.items.map((item: CartItem) => (
                      <motion.div
                        key={item.product.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
                      >
                        <div className="flex gap-4">
                          {/* Product Image */}
                          <div className="relative w-20 h-20 flex-shrink-0">
                            <OptimizedImage
                              src={item.product.images[0].thumbnail}
                              alt={item.product.name}
                              className="rounded-md border border-gray-200"
                              aspectRatio={1}
                            />
                          </div>

                          {/* Product Details */}
                          <div className="flex-grow min-w-0">
                            <h4 className="font-medium text-gray-900 text-sm leading-tight mb-1 truncate">
                              {item.product.name}
                            </h4>
                            
                            {/* Price */}
                            <div className="text-lg font-bold text-green-700 mb-2">
                              DOP ${item.product.price.toFixed(2)}
                            </div>

                            {/* Quantity and Actions Row */}
                            <div className="flex items-center justify-between">
                              {/* Quantity Selector */}
                              <div className="flex items-center border border-gray-300 rounded-md bg-white">
                                <button
                                  onClick={() =>
                                    handleQuantityChange(
                                      item.product.id,
                                      item.quantity - 1
                                    )
                                  }
                                  className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                                  aria-label="Reducir cantidad"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                  </svg>
                                </button>
                                <div className="w-12 h-8 flex items-center justify-center text-sm font-medium text-gray-900 border-x border-gray-300">
                                  {item.quantity}
                                </div>
                                <button
                                  onClick={() =>
                                    handleQuantityChange(
                                      item.product.id,
                                      item.quantity + 1
                                    )
                                  }
                                  className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                                  aria-label="Aumentar cantidad"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                  </svg>
                                </button>
                              </div>

                              {/* Remove Button */}
                              <button
                                onClick={() => removeFromCart(item.product.id)}
                                className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                                aria-label="Eliminar del carrito"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
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
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Bottom Actions - Clean and organized */}
                <div className="bg-white border-t border-gray-200 p-4">
                  <div className="flex gap-3">
                    <button
                      onClick={clearCart}
                      className="flex-1 px-4 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
                    >
                      Vaciar Carrito
                    </button>
                    <button 
                      onClick={onClose}
                      className="flex-1 px-4 py-3 text-green-700 border border-green-300 rounded-lg hover:bg-green-50 transition-colors font-medium text-sm"
                    >
                      Seguir Comprando
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CartModal;
