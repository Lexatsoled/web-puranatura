import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OptimizedImage } from './OptimizedImage';
import debounce from 'lodash/debounce';
import { Product } from '../types';

interface SearchResult {
  type: 'product' | 'category' | 'suggestion';
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
  url: string;
  relevance?: number;
}

interface SearchBarProps {
  onSearch: (query: string) => Promise<SearchResult[]>;
  onResultClick: (result: SearchResult) => void;
  recentSearches?: string[];
  popularProducts?: Product[];
  categories?: { id: string; name: string; image?: string }[];
  isLoading?: boolean;
}

/**
 * SearchBar component for product/category search with accessibility and best practices.
 *
 * @component
 * @param {SearchBarProps} props - Props for SearchBar
 * @returns {JSX.Element}
 */
const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onResultClick,
  recentSearches = [],
  popularProducts = [],
  categories = [],
  isLoading = false,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Búsqueda con debounce
  const debouncedSearch = useMemo(
    () =>
      debounce(async (searchQuery: string) => {
        if (searchQuery.length >= 2) {
          const searchResults = await onSearch(searchQuery);
          setResults(searchResults);
          setIsOpen(true);
        } else {
          setResults([]);
        }
      }, 300),
    [onSearch, setResults, setIsOpen]
  );

  // Manejar cambios en la búsqueda
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  // Navegación con teclado
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0 && results[activeIndex]) {
          handleResultClick(results[activeIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  const handleResultClick = (result: SearchResult) => {
    onResultClick(result);
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={searchRef} role="search" aria-label="Buscar productos y categorías">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder="Buscar productos, categorías..."
          className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          aria-label="Campo de búsqueda"
          aria-autocomplete="list"
          {...(isOpen && results.length > 0 ? { 'aria-controls': 'searchbar-results' } : {})}
          {...(isOpen && activeIndex >= 0 && results[activeIndex] ? { 'aria-activedescendant': `searchbar-result-${results[activeIndex].id}` } : {})}
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
            id="searchbar-results"
            role="listbox"
            aria-label="Resultados de búsqueda"
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
                      {recentSearches.map((search, _index) => (
                        <button
                          key={`recent-${search}`}
                          onClick={() => setQuery(search)}
                          className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                          aria-label={`Buscar: ${search}`}
                          title={`Buscar: ${search}`}
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
                          key={`cat-${category.id}`}
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
                          aria-label={`Ir a categoría: ${category.name}`}
                          title={`Ir a categoría: ${category.name}`}
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
                          key={`prod-${product.id}`}
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
                          aria-label={`Ir a producto: ${product.name}`}
                          title={`Ir a producto: ${product.name}`}
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
                {results.map((result, _index) => (
                  <motion.button
                    key={result.id}
                    id={`searchbar-result-${result.id}`}
                    onClick={() => handleResultClick(result)}
                    className={`w-full flex items-center px-4 py-2 text-left ${
                      _index === activeIndex ? 'bg-gray-100' : 'hover:bg-gray-50'
                    }`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: _index * 0.05 }}
                    role="option"
                    aria-selected={_index === activeIndex ? "true" : "false"}
                    tabIndex={-1}
                    aria-label={result.title}
                    title={result.title}
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
              <div className="p-4 text-center text-gray-500" role="alert" aria-live="polite">
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
