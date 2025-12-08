import React from 'react';
// Use CSS transitions instead of framer-motion for list rows
import { formatCurrency } from '../../../utils/intl';
import { WishlistItem } from '../useWishlistPage';

type Props = {
  item: WishlistItem;
  selected: boolean;
  onToggleSelect: (id: string) => void;
  onAddToCart: (item: WishlistItem) => void;
  onRemove: (id: string) => void;
  formatDate: (date: Date) => string;
};

export const WishlistItemRow: React.FC<Props> = ({
  item,
  selected,
  onToggleSelect,
  onAddToCart,
  onRemove,
  formatDate,
}) => (
  <div
    key={item.id}
    className={`flex items-center gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow transform-gpu ${
      selected ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
    }`}
  >
    <input
      type="checkbox"
      checked={selected}
      onChange={() => onToggleSelect(item.id)}
      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
    />

    <div className="flex-shrink-0">
      <img
        src={item.image}
        alt={item.name}
        className="w-20 h-20 object-cover rounded-lg"
        loading="lazy"
        decoding="async"
        width={80}
        height={80}
      />
    </div>

    <div className="flex-grow">
      <h3 className="font-semibold text-gray-900">{item.name}</h3>
      <p className="text-sm text-gray-600">{item.category}</p>
      <p className="text-xs text-gray-500 mt-1">
        Agregado el {formatDate(item.addedDate)}
      </p>

      <div className="flex items-center gap-2 mt-2">
        <span className="text-lg font-bold text-green-700">
          {formatCurrency(item.price)}
        </span>
        {item.originalPrice && (
          <span className="text-sm text-gray-500 line-through">
            {formatCurrency(item.originalPrice)}
          </span>
        )}

        {!item.inStock && (
          <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
            Agotado
          </span>
        )}
      </div>
    </div>

    <div className="flex items-center gap-2">
      <button
        onClick={() => onAddToCart(item)}
        disabled={!item.inStock}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
          item.inStock
            ? 'bg-green-600 text-white hover:bg-green-700'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        {item.inStock ? 'Agregar al carrito' : 'No disponible'}
      </button>

      <button
        onClick={() => onRemove(item.id)}
        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
        title="Eliminar de la lista de deseos"
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
