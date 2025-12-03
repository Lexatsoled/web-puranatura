import React from 'react';
import { OptimizedImage } from '../OptimizedImage';
import { SearchResult } from '../../hooks/useSearchBar';
import { Product } from '../../types';
import { Category } from './SearchBar.types';

type Props = {
  query: string;
  recentSearches: string[];
  popularProducts: Product[];
  categories: Category[];
  setQuery: (q: string) => void;
  onResultClick: (r: SearchResult) => void;
};

export const SearchBarSuggestions: React.FC<Props> = ({
  query,
  recentSearches,
  popularProducts,
  categories,
  setQuery,
  onResultClick,
}) => {
  if (query.length >= 2) return null;

  return (
    <div>
      {recentSearches.length > 0 && (
        <div className="p-4 border-b">
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            Búsquedas recientes
          </h3>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((search, index) => (
              <button
                key={index}
                onClick={() => setQuery(search)}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
              >
                {search}
              </button>
            ))}
          </div>
        </div>
      )}

      {categories.length > 0 && (
        <div className="p-4 border-b">
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            Categorías populares
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() =>
                  onResultClick({
                    type: 'category',
                    id: category.id,
                    title: category.name,
                    image: category.image,
                    url: `/category/${category.id}`,
                  })
                }
                className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {category.image && (
                  <div className="w-10 h-10 rounded-lg overflow-hidden mr-3">
                    <OptimizedImage
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover"
                      aspectRatio={1}
                    />
                  </div>
                )}
                <span className="text-sm text-gray-700">{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {popularProducts.length > 0 && (
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            Productos populares
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {popularProducts.map((product) => (
              <button
                key={product.id}
                onClick={() =>
                  onResultClick({
                    type: 'product',
                    id: product.id,
                    title: product.name,
                    subtitle: `DOP $${product.price.toFixed(2)}`,
                    image: product.images[0].thumbnail,
                    url: `/product/${product.id}`,
                  })
                }
                className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-12 h-12 rounded-lg overflow-hidden mr-3">
                  <OptimizedImage
                    src={product.images[0].thumbnail}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    aspectRatio={1}
                  />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-sm text-gray-700">{product.name}</div>
                  <div className="text-sm text-green-600 font-medium">
                    DOP ${product.price.toFixed(2)}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
