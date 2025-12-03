import React, { useMemo } from 'react';
import { Filters } from './FilterBar.types';

type Props = {
  filters: Filters;
  onChange: (filters: Filters) => void;
};

export const FilterControls: React.FC<Props> = ({ filters, onChange }) => {
  const priceRange = useMemo(
    () => ({
      min: filters.minPrice,
      max: filters.maxPrice,
    }),
    [filters.minPrice, filters.maxPrice]
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <input
        type="text"
        placeholder="Buscar productos..."
        className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        value={filters.search}
        onChange={(e) => onChange({ ...filters, search: e.target.value })}
      />

      <select
        className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        value={filters.category}
        onChange={(e) => onChange({ ...filters, category: e.target.value })}
      >
        <option value="">Todas las categorías</option>
        {/* Las categorías se pueden inyectar desde el padre si es necesario */}
      </select>

      <div className="flex items-center space-x-2">
        <input
          type="number"
          placeholder="Precio mínimo"
          className="w-1/2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          value={priceRange.min}
          onChange={(e) =>
            onChange({ ...filters, minPrice: Number(e.target.value) })
          }
        />
        <input
          type="number"
          placeholder="Precio máximo"
          className="w-1/2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          value={priceRange.max}
          onChange={(e) =>
            onChange({ ...filters, maxPrice: Number(e.target.value) })
          }
        />
      </div>

      <label className="inline-flex items-center">
        <input
          type="checkbox"
          className="form-checkbox h-5 w-5 text-green-600"
          checked={filters.inStock}
          onChange={(e) => onChange({ ...filters, inStock: e.target.checked })}
        />
        <span className="ml-2 text-sm text-gray-700">Solo en stock</span>
      </label>
    </div>
  );
};
