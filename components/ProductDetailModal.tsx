import React, { useState } from 'react';
import { Product, ProductImage } from '../src/types/product';
import { useCart } from '../contexts/CartContext';
import ImageZoom from './ImageZoom';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    addToCart(product);
    onClose(); // Optionally close modal on add
  };

  const currentImage = product.images[selectedImage];

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col lg:flex-row overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full lg:w-1/2 p-6 flex flex-col items-center bg-gray-50">
          <div className="w-full max-w-md">
            <ImageZoom 
              src={currentImage.full} 
              alt={product.name}
              className="rounded-lg border border-gray-200"
              zoom={2}
            />
          </div>
          <div className="flex space-x-3 mt-8 overflow-x-auto pb-2 justify-center">
            {product.images.map((img: ProductImage, index: number) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative h-20 w-20 rounded-md flex items-center justify-center cursor-pointer transition-all duration-300 ${
                  selectedImage === index 
                    ? 'ring-2 ring-green-600 shadow-lg transform scale-105' 
                    : 'border border-gray-200 hover:border-green-400 hover:shadow'
                }`}
              >
                <img
                  src={img.thumbnail}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  className="h-16 w-16 object-contain p-1 bg-white"
                />
                {selectedImage === index && (
                  <span className="absolute inset-0 border-2 border-green-600 rounded-md pointer-events-none"></span>
                )}
              </button>
            ))}
          </div>
        </div>
        <div className="w-full lg:w-1/2 p-6 flex flex-col">
          <div className="flex-grow overflow-y-auto">
            <h2 className="text-3xl font-bold font-display text-gray-800 mb-2">
              {product.name}
            </h2>
            <p className="text-md text-gray-500 mb-4 capitalize">
              {product.categories ? product.categories.join(', ').replace(/-/g, ' ') : ''}
            </p>
            
            <div className="flex items-center gap-2 mb-6">
              <span className="text-green-600 font-semibold">✓</span>
              <span className="text-green-600 text-sm">En stock</span>
            </div>
            
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-600 leading-relaxed mb-6">
                {product.description}
              </p>
            </div>
          </div>
          
          <div className="mt-auto pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <p className="text-3xl font-bold text-green-700">
                  DOP ${product.price.toFixed(2)}
                </p>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <p className="text-lg text-gray-400 line-through">
                    DOP ${product.compareAtPrice.toFixed(2)}
                  </p>
                )}
              </div>
              <button
                onClick={handleAddToCart}
                className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors duration-300 shadow-md hover:shadow-lg"
              >
                Añadir al Carrito
              </button>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          title="Cerrar"
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-all duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ProductDetailModal;
