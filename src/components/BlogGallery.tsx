import React, { useState } from 'react';
import { OptimizedImage } from './OptimizedImage';

interface BlogGalleryProps {
  images: string[];
  alt: string;
}

export const BlogGallery: React.FC<BlogGalleryProps> = ({ images, alt }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const handleImageClick = () => {
    setIsZoomed(!isZoomed);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  if (images.length === 0) return null;

  return (
    <>
      <div className="space-y-4">
        {/* Imagen Principal */}
        <div
          className={`relative rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${
            isZoomed ? 'fixed inset-0 z-50 bg-black/90 p-4' : ''
          }`}
          onClick={handleImageClick}
        >
          <OptimizedImage
            src={images[selectedImage]}
            alt={`${alt} - Imagen ${selectedImage + 1}`}
            className={`w-full h-full ${
              isZoomed ? 'object-contain' : 'object-cover'
            }`}
            aspectRatio={isZoomed ? undefined : 16 / 9}
            blur={true}
          />

          {isZoomed && images.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-2 rounded-full transition-colors"
              >
                ←
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-2 rounded-full transition-colors"
              >
                →
              </button>
              <button
                onClick={() => setIsZoomed(false)}
                className="absolute top-4 right-4 text-white bg-black/30 rounded-full p-2 hover:bg-black/50 transition-colors"
              >
                ✕
              </button>
            </>
          )}
        </div>

        {/* Miniaturas */}
        {images.length > 1 && !isZoomed && (
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative aspect-video rounded-md overflow-hidden ${
                  selectedImage === index
                    ? 'ring-2 ring-green-500'
                    : 'ring-1 ring-gray-200'
                }`}
              >
                <OptimizedImage
                  src={image}
                  alt={`${alt} - Miniatura ${index + 1}`}
                  className="w-full h-full"
                  aspectRatio={16 / 9}
                  blur={true}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Overlay de zoom */}
      {isZoomed && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={() => setIsZoomed(false)}
        />
      )}
    </>
  );
};

export default BlogGallery;
