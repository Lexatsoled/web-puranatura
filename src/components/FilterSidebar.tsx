import React, { useState } from 'react';
import type { SortOption } from '../types/product';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '../store/uiStore';

const FilterSidebar: React.FC = () => {
  const {
    productFilters,
    toggleCategory,
    setPriceRange,
    setSortBy,
    toggleInStock,
    toggleOnSale,
    addTag,
    removeTag,
    resetFilters,
    setIsFilterOpen,
    isFilterOpen,
  } = useUIStore();

  const [priceMin, setPriceMin] = useState(productFilters.priceRange[0]);
  const [priceMax, setPriceMax] = useState(productFilters.priceRange[1]);
  const [newTag, setNewTag] = useState('');

  const categories = [
    'Suplementos',
    'Vitaminas',
    'Hierbas Medicinales',
    'Aceites Esenciales',
    'Productos Naturales',
    'Homeopatía',
    'Tés e Infusiones',
    'Cuidado Personal',
  ];

  const sortOptions = [
    { value: 'default', label: 'Relevancia' },
    { value: 'name-asc', label: 'Nombre A-Z' },
    { value: 'name-desc', label: 'Nombre Z-A' },
    { value: 'price-asc', label: 'Precio menor a mayor' },
    { value: 'price-desc', label: 'Precio mayor a menor' },
  ];

  const handlePriceRangeChange = () => {
    if (priceMin <= priceMax) {
      setPriceRange([priceMin, priceMax]);
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !productFilters.tags.includes(newTag.trim())) {
      addTag(newTag.trim());
      setNewTag('');
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsFilterOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Filter sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: isFilterOpen ? 0 : -300 }}
        className="fixed lg:relative top-0 left-0 h-full lg:h-auto w-80 lg:w-full bg-white shadow-lg lg:shadow-none z-50 lg:z-auto overflow-y-auto"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
            <div className="flex gap-2">
              <button
                onClick={resetFilters}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Limpiar
              </button>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="lg:hidden p-1 hover:bg-gray-100 rounded"
                title="Cerrar filtros"
                aria-label="Cerrar panel de filtros"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Sort */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ordenar por
            </label>
            <select
              value={productFilters.sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              aria-label="Ordenar productos por"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Categories */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Categorías
            </h4>
            <div className="space-y-2">
              {categories.map((category) => (
                <label key={category} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={productFilters.categories.includes(category)}
                    onChange={() => toggleCategory(category)}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">{category}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Rango de Precio
            </h4>
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Mín"
                  value={priceMin}
                  onChange={(e) => setPriceMin(Number(e.target.value))}
                  onBlur={handlePriceRangeChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
                <input
                  type="number"
                  placeholder="Máx"
                  value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  onBlur={handlePriceRangeChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div className="text-xs text-gray-500">
                DOP ${productFilters.priceRange[0]} - DOP $
                {productFilters.priceRange[1]}
              </div>
            </div>
          </div>

          {/* Stock & Sale filters */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Disponibilidad
            </h4>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={productFilters.inStock}
                  onChange={toggleInStock}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="ml-2 text-sm text-gray-600">
                  Solo en stock
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={productFilters.onSale}
                  onChange={toggleOnSale}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="ml-2 text-sm text-gray-600">En oferta</span>
              </label>
            </div>
          </div>

          {/* Tags */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Etiquetas
            </h4>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="Añadir etiqueta"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              />
              <button
                onClick={handleAddTag}
                className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                +
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {productFilters.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="ml-1 text-green-600 hover:text-green-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default FilterSidebar;
