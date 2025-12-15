import React from 'react';
// Replace framer-motion hover animation with Tailwind-based transform to avoid bundling motion runtime
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
  // product is a required prop for this component — callers must provide it.
  // The consumer of ProductCard should always pass a valid `product` object.

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
    <article
      data-testid={`product-card-${product.id}`}
      data-testid-base="product-card"
      data-product-id={product.id}
      className="product-card bg-white rounded-lg shadow-sm overflow-hidden group hover:-translate-y-2 transition-transform duration-200"
      onMouseEnter={hoverOn}
      onMouseLeave={hoverOff}
    >
      <ProductImageSection
        product={product}
        currentImageIndex={currentImageIndex}
        selectImage={selectImage}
        isHovered={isHovered}
        stockStatus={stockStatus}
        priority={priority}
        onViewDetails={() => onViewDetails?.(product)}
      />

      <ProductInfoSection
        product={product}
        stockStatus={stockStatus}
        isAddingToCart={isAddingToCart}
        handleAddToCart={handleAddToCart}
        onViewDetails={() => onViewDetails?.(product)}
      />
    </article>
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
