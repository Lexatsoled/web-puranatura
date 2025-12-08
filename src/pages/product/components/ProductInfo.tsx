import React, { useState } from 'react';
import { Product } from '../../../types/product';
import { useCartStore } from '../../../store/cartStore';

interface ProductInfoProps {
  product: Product;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCartStore();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    // Simulate async if needed, or just add
    await new Promise((resolve) => setTimeout(resolve, 300));
    addToCart(product, quantity);
    setIsAdding(false);
    // Show notification logic ideally via context/store
  };

  return (
    <div className="flex flex-col h-full">
      <h1 className="text-3xl font-bold font-display text-gray-900 mb-4">
        {product.name}
      </h1>

      <div className="mb-6">
        <span className="text-3xl font-bold text-green-700">
          €{product.price.toFixed(2)}
        </span>
        <div
          className={`mt-2 text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}
        >
          {product.stock > 0 ? 'En Stock' : 'Agotado'}
        </div>
      </div>

      <div className="prose prose-green mb-8 text-gray-600">
        <p>{product.description}</p>
      </div>

      {product.benefits && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Beneficios Principal</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            {product.benefits.map((benefit, index) => (
              <li key={index}>{benefit}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-auto border-t pt-6">
        <div className="flex items-center space-x-4 mb-6">
          <label htmlFor="quantity" className="font-medium text-gray-700">
            Cantidad:
          </label>
          <div className="flex items-center border rounded-md">
            <button
              className="px-3 py-1 text-gray-600 hover:bg-gray-100"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              -
            </button>
            <input
              type="number"
              id="quantity"
              min="1"
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, parseInt(e.target.value) || 1))
              }
              className="w-12 text-center border-none focus:ring-0"
            />
            <button
              className="px-3 py-1 text-gray-600 hover:bg-gray-100"
              onClick={() => setQuantity(quantity + 1)}
            >
              +
            </button>
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={isAdding || product.stock === 0}
          className={`w-full py-4 px-8 rounded-lg text-lg font-semibold text-white transition-colors ${
            isAdding || product.stock === 0
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl'
          }`}
        >
          {isAdding
            ? 'Agregando...'
            : product.stock === 0
              ? 'Agotado'
              : 'Añadir al Carrito'}
        </button>
      </div>
    </div>
  );
};
