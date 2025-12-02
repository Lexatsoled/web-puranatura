import React from 'react';
import { motion } from 'framer-motion';
import { Product } from '../types/product';
import { withMemo } from '../hooks/usePerformance';
import { useProductCardState } from '../hooks/useProductCardState';
import { ImageCarousel } from './productCard/ImageCarousel';
import { BadgeList } from './productCard/BadgeList';
import { AddToCartButton } from './productCard/AddToCartButton';

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
      data-testid={`product-card-${product.id}`}
      data-testid-base="product-card"
      data-product-id={product.id}
      className="product-card bg-white rounded-lg shadow-sm overflow-hidden group cursor-pointer"
      whileHover={{ y: -8 }}
      onClick={() => onViewDetails?.(product)}
      onHoverStart={hoverOn}
      onHoverEnd={hoverOff}
    >
      <div className="relative aspect-square bg-gray-100">
        <ImageCarousel
          images={product.images}
          productName={product.name}
          currentImageIndex={currentImageIndex}
          onSelectImage={selectImage}
          isHovered={isHovered}
          priority={priority}
        />

        <BadgeList product={product} stockStatus={stockStatus} />

        <motion.div
          className="absolute inset-0 bg-black bg-opacity-10 transition-opacity duration-300"
          initial={{ opacity: 0.1 }}
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
        <p className="text-sm text-gray-500 mb-3">{product.category}</p>

        <div className="mt-auto flex justify-between items-center">
          <motion.p className="text-xl font-bold text-green-700" layout>
            DOP ${product.price.toFixed(2)}
          </motion.p>

          <AddToCartButton
            stockStatus={stockStatus}
            isAddingToCart={isAddingToCart}
            onAddToCart={handleAddToCart}
            stock={product.stock}
          />
        </div>
      </div>
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
