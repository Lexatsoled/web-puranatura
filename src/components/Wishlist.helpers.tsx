import React from 'react';
// Using CSS-based transitions for wishlist items instead of framer-motion
import { Product } from '../types';
import { OptimizedImage } from './OptimizedImage';
import { DEFAULT_PRODUCT_IMAGE } from '@/src/constants/images';

// Layout/animation behavior replaced with CSS classes

export const WishlistSkeleton: React.FC = () => (
  <div className="p-6 bg-white rounded-xl shadow-lg">
    <div className="animate-pulse space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex space-x-4">
          <div className="w-24 h-24 bg-gray-200 rounded-lg"></div>
          <div className="flex-1 space-y-2 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const WishlistEmptyState: React.FC = () => (
  <div className="text-center py-12">
    <svg
      className="w-16 h-16 mx-auto text-gray-400 mb-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1}
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    </svg>
    <h3 className="text-lg font-medium text-gray-900 mb-2">
      Tu lista de deseos está vacía
    </h3>
    <p className="text-gray-500">
      Explora nuestros productos y guarda tus favoritos aquí
    </p>
  </div>
);

export interface WishlistHeaderProps {
  count: number;
  isAllSelected: boolean;
  onToggleSelectAll: () => void;
  onShare?: () => void;
}

export const WishlistHeader: React.FC<WishlistHeaderProps> = ({
  count,
  isAllSelected,
  onToggleSelectAll,
  onShare,
}) => (
  <div className="flex items-center justify-between mb-6">
    <h2 className="text-2xl font-bold text-gray-800">
      Lista de Deseos ({count})
    </h2>
    {count > 0 && (
      <div className="flex items-center space-x-4">
        <button
          onClick={onToggleSelectAll}
          className="text-sm text-gray-600 hover:text-gray-800"
        >
          {isAllSelected ? 'Deseleccionar Todo' : 'Seleccionar Todo'}
        </button>
        {onShare && (
          <button
            onClick={onShare}
            className="text-green-600 hover:text-green-700"
            aria-label="Compartir lista de deseos"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
          </button>
        )}
      </div>
    )}
  </div>
);

export interface WishlistItemProps {
  item: Product;
  isSelected: boolean;
  onToggle: () => void;
  onMoveToCart: (item: Product) => void;
  onRemove: (id: string) => void;
}

export const WishlistItem: React.FC<WishlistItemProps> = ({
  item,
  isSelected,
  onToggle,
  onMoveToCart,
  onRemove,
}) => (
  <div className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors transform-gpu will-change-transform">
    <input
      type="checkbox"
      checked={isSelected}
      onChange={onToggle}
      className="h-4 w-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
    />
    <div className="ml-4 w-20 h-20 relative flex-shrink-0">
      <OptimizedImage
        src={item?.images?.[0]?.thumbnail ?? DEFAULT_PRODUCT_IMAGE}
        alt={item.name}
        className="rounded-md object-cover"
        aspectRatio={1}
      />
    </div>
    <div className="ml-4 flex-grow">
      <h3 className="font-medium text-gray-900">{item.name}</h3>
      <p className="text-sm text-gray-500 line-clamp-1">{item.description}</p>
      <div className="mt-1 text-lg font-semibold text-green-600">
        DOP ${item.price.toFixed(2)}
      </div>
    </div>
    <div className="ml-4 flex items-center space-x-2">
      <button
        onClick={() => onMoveToCart(item)}
        className="p-2 text-green-600 hover:text-green-700 transition-colors"
        aria-label="Mover al carrito"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      </button>
      <button
        onClick={() => onRemove(item.id)}
        className="p-2 text-red-600 hover:text-red-700 transition-colors"
        aria-label="Eliminar de la lista"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </div>
  </div>
);

export interface WishlistActionsProps {
  count: number;
  onMoveSelected: () => void;
}

export const WishlistActions: React.FC<WishlistActionsProps> = ({
  count,
  onMoveSelected,
}) => (
  <div className="mt-6 flex justify-end transition-transform duration-150 ease-out">
    <button
      onClick={onMoveSelected}
      className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
      <span>
        Mover {count} {count === 1 ? 'item' : 'items'} al carrito
      </span>
    </button>
  </div>
);
