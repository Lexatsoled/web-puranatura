import React from 'react';
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
  onViewDetails?: () => void;
}

export const ProductImageSection: React.FC<ProductImageSectionProps> = ({
  product,
  currentImageIndex,
  selectImage,
  isHovered,
  stockStatus,
  priority,
  onViewDetails,
}) => (
  <div className="relative aspect-square bg-gray-100">
    <ImageCarousel
      images={product?.images ?? []}
      productName={product?.name ?? 'Producto'}
      currentImageIndex={currentImageIndex}
      onSelectImage={selectImage}
      isHovered={isHovered}
      priority={priority}
      onImageClick={onViewDetails}
    />

    <BadgeList product={product} stockStatus={stockStatus} />

    <div
      className={`absolute inset-0 bg-black bg-opacity-10 transition-opacity duration-300 pointer-events-none ${isHovered ? 'opacity-0' : 'opacity-10'}`}
    />
  </div>
);

export interface ProductInfoSectionProps {
  product: Product;
  stockStatus: StockStatus;
  isAddingToCart: boolean;
  handleAddToCart: (e: React.MouseEvent) => void;
  onViewDetails?: () => void;
}

export const ProductInfoSection: React.FC<ProductInfoSectionProps> = ({
  product,
  stockStatus,
  isAddingToCart,
  handleAddToCart,
  onViewDetails,
}) => (
  <div className="p-4 flex flex-col flex-grow">
    <h3 className="text-lg font-semibold text-gray-800 truncate">
      <button
        type="button"
        className="group-hover:text-green-600 transition-colors cursor-pointer bg-transparent border-0 p-0 text-left focus:outline-none focus:text-green-600 w-full truncate"
        onClick={onViewDetails}
      >
        {product?.name ?? 'Producto sin nombre'}
      </button>
    </h3>
    <p className="text-sm text-gray-500 mb-3">{product?.category ?? ''}</p>

    <div className="mt-auto flex justify-between items-center">
      <p className="text-xl font-bold text-green-700">
        DOP $
        {typeof product?.price === 'number' ? product.price.toFixed(2) : '--'}
      </p>

      <AddToCartButton
        stockStatus={stockStatus}
        isAddingToCart={isAddingToCart}
        onAddToCart={handleAddToCart}
        stock={typeof product?.stock === 'number' ? product.stock : 0}
      />
    </div>
  </div>
);
