import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useSearchBar from '../hooks/useSearchBar';
import { SearchResult } from '../hooks/useSearchBar';
import { SearchBarProps } from './search/SearchBar.types';
import { SearchBarSuggestions } from './search/SearchBarSuggestions';
import { SearchResultsList } from './search/SearchResultsList';

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onResultClick,
  recentSearches = [],
  popularProducts = [],
  categories = [],
}) => {
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

  const renderContent = () => {
    if (query.length < 2) {
      return (
        <SearchBarSuggestions
          query={query}
          recentSearches={recentSearches}
          popularProducts={popularProducts}
          categories={categories}
          setQuery={setQuery}
          onResultClick={handleResultClick}
        />
      );
    }

    if (results.length > 0) {
      return (
        <SearchResultsList
          results={results}
          activeIndex={activeIndex}
          onSelect={handleResultClick as (r: SearchResult) => void}
        />
      );
    }

    return (
      <div className="p-4 text-center text-gray-500">
        No se encontraron resultados para "{query}"
      </div>
    );
  };

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
            className={`w-6 h-6 ${isLoading ? 'text-green-500 animate-spin' : 'text-gray-400'}`}
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
            {renderContent()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
