import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { showErrorNotification } from '../store/notificationStore';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartModalOptimized: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    hasItems,
  } = useCartStore();

  const [isConfirmingClear, setIsConfirmingClear] = useState(false);
  
  // Prevenir scroll cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setIsConfirmingClear(false);
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Manejar tecla ESC
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isConfirmingClear) {
          setIsConfirmingClear(false);
        } else {
          onClose();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isConfirmingClear, onClose]);

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
    onClose();
  };

  const handleCheckout = () => {
    if (!hasItems()) {
      showErrorNotification('Tu carrito está vacío');
      return;
    }
    onClose();
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    onClose();
    navigate('/tienda');
  };

  const formatPrice = (price: number) => {
    return `DOP $${price.toFixed(2)}`;
  };

  const modalVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.75,
      y: 100
    },
    visible: { 
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        damping: 25,
        stiffness: 300
      }
    },
    exit: { 
      opacity: 0,
      scale: 0.75,
      y: 100,
      transition: {
        duration: 0.2
      }
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Backdrop */}
            <motion.div
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
              onClick={onClose}
            />

            {/* Modal */}
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full lg:max-w-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-white px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Carrito de Compras
                    {cart.count > 0 && (
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {cart.count} {cart.count === 1 ? 'item' : 'items'}
                      </span>
                    )}
                  </h3>
                  <button
                    onClick={onClose}
                    className="rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                    aria-label="Cerrar carrito"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="bg-white px-6 py-4">
                {cart.items.length === 0 ? (
                  /* Empty Cart */
                  <div className="text-center py-8">
                    <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Tu carrito está vacío</h4>
                    <p className="text-gray-500 mb-6">¡Agrega algunos productos para comenzar!</p>
                    <button
                      onClick={handleContinueShopping}
                      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Explorar productos
                    </button>
                  </div>
                ) : (
                  /* Cart Items */
                  <div>
                    <div className="max-h-96 overflow-y-auto">
                      <div className="space-y-4">
                        {cart.items.map((item) => (
                          <motion.div
                            key={item.product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                          >
                            <img
                              src={item.product.images[0]?.thumbnail || item.product.images[0]?.full}
                              alt={item.product.name}
                              className="w-16 h-16 object-cover rounded-md"
                            />
                            
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-gray-900 truncate">
                                {item.product.name}
                              </h4>
                              <p className="text-sm text-gray-500">{item.product.categories ? item.product.categories.join(', ') : ''}</p>
                              <p className="text-sm font-semibold text-green-600">
                                {formatPrice(item.product.price)}
                              </p>
                            </div>

                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                                className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                                disabled={item.quantity <= 1}
                                title="Disminuir cantidad"
                                aria-label="Disminuir cantidad"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                </svg>
                              </button>
                              
                              <span className="w-8 text-center text-sm font-medium">
                                {item.quantity}
                              </span>
                              
                              <button
                                onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                                className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                                disabled={item.quantity >= item.product.stock}
                                title="Aumentar cantidad"
                                aria-label="Aumentar cantidad"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                              </button>
                            </div>

                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              className="text-red-400 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
                              aria-label="Eliminar producto"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Total */}
                    <div className="border-t border-gray-200 mt-6 pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-medium text-gray-900">Total:</span>
                        <span className="text-xl font-bold text-green-600">
                          {formatPrice(cart.total)}
                        </span>
                      </div>

                      {/* Free shipping indicator */}
                      {cart.total < 3000 && cart.total > 0 && (
                        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                          <p className="text-sm text-blue-700">
                            Añade {formatPrice(3000 - cart.total)} más para <strong>envío gratis</strong>
                          </p>
                          <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              data-progress={Math.round(Math.min((cart.total / 3000) * 100, 100))}
                            ></div>
                          </div>
                        </div>
                      )}

                      {cart.total >= 3000 && (
                        <div className="mb-4 p-3 bg-green-100 border border-green-200 rounded-md">
                          <p className="text-sm text-green-700 flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            ¡Felicidades! Tienes <strong>envío gratis</strong>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              {cart.items.length > 0 && (
                <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setIsConfirmingClear(true)}
                    className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Vaciar carrito
                  </button>
                  
                  <button
                    onClick={handleContinueShopping}
                    className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Seguir comprando
                  </button>
                  
                  <button
                    onClick={handleCheckout}
                    className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Finalizar compra
                  </button>
                </div>
              )}

              {/* Confirmation Dialog */}
              <AnimatePresence>
                {isConfirmingClear && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
                  >
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      className="bg-white rounded-lg p-6 m-4 max-w-sm w-full"
                    >
                      <h4 className="text-lg font-medium text-gray-900 mb-2">
                        Confirmar acción
                      </h4>
                      <p className="text-sm text-gray-500 mb-4">
                        ¿Estás seguro de que quieres vaciar el carrito? Esta acción no se puede deshacer.
                      </p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setIsConfirmingClear(false)}
                          className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={handleClearCart}
                          className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                          Vaciar
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CartModalOptimized;
