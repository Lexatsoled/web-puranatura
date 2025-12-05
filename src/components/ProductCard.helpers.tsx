import React from 'react';
import { motion } from 'framer-motion';
import { Product } from '../types/product';
import { StockStatus } from '../hooks/useProductCardState';
import { ImageCarousel } from './productCard/ImageCarousel';
import { BadgeList } from './productCard/BadgeList';
import { AddToCartButton } from './productCard/AddToCartButton';

export interface ProductImageSectionProps {
  product: Product;
  currentImageIndex: number;
  selectImage: (index: number) => void;
  isHovered: boolean;
  stockStatus: StockStatus;
  priority: boolean;
}

export const ProductImageSection: React.FC<ProductImageSectionProps> = ({
  product,
  currentImageIndex,
  selectImage,
  isHovered,
  stockStatus,
  priority,
}) => (
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
);

export interface ProductInfoSectionProps {
  product: Product;
  stockStatus: StockStatus;
  isAddingToCart: boolean;
  handleAddToCart: (e: React.MouseEvent) => void;
}

export const ProductInfoSection: React.FC<ProductInfoSectionProps> = ({
  product,
  stockStatus,
  isAddingToCart,
  handleAddToCart,
}) => (
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
);
