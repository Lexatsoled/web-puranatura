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
  // defensive: if a consumer accidentally passes undefined/null, render empty placeholder
  if (!product) {
    // eslint-disable-next-line no-console
    console.warn('ProductCard rendered without a product');
    return (
      <div className="product-card bg-white rounded-lg shadow-sm overflow-hidden p-4">
        <div className="text-sm text-gray-500">Producto no disponible</div>
      </div>
    );
  }

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
    <div
      role="button"
      tabIndex={0}
      aria-label={`Ver detalles de ${product.name}`}
      data-testid={`product-card-${product.id}`}
      data-testid-base="product-card"
      data-product-id={product.id}
      className="product-card bg-white rounded-lg shadow-sm overflow-hidden group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white hover:-translate-y-2 transition-transform duration-200"
      onClick={() => onViewDetails?.(product)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onViewDetails?.(product);
        }
      }}
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
      />

      <ProductInfoSection
        product={product}
        stockStatus={stockStatus}
        isAddingToCart={isAddingToCart}
        handleAddToCart={handleAddToCart}
      />
    </div>
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
