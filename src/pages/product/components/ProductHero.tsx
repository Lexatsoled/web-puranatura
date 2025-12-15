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

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
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
        <button
          type="button"
          className={`aspect-w-1 aspect-h-1 bg-gray-100 rounded-lg overflow-hidden relative w-full h-full p-0 border-0 ${
            isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
          }`}
          onClick={() => setIsZoomed(!isZoomed)}
          aria-label={isZoomed ? 'Alejar imagen' : 'Acercar imagen'}
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
        </button>
      </div>
      <div className="flex space-x-4 overflow-x-auto pb-2">
        {product.images?.map((image: ProductImage, idx: number) => (
          <button
            key={idx}
            type="button"
            onClick={() => setSelectedImage(idx)}
            className={`relative h-20 w-20 rounded-md overflow-hidden cursor-pointer border-2 p-0 bg-transparent ${
              selectedImage === idx
                ? 'border-primary'
                : 'border-transparent hover:border-green-300'
            }`}
            aria-label={`Ver imagen ${idx + 1}`}
            aria-current={selectedImage === idx}
          >
            <OptimizedImage
              src={image.thumbnail}
              alt={`${product.name} - Vista ${idx + 1}`}
            />
          </button>
        ))}
      </div>
    </div>
  );
};
