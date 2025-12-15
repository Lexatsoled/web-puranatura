import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../../types/product';
import { sanitizeProductContent } from '../../utils/contentSanitizers';
import { useApi } from '../../utils/api';
import { mapApiProduct, ApiProduct } from '../../utils/productMapper';
import {
  computeProcessedProducts,
  paginate,
  type SortOption,
} from './utils/storeFilters';
import { Category, DEFAULT_CATEGORY } from './constants';
import { FALLBACK_MESSAGE, loadFallbackProducts } from './utils/storeFallback';

export type { SortOption } from './utils/storeFilters';

export const useStorePage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>(
    DEFAULT_CATEGORY.id
  );
  /* REMOVED MODAL STATE */
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('default');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(48);
  const [products, setProducts] = useState<Product[]>([]);
  const [productCategories, setProductCategories] = useState<Category[]>([
    DEFAULT_CATEGORY,
  ]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const api = useApi();
  const navigate = useNavigate();
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) {
      setIsLoadingProducts(false);
      return;
    }
    hasFetched.current = true;

    // Helper to apply fallback data
    const applyFallbackData = (data: {
      products: Product[];
      categories: Category[];
    }) => {
      setProductCategories(data.categories);
      setProducts(data.products);
      setApiError(FALLBACK_MESSAGE);
      setIsLoadingProducts(false);
    };

    const applyFallback = async () => {
      const data = await loadFallbackProducts();
      applyFallbackData(data);
    };

    const fetchProducts = async () => {
      setIsLoadingProducts(true);
      try {
        // Fetch local data in parallel to augment API response
        const [apiProducts, localData] = await Promise.all([
          api.get<ApiProduct[]>(`/products?t=${Date.now()}`).catch(() => null),
          loadFallbackProducts().catch(() => ({
            products: [],
            categories: [DEFAULT_CATEGORY],
          })),
        ]);

        if (!Array.isArray(apiProducts)) {
          applyFallbackData(localData as any);
          return;
        }
        const mapped = apiProducts.map((product) =>
          sanitizeProductContent(mapApiProduct(product, localData.products))
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
    navigate(`/producto/${product.id}`);
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

    handleCategoryChange,
    handleSearchChange,
    handleSortChange,
    handleItemsPerPageChange,
    setCurrentPage,
  };
};
