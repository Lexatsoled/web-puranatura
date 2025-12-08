import React, { useState } from 'react';
import { Product, ProductImage } from '../../../types/product';
import { OptimizedImage } from '../../../components/OptimizedImage'; // Adjust path if needed
const DEFAULT_IMAGE = '/placeholder.jpg';

interface ProductHeroProps {
  product: Product;
}

export const ProductHero: React.FC<ProductHeroProps> = ({ product }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePosition({ x, y });
  };

  return (
    <div className="relative flex flex-col">
      <div className="relative flex-grow mb-4">
        <div
          className={`aspect-w-1 aspect-h-1 bg-gray-100 rounded-lg overflow-hidden relative ${
            isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
          }`}
          onClick={() => setIsZoomed(!isZoomed)}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setIsZoomed(false)}
        >
          <div
            className="w-full h-full"
            style={{
              transform: isZoomed
                ? `scale(2) translate(${50 - mousePosition.x}%, ${50 - mousePosition.y}%)`
                : 'scale(1) translate(0, 0)',
              transition: 'transform 0.1s ease-out',
              transformOrigin: 'center center',
            }}
          >
            <OptimizedImage
              src={
                product.images?.[selectedImage]?.full ??
                product.images?.[0]?.full ??
                DEFAULT_IMAGE
              }
              alt={product.name}
              className="object-contain rounded-lg w-full h-full"
              priority={selectedImage === 0}
            />
          </div>
        </div>
      </div>
      <div className="flex space-x-4 overflow-x-auto pb-2">
        {product.images?.map((image: ProductImage, index: number) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all ${
              selectedImage === index
                ? 'border-green-500'
                : 'border-transparent hover:border-green-300'
            }`}
          >
            <OptimizedImage
              src={image.thumbnail}
              alt={`${product.name} - Vista ${index + 1}`}
              className="object-cover w-full h-full"
            />
          </button>
        ))}
      </div>
    </div>
  );
};
