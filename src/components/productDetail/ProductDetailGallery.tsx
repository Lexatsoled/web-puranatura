import React from 'react';
// Replaced framer-motion with CSS transitions so this gallery no longer pulls
// the framer-motion runtime into shared bundles.
import { Product, ProductImage } from '../../types';
import { OptimizedImage } from '../OptimizedImage';
import { DEFAULT_PRODUCT_IMAGE } from '../../constants/images';

type Props = {
  product: Product;
  selectedImage: number;
  setSelectedImage: (index: number) => void;
  isZoomed: boolean;
  setIsZoomed: (value: boolean) => void;
  mousePosition: { x: number; y: number };
  onMouseMove: (e: {
    currentTarget: Element;
    clientX: number;
    clientY: number;
  }) => void;
};

export const ProductDetailGallery: React.FC<Props> = ({
  product,
  selectedImage,
  setSelectedImage,
  isZoomed,
  setIsZoomed,
  mousePosition,
  onMouseMove,
}) => (
  <div className="relative p-6 flex flex-col">
    <div className="relative flex-grow">
      <div
        className={`aspect-w-1 aspect-h-1 bg-gray-100 rounded-lg overflow-hidden relative ${
          isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
        }`}
        onClick={() => setIsZoomed(!isZoomed)}
        onMouseMove={onMouseMove}
      >
        <div
          className="w-full h-full"
          style={{
            transform: isZoomed
              ? `scale(2) translate(${-mousePosition.x}px, ${-mousePosition.y}px)`
              : 'scale(1) translate(0px, 0px)',
            transition: 'transform 220ms cubic-bezier(.2,.8,.2,1)',
            transformOrigin: 'center center',
          }}
        >
          <OptimizedImage
            src={
              product?.images?.[selectedImage]?.full ??
              product?.images?.[0]?.full ??
              DEFAULT_PRODUCT_IMAGE
            }
            alt={product.name}
            className="object-contain rounded-lg w-full h-full"
            priority={selectedImage === 0}
          />
        </div>
      </div>
    </div>
    <div className="flex space-x-4 mt-4 overflow-x-auto pb-2">
      {product.images.map((image: ProductImage, index: number) => (
        <button
          key={index}
          // Use CSS hover/active transforms to mimic the previous framer-motion
          // interactions without importing the motion runtime.
          onClick={() => setSelectedImage(index)}
          className={`relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border-2 transition-colors transform transition-transform hover:scale-105 active:scale-95 ${
            selectedImage === index
              ? 'border-green-500'
              : 'border-transparent hover:border-green-300'
          }`}
        >
          <OptimizedImage
            src={image?.thumbnail ?? DEFAULT_PRODUCT_IMAGE}
            alt={`${product.name} - Vista ${index + 1}`}
            className="object-cover"
            aspectRatio={1}
          />
        </button>
      ))}
    </div>
  </div>
);
