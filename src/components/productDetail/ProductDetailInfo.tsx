import React from 'react';
import { Product } from '../../types';

type Props = {
  product: Product;
  quantity: number;
  setQuantity: (value: number) => void;
  isAddingToCart: boolean;
  onAddToCart: () => Promise<void>;
};

export const ProductDetailInfo: React.FC<Props> = ({
  product,
  quantity,
  setQuantity,
  isAddingToCart,
  onAddToCart,
}) => (
  <div className="p-6 flex flex-col h-full overflow-y-auto">
    <div className="flex items-center gap-2 mb-2">
      <h2 className="text-2xl font-bold text-gray-800">{product.name}</h2>
    </div>
    <div className="mb-4">
      <div className="text-2xl font-semibold text-green-600">
        DOP ${product.price.toFixed(2)}
      </div>
      {product.inStock ? (
        <p className="text-sm mt-1 text-green-600">En stock</p>
      ) : (
        <p className="text-sm mt-1 text-red-600">Agotado</p>
      )}
    </div>

    <div className="prose prose-sm mb-6">
      <h3 className="text-lg font-semibold mb-2">Descripción</h3>
      <p className="text-gray-600">{product.description}</p>
    </div>

    {product.benefits && (
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Beneficios</h3>
        <ul className="list-disc list-inside text-gray-600 space-y-1">
          {product.benefits.map((benefit, index) => (
            <li key={index}>{benefit}</li>
          ))}
        </ul>
      </div>
    )}

    <div className="mt-auto">
      <div className="flex items-center space-x-4 mb-6">
        <label htmlFor="quantity" className="font-medium">
          Cantidad:
        </label>
        <div className="flex items-center border rounded-lg">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-3 py-2 text-gray-600 hover:text-gray-800"
            aria-label="Reducir cantidad"
          >
            -
          </button>
          <input
            type="number"
            id="quantity"
            min="1"
            value={quantity}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              setQuantity(value >= 1 ? value : 1);
            }}
            className="w-16 text-center border-x py-2"
          />
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="px-3 py-2 text-gray-600 hover:text-gray-800"
            aria-label="Aumentar cantidad"
          >
            +
          </button>
        </div>
      </div>

      <button
        onClick={onAddToCart}
        disabled={isAddingToCart || quantity <= 0}
        className={`w-full px-6 py-3 rounded-md font-semibold transition-colors duration-200 flex items-center justify-center ${
          isAddingToCart
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700 text-white'
        }`}
      >
        {isAddingToCart ? 'Agregando...' : 'Agregar al Carrito'}
      </button>
    </div>
  </div>
);
