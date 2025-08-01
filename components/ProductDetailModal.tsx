import React, { useState } from 'react';
import { Product } from '../types';
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
        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full md:w-1/2 p-4 flex flex-col items-center">
          <ImageZoom src={currentImage.full} alt={product.name} />
          <div className="flex space-x-2 mt-4">
            {product.images.map((img, index) => (
              <img
                key={index}
                src={img.thumbnail}
                alt={`${product.name} thumbnail ${index + 1}`}
                className={`w-16 h-16 object-cover rounded-md cursor-pointer border-2 ${selectedImage === index ? 'border-green-600' : 'border-transparent'}`}
                onClick={() => setSelectedImage(index)}
              />
            ))}
          </div>
        </div>
        <div className="w-full md:w-1/2 p-6 flex flex-col">
          <div className="flex-grow overflow-y-auto">
            <h2 className="text-3xl font-bold font-display text-gray-800">
              {product.name}
            </h2>
            <p className="text-md text-gray-500 mt-1 mb-4">
              {product.category}
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              {product.description}
            </p>
          </div>
          <div className="mt-auto pt-4 border-t">
            <div className="flex justify-between items-center">
              <p className="text-3xl font-bold text-green-700">
                DOP ${product.price.toFixed(2)}
              </p>
              <button
                onClick={handleAddToCart}
                className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors duration-300"
              >
                Añadir al Carrito
              </button>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
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
