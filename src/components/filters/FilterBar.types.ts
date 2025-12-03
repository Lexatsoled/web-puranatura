import { Product } from '../../types';

export interface Filters {
  search: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  inStock: boolean;
}

export interface FilterBarProps {
  products: Product[];
  onFilterChange: (filteredProducts: Product[]) => void;
}
