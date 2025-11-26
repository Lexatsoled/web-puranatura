import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../contexts/CartContext';
import { formatCurrency } from '../src/utils/intl';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    totalPrice,
    clearCart,
    cartCount,
  } = useCart();

  const [isConfirmingClear, setIsConfirmingClear] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  // Prevenir scroll cuando el modal esta abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setIsConfirmingClear(false);
      setIsProcessingPayment(false);
      setPaymentComplete(false);
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isConfirmingClear) {
          setIsConfirmingClear(false);
        } else {
          onClose();
        }
      }

      if (event.key === 'Tab' && isOpen && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    if (isOpen) {
      previouslyFocusedRef.current =
        document.activeElement as HTMLElement | null;
      window.addEventListener('keydown', handleKeyDown);
      setTimeout(() => closeButtonRef.current?.focus(), 0);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      try {
        previouslyFocusedRef.current?.focus();
      } catch {
        // Ignorar errores al restaurar el foco
      }
    };
  }, [isOpen, isConfirmingClear, onClose]);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity >= 1) {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleClearCart = () => {
    clearCart();
    setIsConfirmingClear(false);
  };

  const handleProceedToPayment = async () => {
    setIsProcessingPayment(true);

    await new Promise((resolve) => setTimeout(resolve, 3000));

    const paymentSuccess = Math.random() > 0.1;

    if (paymentSuccess) {
      setPaymentComplete(true);
      setTimeout(() => {
        clearCart();
        setPaymentComplete(false);
        setIsProcessingPayment(false);
        onClose();
      }, 2000);
    } else {
      setIsProcessingPayment(false);
      alert(
        'Error en el procesamiento del pago. Por favor, intentalo de nuevo.'
      );
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="cart-modal-title"
          className="bg-white rounded-lg w-full max-w-md mx-4 max-h-[80vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-4 border-b">
            <h2 id="cart-modal-title" className="text-xl font-semibold">
              {isProcessingPayment
                ? 'Procesando pago'
                : paymentComplete
                  ? 'Pago exitoso'
                  : `Carrito (${cartCount} ${cartCount === 1 ? 'articulo' : 'articulos'})`}
            </h2>
            <button
              ref={closeButtonRef}
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded"
              disabled={isProcessingPayment}
              aria-label="Cerrar carrito"
              type="button"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false"
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

          <div className="p-4 overflow-y-auto max-h-96">
            {isProcessingPayment ? (
              <div className="text-center py-12">
                <div className="animate-spin h-12 w-12 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Procesando pago...
                </h3>
                <p className="text-gray-600">
                  Por favor espera mientras procesamos tu pedido
                </p>
              </div>
            ) : paymentComplete ? (
              <div className="text-center py-12">
                <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="h-8 w-8 text-green-600"
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
                </div>
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  Pago completado!
                </h3>
                <p className="text-gray-600">
                  Tu pedido ha sido procesado exitosamente
                </p>
              </div>
            ) : cartItems.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-2">
                  <svg
                    className="h-12 w-12 mx-auto"
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
                </div>
                <p className="text-gray-600">Tu carrito esta vacio</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center space-x-3 border-b pb-3"
                  >
                    <div className="flex-shrink-0">
                      {item.product.images?.[0] && (
                        <img
                          src={item.product.images[0].thumbnail}
                          alt={item.product.name}
                          className="h-12 w-12 object-cover rounded"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {formatCurrency(item.product.price)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          handleQuantityChange(
                            item.product.id,
                            item.quantity - 1
                          )
                        }
                        className="p-1 hover:bg-gray-100 rounded"
                        disabled={item.quantity <= 1}
                        aria-label={`Disminuir cantidad de ${item.product.name}`}
                        type="button"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                          focusable="false"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 12H4"
                          />
                        </svg>
                      </button>
                      <span className="text-sm font-medium w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleQuantityChange(
                            item.product.id,
                            item.quantity + 1
                          )
                        }
                        className="p-1 hover:bg-gray-100 rounded"
                        aria-label={`Aumentar cantidad de ${item.product.name}`}
                        type="button"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                          focusable="false"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-1 hover:bg-red-100 text-red-600 rounded ml-2"
                        aria-label={`Eliminar ${item.product.name} del carrito`}
                        type="button"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                          focusable="false"
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
                ))}
              </div>
            )}
          </div>

          {cartItems.length > 0 && !isProcessingPayment && !paymentComplete && (
            <div className="border-t p-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-lg font-bold text-green-600">
                  {formatCurrency(totalPrice)}
                </span>
              </div>

              <div className="space-y-2">
                {!isConfirmingClear ? (
                  <>
                    <button
                      onClick={handleProceedToPayment}
                      className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                      type="button"
                    >
                      Proceder al pago
                    </button>
                    <button
                      onClick={() => setIsConfirmingClear(true)}
                      className="w-full text-gray-600 py-1 px-4 hover:text-red-600 transition-colors text-sm"
                      type="button"
                    >
                      Vaciar carrito
                    </button>
                  </>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <svg
                        className="h-5 w-5 text-red-600 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 15.5c-.77.833.192 2.5 1.732 2.5z"
                        />
                      </svg>
                      <h3 className="text-red-800 font-semibold">
                        Vaciar carrito?
                      </h3>
                    </div>
                    <p className="text-red-700 text-sm mb-4">
                      Se eliminaran todos los productos del carrito. Esta accion
                      no se puede deshacer.
                    </p>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleClearCart}
                        className="flex-1 bg-red-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                        type="button"
                      >
                        Si, vaciar carrito
                      </button>
                      <button
                        onClick={() => setIsConfirmingClear(false)}
                        className="flex-1 bg-gray-200 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
                        type="button"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CartModal;
