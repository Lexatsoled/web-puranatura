import { useEffect, useMemo, useRef, useState } from 'react';
import { Product } from '../../src/types/product';
import { sanitizeProductContent } from '../../src/utils/contentSanitizers';
import { useApi } from '../../src/utils/api';
import { mapApiProduct, ApiProduct } from '../../src/utils/productMapper';

export type SortOption =
  | 'name-asc'
  | 'name-desc'
  | 'price-asc'
  | 'price-desc'
  | 'default';

export type Category = { id: string; name: string };

const DEFAULT_CATEGORY: Category = { id: 'todos', name: 'Todas' };

const applyCategory = (products: Product[], categoryId: string) =>
  categoryId === 'todos'
    ? products
    : products.filter((product) => product.category === categoryId);

const applySearch = (products: Product[], term: string) => {
  if (!term) return products;
  const normalized = term.toLowerCase();
  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(normalized) ||
      product.description.toLowerCase().includes(normalized)
  );
};

const sortProducts = (products: Product[], sortOption: SortOption) => {
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

const paginate = (
  products: Product[],
  currentPage: number,
  itemsPerPage: number
) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  return products.slice(startIndex, startIndex + itemsPerPage);
};

export const useStorePage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('default');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [products, setProducts] = useState<Product[]>([]);
  const [productCategories, setProductCategories] = useState<Category[]>([
    DEFAULT_CATEGORY,
  ]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const api = useApi();
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) {
      setIsLoadingProducts(false);
      return;
    }
    hasFetched.current = true;

    const applyFallback = async () => {
      const fallbackModule = await import('../../data/products.ts');
      const fallbackProducts = fallbackModule.products.map((product) =>
        sanitizeProductContent(product)
      );
      const merged = [DEFAULT_CATEGORY, ...fallbackModule.productCategories];
      const deduped = Array.from(
        new Map(merged.map((c) => [c.id, c])).values()
      );
      setProductCategories(deduped);
      setProducts(fallbackProducts);
      setApiError(
        'Mostrando catálogo provisional mientras conectamos con la API.'
      );
      setIsLoadingProducts(false);
    };

    const fetchProducts = async () => {
      setIsLoadingProducts(true);
      try {
        const apiProducts = await api.get<ApiProduct[]>('/products');
        if (!Array.isArray(apiProducts)) {
          applyFallback();
          return;
        }
        const mapped = apiProducts.map((product) =>
          sanitizeProductContent(mapApiProduct(product))
        );
        if (mapped.length === 0) {
          applyFallback();
        } else {
          setProducts(mapped);
          setApiError(null);
          setIsLoadingProducts(false);
        }
      } catch (error) {
        console.warn('Error cargando productos desde la API', error);
        applyFallback();
      } finally {
        setIsLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [api]);

  const processedProducts = useMemo(() => {
    const byCategory = applyCategory(products, selectedCategory);
    const bySearch = applySearch(byCategory, searchTerm);
    return sortProducts(bySearch, sortOption);
  }, [products, selectedCategory, searchTerm, sortOption]);

  const paginatedProducts = useMemo(
    () => paginate(processedProducts, currentPage, itemsPerPage),
    [processedProducts, currentPage, itemsPerPage]
  );

  const totalPages = Math.ceil(processedProducts.length / itemsPerPage);

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleSortChange = (value: SortOption) => {
    setSortOption(value);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  return {
    selectedCategory,
    selectedProduct,
    isModalOpen,
    searchTerm,
    sortOption,
    currentPage,
    itemsPerPage,
    productCategories,
    isLoadingProducts,
    apiError,
    paginatedProducts,
    totalPages,
    handleViewDetails,
    handleCloseModal,
    handleCategoryChange,
    handleSearchChange,
    handleSortChange,
    handleItemsPerPageChange,
    setCurrentPage,
  };
};
