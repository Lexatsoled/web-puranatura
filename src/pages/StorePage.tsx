import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SortOption, Product } from '@/types/product';
import { errorLogger, ErrorSeverity, ErrorCategory } from '@/services/errorLogger';
import { withLazyLoading } from '@/utils/performance/lazy';
import { useNavigationState } from '@/hooks/useNavigationState';
import { useProductStore } from '@/store/productStore';

const VirtualizedProductGrid = withLazyLoading(
  React.lazy(() => import('@/components/VirtualizedProductGrid'))
);

const DEFAULT_CATEGORY = 'todos';
const DEFAULT_LIMIT = 12;
const SEARCH_DEBOUNCE = 300;

const toTitle = (slug: string) =>
  slug === DEFAULT_CATEGORY
    ? 'Todos'
    : slug
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

const StorePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string>(DEFAULT_CATEGORY);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('default');
  const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_LIMIT);
  const [categoryOptions, setCategoryOptions] = useState<string[]>([DEFAULT_CATEGORY]);
  const [initialized, setInitialized] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const products = useProductStore((state) => state.products);
  const fetchProducts = useProductStore((state) => state.fetchProducts);
  const loading = useProductStore((state) => state.loading);
  const storeError = useProductStore((state) => state.error);
  const pagination = useProductStore((state) => state.pagination);

  const { saveNavigationState, getNavigationState } = useNavigationState();

  const updateCategoryOptions = (items: Product[]) => {
    setCategoryOptions((prev) => {
      const set = new Set(prev);
      items.forEach((product) => {
        product.categories?.forEach((category) => set.add(category));
      });
      const entries = Array.from(set).filter(Boolean);
      if (!entries.includes(DEFAULT_CATEGORY)) {
        entries.unshift(DEFAULT_CATEGORY);
      }
      return entries;
    });
  };

  useEffect(() => {
    const savedState = getNavigationState();
    if (savedState) {
      setSelectedCategory(savedState.selectedCategory ?? DEFAULT_CATEGORY);
      setSearchTerm(savedState.searchTerm ?? '');
      setSortOption((savedState.sortOption as SortOption) ?? 'default');
      setItemsPerPage(savedState.itemsPerPage ?? DEFAULT_LIMIT);
    }

    const initialCategory =
      savedState?.selectedCategory && savedState.selectedCategory !== DEFAULT_CATEGORY
        ? savedState.selectedCategory
        : undefined;
    const initialSearch = savedState?.searchTerm ? savedState.searchTerm : undefined;
    const initialLimit = savedState?.itemsPerPage ?? DEFAULT_LIMIT;

    fetchProducts({
      category: initialCategory,
      search: initialSearch,
      limit: initialLimit,
    })
      .then(updateCategoryOptions)
      .catch((error) => {
        errorLogger.log(
          error instanceof Error ? error : new Error(String(error)),
          ErrorSeverity.MEDIUM,
          ErrorCategory.API,
          { context: 'StorePage', action: 'initialFetch' }
        );
      })
      .finally(() => setInitialized(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const sistema = searchParams.get('sistema');
    if (sistema) {
      // El sistema ahora usa IDs de categorías reales o términos de búsqueda
      // que el endpoint flexible /system/:id puede resolver
      setSelectedCategory(`sistema-${sistema}`);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!initialized) return;

    const handler = window.setTimeout(() => {
      fetchProducts({
        category: selectedCategory !== DEFAULT_CATEGORY ? selectedCategory : undefined,
        search: searchTerm || undefined,
        limit: itemsPerPage,
      })
        .then(updateCategoryOptions)
        .catch((error) => {
          errorLogger.log(
            error instanceof Error ? error : new Error(String(error)),
            ErrorSeverity.MEDIUM,
            ErrorCategory.API,
            {
              context: 'StorePage',
              action: 'fetchProducts',
              selectedCategory,
              searchTerm,
            }
          );
        });
    }, SEARCH_DEBOUNCE);

    return () => window.clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialized, itemsPerPage, searchTerm, selectedCategory]);

  useEffect(() => {
    if (!initialized) return;
    const stateToSave = {
      selectedCategory,
      searchTerm,
      sortOption,
      currentPage: pagination.page,
      itemsPerPage,
    };
    saveNavigationState(stateToSave);
  }, [initialized, itemsPerPage, pagination.page, saveNavigationState, searchTerm, selectedCategory, sortOption]);

  useEffect(() => {
    if (!initialized) return;
    const handleBeforeUnload = () => {
      saveNavigationState({
        selectedCategory,
        searchTerm,
        sortOption,
        currentPage: pagination.page,
        itemsPerPage,
      });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [initialized, itemsPerPage, pagination.page, saveNavigationState, searchTerm, selectedCategory, sortOption]);

  const processedProducts = useMemo(() => {
    const list = [...products];
    switch (sortOption) {
      case 'name-asc':
        return list.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return list.sort((a, b) => b.name.localeCompare(a.name));
      case 'price-asc':
        return list.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return list.sort((a, b) => b.price - a.price);
      case 'rating-desc':
        return list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
      default:
        return list;
    }
  }, [products, sortOption]);

  const hasNextPage = pagination.page < pagination.totalPages;

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(event.target.value);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(event.target.value as SortOption);
  };

  const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(event.target.value));
  };

  const handleLoadMore = async () => {
    if (isLoadingMore || !hasNextPage) return;
    setIsLoadingMore(true);
    try {
      await fetchProducts({
        category: selectedCategory !== DEFAULT_CATEGORY ? selectedCategory : undefined,
        search: searchTerm || undefined,
        limit: itemsPerPage,
        page: pagination.page + 1,
      }).then(updateCategoryOptions);
    } catch (error) {
      errorLogger.log(
        error instanceof Error ? error : new Error(String(error)),
        ErrorSeverity.MEDIUM,
        ErrorCategory.API,
        { context: 'StorePage', action: 'handleLoadMore' }
      );
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <div className="bg-emerald-100 py-12">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-display text-green-800">
            Tienda Natural
          </h1>
          <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
            Productos cuidadosamente seleccionados para apoyar tu camino hacia el bienestar.
          </p>
        </div>

        <div className="bg-emerald-100/95 backdrop-blur-sm py-4 mb-8 rounded-lg shadow-md border border-emerald-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full p-3 pl-10 bg-white border border-green-200 rounded-lg shadow-sm focus:ring-2 focus:ring-green-300 focus:border-green-400 transition"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              aria-label="Filtrar por categoría"
              className="w-full p-3 bg-white border border-green-200 rounded-lg shadow-sm focus:ring-2 focus:ring-green-300 focus:border-green-400 transition"
            >
              {categoryOptions.map((category) => (
                <option key={category} value={category}>
                  {toTitle(category)}
                </option>
              ))}
            </select>

            <select
              value={sortOption}
              onChange={handleSortChange}
              aria-label="Ordenar productos"
              className="w-full p-3 bg-white border border-green-200 rounded-lg shadow-sm focus:ring-2 focus:ring-green-300 focus:border-green-400 transition"
            >
              <option value="default">Ordenar por defecto</option>
              <option value="name-asc">Nombre (A-Z)</option>
              <option value="name-desc">Nombre (Z-A)</option>
              <option value="price-asc">Precio (Menor a Mayor)</option>
              <option value="price-desc">Precio (Mayor a Menor)</option>
              <option value="rating-desc">Mejor valoración</option>
            </select>

            <select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              aria-label="Productos por página"
              className="w-full p-3 bg-white border border-green-200 rounded-lg shadow-sm focus:ring-2 focus:ring-green-300 focus:border-green-400 transition"
            >
              <option value={12}>12 por página</option>
              <option value={24}>24 por página</option>
              <option value={48}>48 por página</option>
            </select>
          </div>
        </div>

        {storeError && (
          <div className="bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded mb-6">
            {storeError}
          </div>
        )}

        {loading && !isLoadingMore ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"></div>
            <p className="mt-6 text-lg text-gray-600">Cargando productos...</p>
          </div>
        ) : processedProducts.length > 0 ? (
          <Suspense
            fallback={
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"></div>
                <p className="mt-6 text-lg text-gray-600">Cargando productos...</p>
              </div>
            }
          >
            <VirtualizedProductGrid
              products={processedProducts}
              containerWidth={800}
              containerHeight={600}
              itemWidth={280}
              itemHeight={400}
              gap={16}
              onLoadMore={hasNextPage ? handleLoadMore : undefined}
              hasNextPage={hasNextPage}
              isLoading={loading || isLoadingMore}
            />
          </Suspense>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold text-gray-600">No se encontraron productos</h2>
            <p className="text-gray-500 mt-2">Intenta ajustar tu búsqueda o filtros.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StorePage;
