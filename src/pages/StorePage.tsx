import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import { loadProductsByCategory, productCategories, loadSystems } from '../data/products';
import { System } from '@/types/system';
import VirtualProductGrid from '../components/VirtualProductGrid';
import { SortOption, Product } from '../types/product';
import { useNavigationState } from '../hooks/useNavigationState';

const StorePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('default');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [products, setProducts] = useState<Product[]>([]);
  const [systems, setSystems] = useState<System[]>([]);
  const [loading, setLoading] = useState(true);

  const { 
    saveNavigationState, 
    getNavigationState 
  } = useNavigationState();

  // Cargar productos y sistemas dinámicamente
  useEffect(() => {
    console.log('🔄 Cargando productos para categoría:', selectedCategory);
    setLoading(true);
    Promise.all([
      loadProductsByCategory(selectedCategory),
      loadSystems()
    ]).then(([loadedProducts, loadedSystems]) => {
      console.log('✅ Productos cargados:', loadedProducts.length);
      console.log('📦 Primeros 3 productos:', loadedProducts.slice(0, 3));
      setProducts(loadedProducts);
      setSystems(loadedSystems);
      setLoading(false);
    }).catch(error => {
      console.error('❌ Error cargando productos:', error);
      setLoading(false);
    });
  }, [selectedCategory]);

  // Manejar parámetros de URL para sistemas sinérgicos
  useEffect(() => {
    const sistema = searchParams.get('sistema');
    if (sistema) {
      setSelectedCategory(`sistema-${sistema}`);
    }
  }, [searchParams]);

  // Restaurar estado al cargar la página (SIN MANEJAR SCROLL)
  useEffect(() => {
    const savedState = getNavigationState();
    
    if (savedState && savedState.fromProductPage) {
      // Solo restaurar filtros y paginación - ScrollManager maneja el scroll
      setSelectedCategory(savedState.selectedCategory);
      setSearchTerm(savedState.searchTerm);
      setSortOption(savedState.sortOption as SortOption);
      setCurrentPage(savedState.currentPage);
      setItemsPerPage(savedState.itemsPerPage);
      
      // NO limpiar el estado aquí - ScrollManager lo hará después del scroll
    }
  }, [getNavigationState]);

  // Guardar estado cada vez que cambie algo
  useEffect(() => {
    // Solo guardar si no estamos en proceso de restaurar estado
    const savedState = getNavigationState();
    const isRestoring = savedState && savedState.fromProductPage;
    
    if (!isRestoring) {
      const stateToSave = {
        selectedCategory,
        searchTerm,
        sortOption,
        currentPage,
        itemsPerPage,
      };
      
      saveNavigationState(stateToSave);
    }
  }, [selectedCategory, searchTerm, sortOption, currentPage, itemsPerPage, saveNavigationState, getNavigationState]);

  // Guardar estado antes de navegar
  useEffect(() => {
    const handleBeforeUnload = () => {
      const stateToSave = {
        selectedCategory,
        searchTerm,
        sortOption,
        currentPage,
        itemsPerPage,
      };
      
      saveNavigationState(stateToSave);
    };

    // Guardar en cambios de página/navegación
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [selectedCategory, searchTerm, sortOption, currentPage, itemsPerPage, saveNavigationState]);

  // Función para obtener todas las categorías hijas de una categoría padre
  const getChildCategories = (parentId: string): string[] => {
    return productCategories
      .filter(cat => cat.parent === parentId)
      .map(cat => cat.id);
  };

  const processedProducts = useMemo(() => {
    let filtered = products;

    // Filter by category or synergistic system
    if (selectedCategory !== 'todos' && selectedCategory !== 'Todos') {
      if (selectedCategory.startsWith('sistema-')) {
        // Filtrar por sistema sinérgico usando systems de data/products
        const systemId = selectedCategory.replace('sistema-', '');
        const system = systems.find(s => s.id === systemId);
        if (system) {
          filtered = filtered.filter(product => 
            system.products.includes(product.id)
          );
        }
      } else {
        // Filtrar por categoría tradicional
        const childCategories = getChildCategories(selectedCategory);
        const categoriesToSearch = childCategories.length > 0 
          ? [...childCategories, selectedCategory] 
          : [selectedCategory];
        
        filtered = filtered.filter(
          (product) => product.categories && 
          product.categories.some(cat => categoriesToSearch.includes(cat))
        );
      }
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
    <div className="bg-emerald-100 py-12">
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
        <div className="bg-emerald-100/95 backdrop-blur-sm py-4 mb-8 rounded-lg shadow-md border border-emerald-200">
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
            {/* Category with Systems */}
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              aria-label="Filtrar por categoría"
              className="w-full p-3 bg-white border border-green-200 rounded-lg shadow-sm focus:ring-2 focus:ring-green-300 focus:border-green-400 transition"
            >
              {/* Sistemas Sinérgicos */}
              <optgroup label="🧬 Sistemas Sinérgicos">
                {systems.map((system) => (
                  <option key={`sistema-${system.id}`} value={`sistema-${system.id}`}>
                    {system.name}
                  </option>
                ))}
              </optgroup>
              
              {/* Categorías tradicionales */}
              <optgroup label="📂 Categorías Tradicionales">
                {productCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </optgroup>
            </select>
            {/* Sort */}
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
            </select>
            {/* Items per page */}
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

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"></div>
            <p className="mt-6 text-lg text-gray-600">Cargando productos...</p>
          </div>
        ) : paginatedProducts.length > 0 ? (
          <VirtualProductGrid 
            products={paginatedProducts}
            cardHeight={450}
            gapSize={32}
          />
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
    </div>
  );
};

export default StorePage;
