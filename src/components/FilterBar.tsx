import React, { useCallback, useMemo, useState } from 'react';
// Use CSS to show/hide the filter controls instead of framer-motion
import { debounce } from '../utils/debounce';
import { Product } from '../types';
import { applyFilters, defaultFilters } from './filters/FilterBar.helpers';
import { FilterControls } from './filters/FilterControls';
import { Filters } from './filters/FilterBar.types';

interface FilterBarProps {
  products: Product[];
  onFilterChange: (filteredProducts: Product[]) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ products, onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>(defaultFilters);

  const debouncedFilter = useMemo(
    () =>
      debounce((newFilters: Filters) => {
        const filtered = applyFilters(products, newFilters);
        onFilterChange(filtered);
      }, 300),
    [onFilterChange, products]
  );

  const handleFilterChange = useCallback(
    (newFilters: Filters) => {
      setFilters(newFilters);
      debouncedFilter(newFilters);
    },
    [debouncedFilter]
  );

  const resultCount = useMemo(
    () => applyFilters(products, filters).length,
    [filters, products]
  );

  return (
    <div className="bg-white rounded-lg shadow-sm mb-6">
      <div className="flex justify-between items-center p-4">
        <h2 className="text-lg font-medium text-gray-900">Filtros</h2>
        <div className="text-sm text-gray-600">{resultCount} resultados</div>
        <button
          className="text-green-600 hover:text-green-700"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? 'Ocultar filtros' : 'Mostrar filtros'}
        </button>
      </div>

      {isOpen && (
        <div className="p-4 border-t border-gray-200">
          <FilterControls filters={filters} onChange={handleFilterChange} />
        </div>
      )}
    </div>
  );
};

export default FilterBar;
