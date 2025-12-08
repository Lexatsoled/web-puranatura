import React, { Suspense } from 'react';
import ProductCard from '../components/ProductCard';
import ErrorBoundary from '../components/ErrorBoundary';
import { useStorePage, SortOption } from './store/useStorePage'; // Assuming src/pages/store/useStorePage exists and matches

const ProductDetailModal = React.lazy(
  () => import('../components/ProductDetailModal')
);

const StorePage: React.FC = () => {
  const state = useStorePage();

  return (
    <div className="bg-emerald-50 py-12">
      <div className="container mx-auto px-6">
        <StoreHeader />
        <StoreControls
          categories={state.productCategories}
          selectedCategory={state.selectedCategory}
          onCategoryChange={state.handleCategoryChange}
          searchTerm={state.searchTerm}
          onSearchChange={state.handleSearchChange}
          sortOption={state.sortOption}
          onSortChange={state.handleSortChange}
          itemsPerPage={state.itemsPerPage}
          onItemsPerPageChange={state.handleItemsPerPageChange}
        />

        {state.apiError && <ErrorAlert message={state.apiError} />}

        <ErrorBoundary>
          <StoreBody
            isLoading={state.isLoadingProducts}
            apiError={state.apiError}
            products={state.paginatedProducts}
            onViewDetails={state.handleViewDetails}
          />
        </ErrorBoundary>

        <PaginationControls
          totalPages={state.totalPages}
          currentPage={state.currentPage}
          onPrevious={() => state.setCurrentPage((p) => Math.max(1, p - 1))}
          onNext={() =>
            state.setCurrentPage((p) => Math.min(state.totalPages, p + 1))
          }
        />
      </div>
      <Suspense fallback={null}>
        {state.selectedProduct && (
          <ProductDetailModal
            isOpen={state.isModalOpen}
            onClose={state.handleCloseModal}
            product={state.selectedProduct}
          />
        )}
      </Suspense>
    </div>
  );
};

const StoreHeader = () => (
  <div className="text-center mb-12">
    <h1 className="text-4xl md:text-5xl font-bold font-display text-green-800">
      Tienda Natural
    </h1>
    <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
      Productos cuidadosamente seleccionados para apoyar tu camino hacia el
      bienestar.
    </p>
  </div>
);

const StoreControls = ({
  categories,
  selectedCategory,
  onCategoryChange,
  searchTerm,
  onSearchChange,
  sortOption,
  onSortChange,
  itemsPerPage,
  onItemsPerPageChange,
}: {
  categories: { id: string; name: string }[];
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortOption: SortOption;
  onSortChange: (value: SortOption) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (value: number) => void;
}) => (
  <div className="bg-emerald-50/95 backdrop-blur-sm py-4 mb-8 rounded-lg shadow-md border border-emerald-200">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
      <SearchInput value={searchTerm} onChange={onSearchChange} />
      <Select
        ariaLabel="Categoria"
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        options={categories}
      />
      <SortSelect
        value={sortOption}
        onChange={(e) => onSortChange(e.target.value as SortOption)}
      />
      <ItemsPerPageSelect
        value={itemsPerPage}
        onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
      />
    </div>
  </div>
);

const SearchInput = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => (
  <div className="relative">
    <label className="sr-only" htmlFor="store-search">
      Buscar productos
    </label>
    <input
      id="store-search"
      data-testid="search-input"
      type="search"
      placeholder="Buscar productos..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      autoComplete="off"
      className="w-full p-3 pl-10 bg-white border border-green-200 rounded-lg shadow-sm focus:ring-2 focus:ring-green-300 focus:border-green-400 transition"
    />
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  </div>
);

const Select = ({
  ariaLabel,
  value,
  onChange,
  options,
}: {
  ariaLabel: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { id: string; name: string }[];
}) => (
  <select
    aria-label={ariaLabel}
    value={value}
    onChange={onChange}
    className="w-full p-3 bg-white border border-green-200 rounded-lg shadow-sm focus:ring-2 focus:ring-green-300 focus:border-green-400 transition"
  >
    {options.map((option) => (
      <option key={option.id} value={option.id}>
        {option.name}
      </option>
    ))}
  </select>
);

const SortSelect = ({
  value,
  onChange,
}: {
  value: SortOption;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) => (
  <select
    aria-label="Ordenar productos"
    value={value}
    onChange={onChange}
    className="w-full p-3 bg-white border border-green-200 rounded-lg shadow-sm focus:ring-2 focus:ring-green-300 focus:border-green-400 transition"
  >
    <option value="default">Ordenar por defecto</option>
    <option value="name-asc">Nombre (A-Z)</option>
    <option value="name-desc">Nombre (Z-A)</option>
    <option value="price-asc">Precio (Menor a Mayor)</option>
    <option value="price-desc">Precio (Mayor a Menor)</option>
  </select>
);

const ItemsPerPageSelect = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) => (
  <select
    aria-label="Elementos por página"
    value={value}
    onChange={onChange}
    className="w-full p-3 bg-white border border-green-200 rounded-lg shadow-sm focus:ring-2 focus:ring-green-300 focus:border-green-400 transition"
  >
    <option value={12}>12 por pagina</option>
    <option value={24}>24 por pagina</option>
    <option value={48}>48 por pagina</option>
  </select>
);

const StoreBody = ({
  isLoading,
  apiError,
  products,
  onViewDetails,
}: {
  isLoading: boolean;
  apiError: string | null;
  products: any[];
  onViewDetails: (product: any) => void;
}) => {
  if (isLoading && !apiError) {
    return <LoadingState />;
  }

  if (products.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
};

const LoadingState = () => (
  <div className="text-center py-20 text-gray-500">Cargando catálogo...</div>
);

const EmptyState = () => (
  <div className="text-center py-20">
    <h2 className="text-2xl font-semibold text-gray-600">
      No se encontraron productos
    </h2>
    <p className="text-gray-500 mt-2">Intenta ajustar tu búsqueda o filtros.</p>
  </div>
);

const ErrorAlert = ({ message }: { message: string }) => (
  <div className="mb-6 rounded-lg border border-yellow-300 bg-yellow-50 p-4 text-yellow-900 text-sm">
    {message}
  </div>
);

const PaginationControls = ({
  totalPages,
  currentPage,
  onPrevious,
  onNext,
}: {
  totalPages: number;
  currentPage: number;
  onPrevious: () => void;
  onNext: () => void;
}) =>
  totalPages > 1 ? (
    <div className="mt-12 flex justify-center items-center space-x-4">
      <button
        onClick={onPrevious}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Anterior
      </button>
      <span className="text-sm text-gray-700">
        Página {currentPage} de {totalPages}
      </span>
      <button
        onClick={onNext}
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Siguiente
      </button>
    </div>
  ) : null;

export default StorePage;
