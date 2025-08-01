import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../contexts/CartContext';
import { OptimizedImage } from './OptimizedImage';

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
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);
  
  // Prevenir scroll cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Manejar teclas
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isConfirmingClear) {
          setIsConfirmingClear(false);
        } else if (itemToRemove) {
          setItemToRemove(null);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isConfirmingClear, itemToRemove, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 500 }}
            className="fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-xl flex flex-col z-50"
            onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            Carrito de Compras
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
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

        {cartCount === 0 ? (
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
              Parece que no has añadido nada todavía.
            </p>
            <button
              onClick={onClose}
              className="mt-6 bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700"
            >
              Volver a la tienda
            </button>
          </div>
        ) : (
          <>
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center space-x-4"
                >
                  <img
                    src={item.product.images[0].thumbnail}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
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
                          updateQuantity(item.product.id, item.quantity - 1)
                        }
                        className="w-6 h-6 border rounded-full"
                      >
                        -
                      </button>
                      <span className="px-3">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                        className="w-6 h-6 border rounded-full"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Quitar
                  </button>
                </div>
              ))}
            </div>
            <div className="p-4 border-t space-y-4">
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>DOP ${totalPrice.toFixed(2)}</span>
              </div>
              <button className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition-colors">
                Finalizar Compra
              </button>
              <button
                onClick={clearCart}
                className="w-full text-center text-sm text-gray-500 hover:text-red-500"
              >
                Vaciar Carrito
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartModal;
