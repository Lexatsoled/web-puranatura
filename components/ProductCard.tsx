import React from 'react';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { formatCurrency } from '../src/utils/intl';
import { DEFAULT_PRODUCT_IMAGE } from '@/src/constants/images';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewDetails,
}) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  // defensive: product.images might be undefined or empty — use safe access + fallback
  const cardImageUrl =
    product?.images?.[1]?.full ??
    product?.images?.[0]?.full ??
    DEFAULT_PRODUCT_IMAGE;
  const isProductInWishlist = isInWishlist(product.id);

  return (
    <div
      data-testid={`product-card-${product.id}`}
      className={`product-card bg-white rounded-lg shadow-md overflow-hidden group cursor-pointer transform hover:-translate-y-1 transition-all duration-300 flex flex-col`}
      onClick={() => onViewDetails(product)}
    >
      <div className="relative h-56 bg-gray-100 flex items-center justify-center">
        <img
          src={cardImageUrl}
          alt={product.name}
          className="w-full h-full object-contain p-2"
          loading="lazy"
          decoding="async"
          width={320}
          height={224}
        />
        <div className="absolute inset-0 bg-black bg-opacity-10 group-hover:bg-opacity-0 transition-all duration-300"></div>

        {/* Botón de wishlist */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-300 ${
            isProductInWishlist
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
          }`}
          title={
            isProductInWishlist
              ? 'Quitar de lista de deseos'
              : 'Agregar a lista de deseos'
          }
        >
          <svg
            className="w-5 h-5"
            fill={isProductInWishlist ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-800 truncate">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 mb-3">{product.category}</p>
        <div className="mt-auto flex justify-between items-center">
          <p className="text-xl font-bold text-green-700">
            {formatCurrency(product.price)}
          </p>
          <button
            onClick={handleAddToCart}
            data-testid="add-to-cart"
            className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-green-700 transition-colors duration-300"
          >
            Añadir
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
