import { Product } from '../../../types/product';

export type SortOption =
  | 'name-asc'
  | 'name-desc'
  | 'price-asc'
  | 'price-desc'
  | 'default';

export type CategoryFilter = { categoryId: string; searchTerm: string };

export const applyCategory = (products: Product[], categoryId: string) =>
  categoryId === 'todos'
    ? products
    : products.filter((product) => product.category === categoryId);

export const applySearch = (products: Product[], term: string) => {
  if (!term) return products;
  const normalized = term.toLowerCase();
  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(normalized) ||
      product.description.toLowerCase().includes(normalized)
  );
};

export const sortProducts = (products: Product[], sortOption: SortOption) => {
  const sorted = [...products];
  const sorters: Record<SortOption, (a: Product, b: Product) => number> = {
    'name-asc': (a, b) => a.name.localeCompare(b.name),
    'name-desc': (a, b) => b.name.localeCompare(a.name),
    'price-asc': (a, b) => a.price - b.price,
    'price-desc': (a, b) => b.price - a.price,
    default: () => 0,
  };
  return sorted.sort(sorters[sortOption]);
};

export const paginate = (
  products: Product[],
  currentPage: number,
  itemsPerPage: number
) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  return products.slice(startIndex, startIndex + itemsPerPage);
};

export const computeProcessedProducts = (
  products: Product[],
  filters: CategoryFilter,
  sortOption: SortOption
) => {
  const byCategory = applyCategory(products, filters.categoryId);
  const bySearch = applySearch(byCategory, filters.searchTerm);
  return sortProducts(bySearch, sortOption);
};
