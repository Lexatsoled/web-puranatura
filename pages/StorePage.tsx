import React, { useState, useMemo, useEffect } from 'react';
import {
  products as legacyProducts,
  productCategories,
} from '../data/products';
import ProductCard from '../components/ProductCard';
import ProductDetailModal from '../components/ProductDetailModal';
import { Product } from '../src/types/product';
import { sanitizeProductContent } from '../src/utils/contentSanitizers';
import { useApi } from '../src/utils/api';
import { mapApiProduct, ApiProduct } from '../src/utils/productMapper';

type SortOption =
  | 'name-asc'
  | 'name-desc'
  | 'price-asc'
  | 'price-desc'
  | 'default';

const StorePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('default');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const api = useApi();

  const fallbackProducts = useMemo(
    () => legacyProducts.map((product) => sanitizeProductContent(product)),
    []
  );

  useEffect(() => {
    let active = true;
    const fetchProducts = async () => {
      setIsLoadingProducts(true);
      try {
        const apiProducts = await api.get<ApiProduct[]>('/products');
        if (!active) return;
        if (!Array.isArray(apiProducts)) {
          console.error(
            'API /products returned non-array response:',
            apiProducts
          );
          // Fallback to legacy products if API shape is unexpected
          setProducts(fallbackProducts);
          setApiError(
            'Mostrando catálogo provisional mientras conectamos con la API.'
          );
          return;
        }
        const mapped = apiProducts.map((product) =>
          sanitizeProductContent(mapApiProduct(product))
        );
        setProducts(mapped);
      } catch (error) {
        console.error('Error cargando productos desde la API', error);
        if (active) {
          setProducts(fallbackProducts);
          setApiError(
            'Mostrando catálago provisional mientras conectamos con la API.'
          );
        }
      } finally {
        if (active) {
          setIsLoadingProducts(false);
        }
      }
    };

    fetchProducts();
    return () => {
      active = false;
    };
  }, [api, fallbackProducts]);

  const processedProducts = useMemo(() => {
    let filtered = products;

    // Filter by category
    // `selectedCategory` options are lowercase ids (e.g. 'todos'), so compare with lowercase
    if (selectedCategory !== 'todos') {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort products
    const sorted = [...filtered].sort((a, b) => {
      switch (sortOption) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        default:
          return 0;
      }
    });

    return sorted;
  }, [products, selectedCategory, searchTerm, sortOption]);

  // Paginate products
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return processedProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [processedProducts, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(processedProducts.length / itemsPerPage);

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value as SortOption);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="bg-emerald-50 py-12">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-display text-green-800">
            Tienda Natural
          </h1>
          <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
            Productos cuidadosamente seleccionados para apoyar tu camino hacia
            el bienestar.
          </p>
        </div>

        {/* Controls Bar */}
        <div className="bg-emerald-50/95 backdrop-blur-sm py-4 mb-8 rounded-lg shadow-md border border-emerald-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
            {/* Search */}
            <div className="relative">
              <input
                data-testid="search-input"
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
            {/* Category */}
            <select
              aria-label="Categoria"
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="w-full p-3 bg-white border border-green-200 rounded-lg shadow-sm focus:ring-2 focus:ring-green-300 focus:border-green-400 transition"
            >
              {productCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {/* Sort */}
            <select
              aria-label="Ordenar productos"
              value={sortOption}
              onChange={handleSortChange}
              className="w-full p-3 bg-white border border-green-200 rounded-lg shadow-sm focus:ring-2 focus:ring-green-300 focus:border-green-400 transition"
            >
              <option value="default">Ordenar por defecto</option>
              <option value="name-asc">Nombre (A-Z)</option>
              <option value="name-desc">Nombre (Z-A)</option>
              <option value="price-asc">Precio (Menor a Mayor)</option>
              <option value="price-desc">Precio (Mayor a Menor)</option>
            </select>
            {/* Items per page */}
            <select
              aria-label="Elementos por pagina"
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="w-full p-3 bg-white border border-green-200 rounded-lg shadow-sm focus:ring-2 focus:ring-green-300 focus:border-green-400 transition"
            >
              <option value={12}>12 por página</option>
              <option value={24}>24 por página</option>
              <option value={48}>48 por página</option>
            </select>
          </div>
        </div>

        {apiError && (
          <div className="mb-6 rounded-lg border border-yellow-300 bg-yellow-50 p-4 text-yellow-900 text-sm">
            {apiError}
          </div>
        )}

        {isLoadingProducts && !apiError ? (
          <div className="text-center py-20 text-gray-500">
            Cargando catálogo...
          </div>
        ) : paginatedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {paginatedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold text-gray-600">
              No se encontraron productos
            </h2>
            <p className="text-gray-500 mt-2">
              Intenta ajustar tu búsqueda o filtros.
            </p>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center items-center space-x-4">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <span className="text-sm text-gray-700">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
      <ProductDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        product={selectedProduct}
      />
    </div>
  );
};

export default StorePage;
