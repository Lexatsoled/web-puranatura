import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OptimizedImage } from './OptimizedImage';
import { ProductImage } from '../types/product';

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  images,
  productName,
}) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;

    const bounds = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - bounds.left) / bounds.width) * 100;
    const y = ((e.clientY - bounds.top) / bounds.height) * 100;
    setMousePosition({ x: x - 50, y: y - 50 });
  }, [isZoomed]);

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="space-y-4">
      {/* Imagen Principal */}
      <div 
        className={`relative aspect-square rounded-lg overflow-hidden bg-gray-100 ${
          isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
        }`}
        onClick={() => setIsZoomed(!isZoomed)}
        onMouseMove={handleMouseMove}
      >
        <motion.div
          className="w-full h-full"
          animate={isZoomed ? {
            scale: 2,
            x: mousePosition.x * -1,
            y: mousePosition.y * -1,
          } : {
            scale: 1,
            x: 0,
            y: 0,
          }}
          transition={{ type: 'spring', damping: 25 }}
        >
          <OptimizedImage
            src={images[selectedImage].full}
            alt={`${productName} - Imagen ${selectedImage + 1}`}
            className="w-full h-full object-cover"
            priority={selectedImage === 0}
            aspectRatio={1}
            blur={true}
          />
        </motion.div>

        {/* Controles de navegación */}
        {images.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 hover:opacity-100 transition-opacity">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </motion.button>
          </div>
        )}
      </div>

      {/* Miniaturas */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {images.map((image, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedImage(index)}
              className={`relative aspect-square rounded-md overflow-hidden 
                ${selectedImage === index 
                  ? 'ring-2 ring-green-500' 
                  : 'ring-1 ring-gray-200 hover:ring-green-300'
                }`}
            >
              <OptimizedImage
                src={image.thumbnail || image.full}
                alt={`${productName} - Miniatura ${index + 1}`}
                className="w-full h-full object-cover"
                aspectRatio={1}
                blur={true}
              />
              {selectedImage === index && (
                <div className="absolute inset-0 bg-white bg-opacity-20" />
              )}
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
};
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative aspect-square rounded-md overflow-hidden ${
                selectedImage === index
                  ? 'ring-2 ring-green-500'
                  : 'ring-1 ring-gray-200'
              }`}
            >
              <OptimizedImage
                src={image.thumbnail}
                alt={`${productName} - Miniatura ${index + 1}`}
                className="w-full h-full"
                aspectRatio={1}
                blur={true}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
