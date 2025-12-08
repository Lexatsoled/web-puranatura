import { useEffect, useMemo, useRef, useState } from 'react';
import { Product } from '../../types/product';
import { sanitizeProductContent } from '../../utils/contentSanitizers';
import { useApi } from '../../utils/api';
import { mapApiProduct, ApiProduct } from '../../utils/productMapper';
import {
  computeProcessedProducts,
  paginate,
  SortOption,
} from './utils/storeFilters';
import { Category, DEFAULT_CATEGORY } from './constants';
import { FALLBACK_MESSAGE, loadFallbackProducts } from './utils/storeFallback';

export type { SortOption } from './utils/storeFilters';

export const useStorePage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>(
    DEFAULT_CATEGORY.id
  );
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
      const { products: fallbackProducts, categories } =
        await loadFallbackProducts();
      setProductCategories(categories);
      setProducts(fallbackProducts);
      setApiError(FALLBACK_MESSAGE);
      setIsLoadingProducts(false);
    };

    const fetchProducts = async () => {
      setIsLoadingProducts(true);
      try {
        const apiProducts = await api.get<ApiProduct[]>('/products');
        if (!Array.isArray(apiProducts)) {
          await applyFallback();
          return;
        }
        const mapped = apiProducts.map((product) =>
          sanitizeProductContent(mapApiProduct(product))
        );

        if (mapped.length === 0) {
          await applyFallback();
        } else {
          setProducts(mapped);
          setApiError(null);
          setIsLoadingProducts(false);
        }
      } catch (error) {
        console.warn('Error cargando productos desde la API', error);
        await applyFallback();
      } finally {
        setIsLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [api]);

  const processedProducts = useMemo(
    () =>
      computeProcessedProducts(
        products,
        { categoryId: selectedCategory, searchTerm },
        sortOption
      ),
    [products, selectedCategory, searchTerm, sortOption]
  );

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
