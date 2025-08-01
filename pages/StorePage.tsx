import React, { useState, useMemo } from 'react';
import { products, productCategories } from '../data/products';
import ProductCard from '../components/ProductCard';
import ProductDetailModal from '../components/ProductDetailModal';
import { Product } from '../types';

type SortOption =
  | 'name-asc'
  | 'name-desc'
  | 'price-asc'
  | 'price-desc'
  | 'default';

const StorePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('default');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  const processedProducts = useMemo(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== 'Todos') {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory,
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()),
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
  }, [selectedCategory, searchTerm, sortOption]);

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
    e: React.ChangeEvent<HTMLSelectElement>,
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
        <div className="sticky top-[88px] bg-emerald-50/80 backdrop-blur-sm z-30 py-4 mb-8 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
            {/* Search */}
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
            {/* Category */}
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="w-full p-3 bg-white border border-green-200 rounded-lg shadow-sm focus:ring-2 focus:ring-green-300 focus:border-green-400 transition"
            >
              {productCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {/* Sort */}
            <select
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

        {paginatedProducts.length > 0 ? (
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
