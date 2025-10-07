import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import debounce from 'lodash/debounce';
import { Product, ProductCategory } from '../types/product';

interface FilterBarProps {
  products: Product[];
  categories: ProductCategory[];
  onFilterChange: (filteredProducts: Product[]) => void;
}

interface Filters {
  search: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  inStock: boolean;
  sortBy: 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';
}

const FilterBar: React.FC<FilterBarProps> = ({ products, categories: productCategories, onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    search: '',
    category: 'all',
    minPrice: 0,
    maxPrice: Math.max(...products.map((p) => p.price)),
    inStock: false,
    sortBy: 'name-asc',
  });

  // Función para obtener categorías hijas
  const getChildCategories = (parentId: string): string[] => {
    return productCategories
      .filter(cat => cat.parent === parentId)
      .map(cat => cat.id);
  };

  const categories = useMemo(() => {
    const cats = ['all'];
    const uniqueCats = new Set<string>();
    
    products.forEach(product => {
      if (product.categories) {
        product.categories.forEach((cat: string) => uniqueCats.add(cat));
      }
    });
    
    cats.push(...Array.from(uniqueCats));
    
    return cats.map((cat) => ({
      value: cat,
      label: cat === 'all' ? 'Todas las categorías' : cat,
    }));
  }, [products]);

  const debouncedFilter = useCallback(
    debounce((newFilters: Filters) => {
      let filtered = [...products];

      // Aplicar búsqueda
      if (newFilters.search) {
        const searchLower = newFilters.search.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.name.toLowerCase().includes(searchLower) ||
            p.description.toLowerCase().includes(searchLower)
        );
      }

      // Filtrar por categoría
      if (newFilters.category !== 'all') {
        // Obtener categorías hijas si es una categoría padre
        const childCategories = getChildCategories(newFilters.category);
        const categoriesToSearch = childCategories.length > 0 
          ? [...childCategories, newFilters.category] 
          : [newFilters.category];
          
        filtered = filtered.filter((p) => 
          p.categories && p.categories.some(cat => categoriesToSearch.includes(cat))
        );
      }

      // Filtrar por precio
      filtered = filtered.filter(
        (p) => p.price >= newFilters.minPrice && p.price <= newFilters.maxPrice
      );

      // Filtrar por stock
      if (newFilters.inStock) {
        filtered = filtered.filter((p) => p.stock > 0);
      }

      // Ordenar
      filtered.sort((a, b) => {
        switch (newFilters.sortBy) {
          case 'price-asc':
            return a.price - b.price;
          case 'price-desc':
            return b.price - a.price;
          case 'name-desc':
            return b.name.localeCompare(a.name);
          default:
            return a.name.localeCompare(b.name);
        }
      });

      onFilterChange(filtered);
    }, 300),
    [products, onFilterChange]
  );

  const handleFilterChange = (
    key: keyof Filters,
    value: string | number | boolean
  ) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    debouncedFilter(newFilters);
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="relative flex-grow max-w-xl">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="ml-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
        >
          <svg
            className="h-5 w-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
            />
          </svg>
          Filtros
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="bg-white p-4 rounded-lg shadow-sm border grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rango de Precio
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) =>
                      handleFilterChange('minPrice', Number(e.target.value))
                    }
                    min={0}
                    max={filters.maxPrice}
                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Min"
                  />
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) =>
                      handleFilterChange('maxPrice', Number(e.target.value))
                    }
                    min={filters.minPrice}
                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Max"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ordenar por
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) =>
                    handleFilterChange(
                      'sortBy',
                      e.target.value as Filters['sortBy']
                    )
                  }
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="name-asc">Nombre (A-Z)</option>
                  <option value="name-desc">Nombre (Z-A)</option>
                  <option value="price-asc">Precio (Menor a Mayor)</option>
                  <option value="price-desc">Precio (Mayor a Menor)</option>
                </select>
              </div>

              <div className="flex items-center">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.inStock}
                    onChange={(e) =>
                      handleFilterChange('inStock', e.target.checked)
                    }
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Solo productos en stock
                  </span>
                </label>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterBar;
