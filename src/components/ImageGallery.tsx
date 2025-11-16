import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OptimizedImage } from './OptimizedImage';
import useKeyPress from '../hooks/useKeyPress';

interface ProductImage {
  url: string;
  thumbnail: string;
  alt?: string;
}

interface ImageGalleryProps {
  images: ProductImage[];
  productName: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, productName }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);

  // Escuchar teclas para navegación
  useKeyPress('ArrowLeft', () => handlePrevImage());
  useKeyPress('ArrowRight', () => handleNextImage());
  useKeyPress('Escape', () => {
    setShowLightbox(false);
    setIsZoomed(false);
  });

  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const handleNextImage = () => {
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const handleMouseMove = useCallback(() => {
    if (isZoomed) {
      // Mouse position tracking for future zoom functionality
    }
  }, [isZoomed]);

  return (
    <div className="relative">
      {/* Imagen principal */}
      <div
        className="relative aspect-square rounded-lg overflow-hidden cursor-zoom-in"
        onClick={() => setShowLightbox(true)}
        onMouseMove={handleMouseMove}
      >
        <OptimizedImage
          src={images[currentImageIndex].url}
          alt={
            images[currentImageIndex].alt ||
            `${productName} - Imagen ${currentImageIndex + 1}`
          }
          className={`w-full h-full object-cover transition-transform duration-200 ${
            isZoomed ? 'scale-150' : ''
          }`}
          aspectRatio={1}
        />

        {/* Controles de navegación */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrevImage();
              }}
              className={`absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-2 transition-opacity ${
                currentImageIndex === 0
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-white'
              }`}
              disabled={currentImageIndex === 0}
              aria-label="Imagen anterior"
            >
              <svg
                className="w-6 h-6 text-gray-800"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNextImage();
              }}
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-2 transition-opacity ${
                currentImageIndex === images.length - 1
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-white'
              }`}
              disabled={currentImageIndex === images.length - 1}
              aria-label="Siguiente imagen"
            >
              <svg
                className="w-6 h-6 text-gray-800"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Miniaturas */}
      {images.length > 1 && (
        <div className="mt-4">
          <div className="flex space-x-2 overflow-x-auto pb-2 hide-scrollbar">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`relative flex-shrink-0 w-20 h-20 rounded-md overflow-hidden ${
                  currentImageIndex === index
                    ? 'ring-2 ring-green-500'
                    : 'ring-1 ring-gray-200'
                }`}
                aria-label={`Ver imagen ${index + 1}`}
              >
                <OptimizedImage
                  src={image.thumbnail}
                  alt={image.alt || `${productName} - Miniatura ${index + 1}`}
                  className="w-full h-full object-cover"
                  aspectRatio={1}
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {showLightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
            onClick={() => setShowLightbox(false)}
          >
            <div
              className="relative max-w-4xl w-full h-full flex items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full aspect-square">
                <OptimizedImage
                  src={images[currentImageIndex].url}
                  alt={
                    images[currentImageIndex].alt ||
                    `${productName} - Imagen ${currentImageIndex + 1}`
                  }
                  className="w-full h-full object-contain"
                  aspectRatio={1}
                />
              </div>

              {/* Controles del lightbox */}
              <button
                onClick={() => setShowLightbox(false)}
                className="absolute top-4 right-4 text-white hover:text-gray-300"
                aria-label="Cerrar"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {currentImageIndex > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevImage();
                  }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
                  aria-label="Imagen anterior"
                >
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
              )}

              {currentImageIndex < images.length - 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextImage();
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
                  aria-label="Siguiente imagen"
                >
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default ImageGallery;
