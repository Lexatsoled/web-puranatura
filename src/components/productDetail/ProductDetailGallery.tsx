import React from 'react';
import { motion } from 'framer-motion';
import { Product, ProductImage } from '../../types';
import { OptimizedImage } from '../OptimizedImage';

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
        <motion.div
          className="w-full h-full"
          animate={
            isZoomed
              ? {
                  scale: 2,
                  x: -mousePosition.x,
                  y: -mousePosition.y,
                }
              : {
                  scale: 1,
                  x: 0,
                  y: 0,
                }
          }
          transition={{ type: 'spring', damping: 25 }}
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
);
