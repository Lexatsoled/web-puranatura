import React from 'react';
import { motion } from 'framer-motion';
import { Product } from '../types/product';
import { withMemo } from '../hooks/usePerformance';
import { useProductCardState } from '../hooks/useProductCardState';
import { ProductImageSection, ProductInfoSection } from './ProductCard.helpers';

interface ProductCardProps {
  product: Product;
  onViewDetails?: (product: Product) => void;
  priority?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewDetails,
  priority = false,
}) => {
  const {
    isHovered,
    currentImageIndex,
    isAddingToCart,
    stockStatus,
    selectImage,
    handleAddToCart,
    hoverOn,
    hoverOff,
  } = useProductCardState(product);

  return (
    <motion.div
      role="button"
      tabIndex={0}
      aria-label={`Ver detalles de ${product.name}`}
      data-testid={`product-card-${product.id}`}
      data-testid-base="product-card"
      data-product-id={product.id}
      className="product-card bg-white rounded-lg shadow-sm overflow-hidden group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
      whileHover={{ y: -8 }}
      onClick={() => onViewDetails?.(product)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onViewDetails?.(product);
        }
      }}
      onHoverStart={hoverOn}
      onHoverEnd={hoverOff}
    >
      <ProductImageSection
        product={product}
        currentImageIndex={currentImageIndex}
        selectImage={selectImage}
        isHovered={isHovered}
        stockStatus={stockStatus}
        priority={priority}
      />

      <ProductInfoSection
        product={product}
        stockStatus={stockStatus}
        isAddingToCart={isAddingToCart}
        handleAddToCart={handleAddToCart}
      />
    </motion.div>
  );
};

const arePropsEqual = (
  prevProps: ProductCardProps,
  nextProps: ProductCardProps
) =>
  prevProps.product.id === nextProps.product.id &&
  prevProps.product.stock === nextProps.product.stock &&
  prevProps.product.price === nextProps.product.price &&
  prevProps.priority === nextProps.priority;

export default withMemo(ProductCard, arePropsEqual);
