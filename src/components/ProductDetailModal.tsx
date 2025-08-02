import React, { useState, useEffect, useCallback } from 'react';
import { Product, ProductImage } from '../types';
import { OptimizedImage } from './OptimizedImage';
import { useCartStore } from '../store/cartStore';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductDetailModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onAddToCartSuccess?: () => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCartSuccess
}) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addToCart } = useCartStore();

  // Reset estado cuando el modal se abre
  useEffect(() => {
    if (isOpen) {
      setSelectedImage(0);
      setQuantity(1);
      setIsZoomed(false);
      setIsAddingToCart(false);
    }
  }, [isOpen]);

  // Manejar teclas
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          setSelectedImage((prev) => 
            prev === 0 ? product.images.length - 1 : prev - 1
          );
          break;
        case 'ArrowRight':
          setSelectedImage((prev) => 
            prev === product.images.length - 1 ? 0 : prev + 1
          );
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, product.images.length, onClose]);

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

  // Manejar zoom de imagen
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;

    const bounds = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - bounds.left) / bounds.width) * 100;
    const y = ((e.clientY - bounds.top) / bounds.height) * 100;
    setMousePosition({ x, y });
  }, [isZoomed]);

  // Añadir al carrito con manejo de errores
  const handleAddToCart = async () => {
    if (isAddingToCart) return;
    
    setIsAddingToCart(true);
    try {
      await addToCart(product as any, quantity);
      onAddToCartSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error adding to cart:', error);
      // Aquí podrías mostrar una notificación de error
    } finally {
      setIsAddingToCart(false);
    }
  };

  // const handleAddToCartSimple = () => {
  //   addToCart(product, quantity);
  //   onClose();
  // };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <div className="grid md:grid-cols-2 h-full">
              {/* Galería de imágenes */}
              <div className="relative p-6 flex flex-col">
                <div className="relative flex-grow">
                  <div 
                    className={`aspect-w-1 aspect-h-1 bg-gray-100 rounded-lg overflow-hidden relative ${
                      isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
                    }`}
                    onClick={() => setIsZoomed(!isZoomed)}
                    onMouseMove={handleMouseMove}
                  >
                    <motion.div
                      className="w-full h-full"
                      animate={isZoomed ? {
                        scale: 2,
                        x: -mousePosition.x,
                        y: -mousePosition.y,
                      } : {
                        scale: 1,
                        x: 0,
                        y: 0,
                      }}
                      transition={{ type: "spring", damping: 25 }}
                    >
                      <OptimizedImage
                        src={product.images[selectedImage].full}
                        alt={product.name}
                        className="object-contain rounded-lg w-full h-full"
                        priority={selectedImage === 0}
                      />
                    </motion.div>
                  </div>
                </div>
                <div className="flex space-x-4 mt-4 overflow-x-auto pb-2">
                  {product.images.map((image: ProductImage, index: number) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedImage(index)}
                      className={`relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border-2 transition-colors ${
                        selectedImage === index
                          ? 'border-green-500'
                          : 'border-transparent hover:border-green-300'
                      }`}
                    >
                      <OptimizedImage
                        src={image.thumbnail}
                        alt={`${product.name} - Vista ${index + 1}`}
                        className="object-cover"
                        aspectRatio={1}
                      />
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Detalles del producto */}
              <div className="p-6 flex flex-col h-full overflow-y-auto">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {product.name}
                  </h2>
                  {/* {product.isNew && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Nuevo
                    </span>
                  )} */}
                  {/* {product.isBestSeller && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Más Vendido
                    </span>
                  )} */}
                </div>
                <div className="mb-4">
                  <div className="text-2xl font-semibold text-green-600">
                    DOP ${product.price.toFixed(2)}
                    {/* {product.compareAtPrice && (
                      <span className="ml-2 text-lg line-through text-gray-500">
                        DOP ${product.compareAtPrice.toFixed(2)}
                      </span>
                    )} */}
                  </div>
                  {product.inStock && (
                    <p className="text-sm mt-1 text-green-600">
                      En stock
                    </p>
                  )}
                  {!product.inStock && (
                    <p className="text-sm mt-1 text-red-600">
                      Agotado
                    </p>
                  )}
                </div>

                <div className="prose prose-sm mb-6">
                  <h3 className="text-lg font-semibold mb-2">Descripción</h3>
                  <p className="text-gray-600">{product.description}</p>
                </div>

                {product.benefits && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Beneficios</h3>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      {product.benefits.map((benefit: string, index: number) => (
                        <li key={index}>{benefit}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-auto">
                  <div className="flex items-center space-x-4 mb-6">
                    <label htmlFor="quantity" className="font-medium">
                      Cantidad:
                    </label>
                    <div className="flex items-center border rounded-lg">
                      <button
                        onClick={() =>
                          setQuantity((prev) => (prev > 1 ? prev - 1 : 1))
                        }
                        className="px-3 py-2 text-gray-600 hover:text-gray-800"
                        aria-label="Reducir cantidad"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        id="quantity"
                        min="1"
                        value={quantity}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          setQuantity(value >= 1 ? value : 1);
                        }}
                        className="w-16 text-center border-x py-2"
                      />
                      <button
                        onClick={() => setQuantity((prev) => prev + 1)}
                        className="px-3 py-2 text-gray-600 hover:text-gray-800"
                        aria-label="Aumentar cantidad"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddToCart}
                    disabled={isAddingToCart || quantity <= 0}
                    className={`
                      w-full px-6 py-3 rounded-md font-semibold
                      transition-colors duration-200
                      flex items-center justify-center
                      ${isAddingToCart 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-green-600 hover:bg-green-700 text-white'
                      }
                    `}
                  >
                    {isAddingToCart ? (
                      <>
                        <svg 
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
                          xmlns="http://www.w3.org/2000/svg" 
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
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                        Agregando...
                      </>
                    ) : (
                      'Agregar al Carrito'
                    )}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductDetailModal;
