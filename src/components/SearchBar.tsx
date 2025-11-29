import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OptimizedImage } from './OptimizedImage';
import useSearchBar, { SearchResult } from '../hooks/useSearchBar';
import { Product } from '../types';

interface SearchBarProps {
  onSearch: (query: string) => Promise<SearchResult[]>;
  onResultClick: (result: SearchResult) => void;
  recentSearches?: string[];
  popularProducts?: Product[];
  categories?: { id: string; name: string; image?: string }[];
  isLoading?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onResultClick,
  recentSearches = [],
  popularProducts = [],
  categories = [],
}) => {
  // delegate all behavior to the hook for clarity / testability
  const {
    query,
    setQuery,
    results,
    isOpen,
    isLoading,
    activeIndex,
    searchRef,
    handleSearchChange,
    handleKeyDown,
    handleResultClick,
    setIsOpen,
  } = useSearchBar({ onSearch, onResultClick });

  // All behaviour (outside clicks, debounced search and keyboard navigation)
  // is handled by the useSearchBar hook.

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearchChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder="Buscar productos, categorías..."
          className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          aria-label="Campo de búsqueda"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className={`w-6 h-6 ${
              isLoading ? 'text-green-500 animate-spin' : 'text-gray-400'
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isLoading ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            )}
          </svg>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 max-h-[80vh] overflow-y-auto"
          >
            {query.length < 2 ? (
              // Mostrar búsquedas recientes y productos populares
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
                            handleResultClick({
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
                          <span className="text-sm text-gray-700">
                            {category.name}
                          </span>
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
                            handleResultClick({
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
                            <div className="text-sm text-gray-700">
                              {product.name}
                            </div>
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
            ) : results.length > 0 ? (
              // Mostrar resultados de búsqueda
              <div className="py-2">
                {results.map((result, index) => (
                  <motion.button
                    key={result.id}
                    onClick={() => handleResultClick(result)}
                    className={`w-full flex items-center px-4 py-2 text-left ${
                      index === activeIndex ? 'bg-gray-100' : 'hover:bg-gray-50'
                    }`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {result.image && (
                      <div className="w-10 h-10 rounded-lg overflow-hidden mr-3">
                        <OptimizedImage
                          src={result.image}
                          alt={result.title}
                          className="w-full h-full object-cover"
                          aspectRatio={1}
                        />
                      </div>
                    )}
                    <div>
                      <div className="text-sm text-gray-700">
                        {result.title}
                      </div>
                      {result.subtitle && (
                        <div className="text-xs text-gray-500">
                          {result.subtitle}
                        </div>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            ) : (
              // Mostrar mensaje de no resultados
              <div className="p-4 text-center text-gray-500">
                No se encontraron resultados para "{query}"
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
