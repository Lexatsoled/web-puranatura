import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../types/product';
import { useCartStore } from '../store/cartStore';
import { OptimizedImage } from './OptimizedImage';
import { useStableMemo, useStableCallback, withMemo } from '../hooks/usePerformance';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  priority?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onViewDetails,
  priority = false 
}) => {
  const addToCart = useCartStore((state) => state.addToCart);
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Memoizar el estado del stock
  const stockStatus = useStableMemo(() => {
    if (product.stock <= 0) return 'out-of-stock';
    if (product.stock <= 5) return 'low-stock';
    return 'in-stock';
  }, [product.stock]);

  const handleAddToCart = useStableCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAddingToCart || stockStatus === 'out-of-stock') return;
    
    setIsAddingToCart(true);
    try {
      addToCart(product);
      // Aquí podríamos añadir una notificación de éxito
    } catch (error) {
      // Aquí podríamos añadir una notificación de error
    } finally {
      setIsAddingToCart(false);
    }
  }, [addToCart, product, isAddingToCart, stockStatus]);

  return (
    <motion.div
      className="bg-white rounded-lg shadow-sm overflow-hidden group cursor-pointer"
      whileHover={{ y: -8 }}
      onClick={() => onViewDetails(product)}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="relative aspect-square bg-gray-100">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
          >
            <OptimizedImage
              src={product.images[currentImageIndex]?.full || product.images[0].full}
              alt={product.name}
              className="w-full h-full object-cover"
              aspectRatio={1}
              priority={priority}
              blur={true}
            />
          </motion.div>
        </AnimatePresence>

        {/* Controles de imagen */}
        {product.images.length > 1 && isHovered && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
            {product.images.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentImageIndex
                    ? 'bg-green-500'
                    : 'bg-white/50 hover:bg-white/70'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(index);
                }}
              />
            ))}
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          {product.isNew && (
            <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded">
              Nuevo
            </span>
          )}
          {stockStatus === 'low-stock' && (
            <span className="bg-yellow-500 text-white text-xs font-semibold px-2 py-1 rounded">
              ¡Últimas unidades!
            </span>
          )}
        </div>

        <motion.div
          className="absolute inset-0 bg-black bg-opacity-10 transition-opacity duration-300"
          animate={{ opacity: isHovered ? 0 : 0.1 }}
        />
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <motion.h3
          className="text-lg font-semibold text-gray-800 truncate group-hover:text-green-600 transition-colors"
          layout
        >
          {product.name}
        </motion.h3>
        <p className="text-sm text-gray-500 mb-3">
          {product.categories ? product.categories.join(', ') : ''}
        </p>

        <div className="mt-auto flex justify-between items-center">
          <motion.p
            className="text-xl font-bold text-green-700"
            layout
          >
            DOP ${product.price.toFixed(2)}
          </motion.p>
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart || stockStatus === 'out-of-stock'}
            className={`relative px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 flex items-center space-x-2 ${
              stockStatus === 'out-of-stock'
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : isAddingToCart
                ? 'bg-green-500 text-white cursor-wait'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {isAddingToCart ? (
              <motion.span
                className="flex items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                Agregando...
              </motion.span>
            ) : (
              <>
                <span>{stockStatus === 'out-of-stock' ? 'Agotado' : 'Añadir'}</span>
                {stockStatus === 'low-stock' && (
                  <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                    ¡Solo {product.stock} disponibles!
                  </span>
                )}
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Memoizar el componente con una función de comparación personalizada
const arePropsEqual = (prevProps: ProductCardProps, nextProps: ProductCardProps) => {
  return (
    prevProps.product.id === nextProps.product.id &&
    prevProps.product.stock === nextProps.product.stock &&
    prevProps.product.price === nextProps.product.price &&
    prevProps.priority === nextProps.priority
  );
};

export default withMemo(ProductCard, arePropsEqual);
