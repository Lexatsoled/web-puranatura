import React from 'react';
import { useCart } from '../store/cartStore';
import { OptimizedImage } from './OptimizedImage';
import { AnimatePresence, motion } from 'framer-motion';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();

  if (!isOpen) return null;

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity >= 1) {
      updateQuantity(productId, newQuantity);
    }
  };

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
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-bold text-gray-800">
                Carrito de Compras
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-800 transition-colors"
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

            {cart.items.length === 0 ? (
              <div className="flex-grow flex flex-col items-center justify-center text-center p-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-24 w-24 text-gray-300 mb-4"
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
                <h3 className="text-xl font-semibold text-gray-700">
                  Tu carrito está vacío
                </h3>
                <p className="text-gray-500 mt-2">
                  ¡Explora nuestra tienda y encuentra productos increíbles!
                </p>
                <button
                  onClick={onClose}
                  className="mt-6 bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Seguir comprando
                </button>
              </div>
            ) : (
              <>
                <div className="flex-grow overflow-y-auto p-4 space-y-4">
                  {cart.items.map((item) => (
                    <motion.div
                      key={item.product.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex items-center space-x-4 bg-white p-3 rounded-lg shadow-sm"
                    >
                      <div className="relative w-20 h-20 flex-shrink-0">
                        <OptimizedImage
                          src={item.product.images[0].thumbnail}
                          alt={item.product.name}
                          className="rounded-md"
                          aspectRatio={1}
                        />
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-semibold text-gray-800">
                          {item.product.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          DOP ${item.product.price.toFixed(2)}
                        </p>
                        <div className="flex items-center mt-2">
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item.product.id,
                                item.quantity - 1
                              )
                            }
                            className="text-gray-500 hover:text-gray-700"
                            aria-label="Reducir cantidad"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              handleQuantityChange(
                                item.product.id,
                                parseInt(e.target.value) || 1
                              )
                            }
                            className="w-16 text-center mx-2 border rounded-md"
                          />
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item.product.id,
                                item.quantity + 1
                              )
                            }
                            className="text-gray-500 hover:text-gray-700"
                            aria-label="Aumentar cantidad"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-red-500 hover:text-red-700 p-2"
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
                    </motion.div>
                  ))}
                </div>

                <div className="border-t p-4 space-y-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span>DOP ${cart.total.toFixed(2)}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={clearCart}
                      className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      Vaciar Carrito
                    </button>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                      Proceder al Pago
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
