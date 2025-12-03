import { Product } from '../../types';
import { Filters } from './FilterBar.types';

export const defaultFilters: Filters = {
  search: '',
  category: '',
  minPrice: 0,
  maxPrice: Infinity,
  inStock: false,
};

export const applyFilters = (products: Product[], filters: Filters) => {
  const searchText = filters.search.toLowerCase();
  return products.filter((product) => {
    const matchesSearch =
      !searchText ||
      product.name.toLowerCase().includes(searchText) ||
      product.description.toLowerCase().includes(searchText);

    const matchesCategory =
      !filters.category || product.category === filters.category;

    const matchesPrice =
      product.price >= filters.minPrice && product.price <= filters.maxPrice;

    const matchesStock = !filters.inStock || product.inStock;

    return matchesSearch && matchesCategory && matchesPrice && matchesStock;
  });
};
