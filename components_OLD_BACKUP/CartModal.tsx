import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../src/store/cartStore';
import { showErrorNotification } from '../src/store/notificationStore';
import './CartModal.css';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, clearCart, hasItems } =
    useCartStore();

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
    return `RD$ ${price.toFixed(2)}`;
  };

  const calculateWeight = () => {
    const totalWeight = cart.items.reduce((total, item) => {
      // Estimamos 0.2 kg por producto (ajustable según producto real)
      return total + item.quantity * 0.2;
    }, 0);
    return totalWeight;
  };

  const calculateSavings = () => {
    // Simulamos un ahorro del 15% como ejemplo
    const originalTotal = cart.total / 0.85;
    return originalTotal - cart.total;
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.75,
      y: 100,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        damping: 25,
        stiffness: 300,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.75,
      y: 100,
      transition: {
        duration: 0.2,
      },
    },
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
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

            {/* Modal - Estilo Piping Rock Compacto */}
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="inline-block align-bottom bg-white text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Simple - Sin bordes */}
              <div className="bg-white px-4 py-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-normal text-gray-900">
                    Carrito de Compras
                  </h3>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 focus:outline-none"
                    aria-label="Cerrar carrito"
                  >
                    <svg
                      className="h-5 w-5"
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
              </div>

              {/* Content - Estilo Lista Compacta */}
              <div className="bg-white">
                {cart.items.length === 0 ? (
                  /* Empty Cart */
                  <div className="text-center py-8 px-4">
                    <div className="w-16 h-16 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                      </svg>
                    </div>
                    <h4 className="text-base font-medium text-gray-900 mb-1">
                      Tu carrito está vacío
                    </h4>
                    <p className="text-sm text-gray-500 mb-4">
                      ¡Agrega algunos productos!
                    </p>
                    <button
                      onClick={handleContinueShopping}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded"
                    >
                      Explorar productos
                    </button>
                  </div>
                ) : (
                  /* Cart Items - Layout Piping Rock */
                  <div>
                    <div className="max-h-64 overflow-y-auto">
                      {cart.items.map((item) => (
                        <div
                          key={item.product.id}
                          className="flex items-start p-3 border-b border-gray-100 last:border-b-0"
                        >
                          {/* Product Image - Más pequeña */}
                          <div className="flex-shrink-0 mr-3">
                            <img
                              src={
                                item.product.images[0]?.thumbnail ||
                                item.product.images[0]?.full
                              }
                              alt={item.product.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                          </div>

                          {/* Product Info - Layout vertical compacto */}
                          <div className="flex-1 min-w-0">
                            {/* Product Name */}
                            <h4 className="text-sm font-normal text-gray-900 leading-tight mb-1 line-clamp-2">
                              {item.product.name}
                            </h4>

                            {/* Weight Info */}
                            <p className="text-xs text-gray-500 mb-1">
                              Peso: {(item.quantity * 0.35).toFixed(1)} lb (
                              {(item.quantity * 0.18).toFixed(2)} kg)
                            </p>

                            {/* Price Line */}
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <span className="text-base font-bold text-red-600">
                                  {formatPrice(item.product.price)}
                                </span>
                                {item.product.compareAtPrice &&
                                  item.product.compareAtPrice >
                                    item.product.price && (
                                    <span className="text-xs text-gray-400 line-through">
                                      {formatPrice(item.product.compareAtPrice)}
                                    </span>
                                  )}
                              </div>

                              {/* Quantity Controls - Más compactos */}
                              <div className="flex items-center">
                                <button
                                  onClick={() =>
                                    handleQuantityChange(
                                      item.product.id,
                                      item.quantity - 1
                                    )
                                  }
                                  className="w-6 h-6 flex items-center justify-center text-gray-600 hover:bg-gray-100 focus:outline-none disabled:opacity-50"
                                  disabled={item.quantity <= 1}
                                  title="Disminuir cantidad"
                                  aria-label="Disminuir cantidad"
                                >
                                  <svg
                                    className="w-3 h-3"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={3}
                                      d="M20 12H4"
                                    />
                                  </svg>
                                </button>

                                <span className="w-8 text-center text-sm font-medium text-gray-900">
                                  {item.quantity}
                                </span>

                                <button
                                  onClick={() =>
                                    handleQuantityChange(
                                      item.product.id,
                                      item.quantity + 1
                                    )
                                  }
                                  className="w-6 h-6 flex items-center justify-center text-gray-600 hover:bg-gray-100 focus:outline-none disabled:opacity-50"
                                  disabled={item.quantity >= item.product.stock}
                                  title="Aumentar cantidad"
                                  aria-label="Aumentar cantidad"
                                >
                                  <svg
                                    className="w-3 h-3"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={3}
                                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </div>

                            {/* Remove Link */}
                            <div className="text-right">
                              <button
                                onClick={() => removeFromCart(item.product.id)}
                                className="text-xs text-gray-500 hover:text-red-600 underline"
                              >
                                Quitar
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Summary - Estilo Piping Rock */}
                    <div className="bg-gray-50 border-t border-gray-200">
                      {/* Weight and Total Section */}
                      <div className="px-4 py-3 space-y-2">
                        {/* Total */}
                        <div className="text-center">
                          <div className="text-sm text-gray-600 mb-1">
                            Total
                          </div>
                          <div className="text-2xl font-bold text-red-600">
                            {formatPrice(cart.total)}
                          </div>
                          <div className="text-xs text-gray-500">
                            Peso Est. {calculateWeight().toFixed(1)} lb (
                            {(calculateWeight() * 0.45).toFixed(2)} kg)
                          </div>
                        </div>

                        {/* Savings */}
                        {calculateSavings() > 0 && (
                          <div className="text-center py-2">
                            <p className="text-sm font-bold text-green-600">
                              ¡ Has ahorrado {formatPrice(calculateSavings())} !
                            </p>
                          </div>
                        )}

                        {/* Free shipping progress */}
                        {cart.total < 3000 && cart.total > 0 && (
                          <div className="bg-blue-50 border border-blue-200 rounded p-2">
                            <p className="text-xs text-blue-700 text-center mb-1">
                              Añade {formatPrice(3000 - cart.total)} más para{' '}
                              <strong>envío gratis</strong>
                            </p>
                            <div className="w-full bg-blue-200 rounded-full h-1.5">
                              <div
                                className={`progress-bar bg-blue-600 h-1.5 rounded-full transition-all duration-300`}
                                data-width={Math.round(
                                  Math.min((cart.total / 3000) * 100, 100)
                                )}
                              ></div>
                            </div>
                          </div>
                        )}

                        {cart.total >= 3000 && (
                          <div className="bg-green-100 border border-green-200 rounded p-2">
                            <p className="text-xs text-green-700 text-center flex items-center justify-center">
                              <svg
                                className="w-3 h-3 mr-1"
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
                              <strong>Envío gratis incluido</strong>
                            </p>
                          </div>
                        )}

                        {/* Legal text */}
                        <p className="text-xs text-gray-500 text-center leading-tight pt-2">
                          Al realizar un pedido, acepta las Condiciones de uso y
                          la Política de confidencialidad de Puranatura.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer - Exactamente como Piping Rock */}
              {cart.items.length > 0 && (
                <div className="bg-white px-4 py-4 border-t border-gray-200">
                  <div className="space-y-3">
                    {/* Main Action Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => {
                          onClose();
                          navigate('/carrito');
                        }}
                        className="w-full py-2.5 px-4 border border-gray-400 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-colors"
                      >
                        Ver carrito
                      </button>

                      <button
                        onClick={handleCheckout}
                        className="w-full py-2.5 px-4 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none transition-colors"
                      >
                        Caja
                      </button>
                    </div>
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
                        ¿Estás seguro de que quieres vaciar el carrito? Esta
                        acción no se puede deshacer.
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

export default CartModal;
