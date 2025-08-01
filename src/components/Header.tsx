import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { debounce } from 'lodash';
import { OptimizedImage } from './OptimizedImage';
import { useCart } from '../contexts/CartContext';

// Tipos
interface SubMenuItem {
  id: string;
  label: string;
  path: string;
  description?: string;
  image?: string;
}

interface MenuItem {
  id: string;
  label: string;
  path: string;
  children?: SubMenuItem[];
}

interface HeaderProps {
  isScrolled: boolean;
  onCartClick: () => void;
  onSearchClick?: () => void;
}

// Configuración del menú
const menuItems: MenuItem[] = [
  {
    id: 'inicio',
    label: 'Inicio',
    path: '/',
  },
  {
    id: 'productos',
    label: 'Productos',
    path: '/store',
    children: [
      {
        id: 'suplementos',
        label: 'Suplementos Naturales',
        path: '/store/suplementos',
        description: 'Vitaminas y suplementos para tu bienestar diario',
        image: '/images/categories/suplementos.jpg',
      },
      {
        id: 'hierbas',
        label: 'Hierbas Medicinales',
        path: '/store/hierbas',
        description: 'Hierbas tradicionales y remedios naturales',
        image: '/images/categories/hierbas.jpg',
      },
    ],
  },
  {
    id: 'servicios',
    label: 'Servicios',
    path: '/services',
  },
  {
    id: 'blog',
    label: 'Blog',
    path: '/blog',
  },
  {
    id: 'contacto',
    label: 'Contacto',
    path: '/contact',
  },
];

// Definición de las animaciones
const menuItemVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      type: "spring" as const,
      stiffness: 300,
      damping: 30
    }
  }
};

const submenuVariants = {
  hidden: { 
    opacity: 0,
    y: 10,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 30
    }
  },
  visible: { 
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 30
    }
  }
};

const Header: React.FC<HeaderProps> = ({
  isScrolled,
  onCartClick,
}) => {
  const location = useLocation();
  const { cartCount } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  // Cerrar menú móvil al cambiar de ruta
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveSubmenu(null);
  }, [location]);

  // Manejar clics fuera del header para cerrar menús
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        headerRef.current &&
        !headerRef.current.contains(event.target as Node)
      ) {
        setActiveSubmenu(null);
        setIsSearchVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Manejar teclas para accesibilidad
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveSubmenu(null);
        setIsSearchVisible(false);
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Focus en el input de búsqueda cuando se muestra
  useEffect(() => {
    if (isSearchVisible && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchVisible]);

  // Optimizar la función de búsqueda con debounce
  const handleSearch = useCallback(
    debounce((searchTerm: string) => {
      // Implementar lógica de búsqueda aquí
      console.log('Searching for:', searchTerm);
    }, 300),
    []
  );

  // Animaciones para elementos del menú
  const menuItemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring" as const,
        stiffness: 300,
        damping: 30
      }
    }
  };

  const { cartCount } = useCart();
  
  return (
    <motion.header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white shadow-lg backdrop-blur-lg bg-opacity-90'
          : 'bg-transparent'
      }`}
      initial={{ y: 0, opacity: 1 }}
      animate={{
        y: isScrolled ? 0 : -100,
        opacity: isScrolled ? 1 : 0,
        transition: {
          y: { type: "spring", stiffness: 300, damping: 30 },
          opacity: { duration: 0.2 }
        }
      }}
    >
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex-shrink-0">
            <OptimizedImage
              src="/logo.png"
              alt="PuraNatura"
              className="h-10 w-auto"
              aspectRatio={1}
            />
          </Link>

          {/* Navegación Desktop */}
          <div className="hidden lg:flex items-center space-x-8">
            {menuItems.map((item) => (
              <motion.div
                key={item.id}
                className="relative"
                onMouseEnter={() => item.children && setActiveSubmenu(item.id)}
                onMouseLeave={() => setActiveSubmenu(null)}
                initial="hidden"
                animate="visible"
                variants={menuItemVariants}
              >
                <Link
                  to={item.path}
                  className={`text-gray-700 hover:text-green-600 font-medium transition-colors ${
                    location.pathname === item.path ? 'text-green-600' : ''
                  }`}
                >
                  {item.label}
                </Link>

                {item.children && activeSubmenu === item.id && (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={submenuVariants}
                    className="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-2"
                  >
                    {item.children.map((child) => (
                      <Link
                        key={child.id}
                        to={child.path}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600"
                      >
                        <div className="font-medium">{child.label}</div>
                        {child.description && (
                          <div className="text-xs text-gray-500 mt-1">
                            {child.description}
                          </div>
                        )}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Iconos de acciones */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsSearchVisible(!isSearchVisible)}
              className="p-2 hover:text-green-600 transition-colors"
              aria-label="Buscar"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            <button
              onClick={onCartClick}
              className="p-2 hover:text-green-600 transition-colors relative"
              aria-label="Carrito"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Barra de búsqueda */}
        <AnimatePresence>
          {isSearchVisible && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute inset-x-0 top-full mt-2 px-4"
            >
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Buscar productos..."
                className="w-full p-4 bg-white rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <OptimizedImage
              src="/logo.png"
              alt="PuraNatura"
              className="h-10 w-auto"
              aspectRatio={1}
            />
          </Link>

          {/* Navegación Desktop */}
          <div className="hidden lg:flex items-center space-x-8">
            {menuItems.map((item) => (
              <motion.div
                key={item.id}
                className="relative"
                onMouseEnter={() =>
                  item.children && setActiveSubmenu(item.id)
                }
                onMouseLeave={() => setActiveSubmenu(null)}
                variants={menuItemVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={item.path}
                  className={`text-gray-700 hover:text-green-600 font-medium transition-colors ${
                    location.pathname === item.path ? 'text-green-600' : ''
                  }`}
                >
                  {item.label}
                </Link>
              </motion.div>

                {/* Submenú Desktop */}
                <AnimatePresence>
                  {item.children && activeSubmenu === item.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 w-80 bg-white shadow-xl rounded-lg mt-2 overflow-hidden"
                    >
                      {item.children.map((child) => (
                        <Link
                          key={child.id}
                          to={child.path}
                          className="block p-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-start">
                            {child.image && (
                              <div className="flex-shrink-0 w-16 h-16 mr-4">
                                <OptimizedImage
                                  src={child.image}
                                  alt={child.label}
                                  className="w-full h-full object-cover rounded"
                                  aspectRatio={1}
                                />
                              </div>
                            )}
                            <div>
                              <h3 className="font-medium text-gray-900">
                                {child.label}
                              </h3>
                              {child.description && (
                                <p className="text-sm text-gray-500 mt-1">
                                  {child.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Acciones */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsSearchVisible(true)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Buscar"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            <button
              onClick={onCartClick}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
              aria-label="Carrito"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              {/* Indicador de items en carrito */}
              <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </button>

            {/* Botón de menú móvil */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Menú"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    isMobileMenuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Barra de búsqueda */}
        <AnimatePresence>
          {isSearchVisible && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 right-0 bg-white shadow-lg p-4 border-t"
            >
              <div className="container mx-auto max-w-4xl">
                <div className="relative">
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Buscar productos..."
                    className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                  <svg
                    className="absolute left-4 top-3.5 h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <button
                    onClick={() => setIsSearchVisible(false)}
                    className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Menú móvil */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden overflow-hidden bg-white border-t mt-4"
            >
              <div className="py-2">
                {menuItems.map((item) => (
                  <div key={item.id}>
                    <Link
                      to={item.path}
                      className="block px-4 py-3 text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                    {item.children && (
                      <div className="pl-8 border-l border-gray-200 ml-4">
                        {item.children.map((child) => (
                          <Link
                            key={child.id}
                            to={child.path}
                            className="block px-4 py-2 text-gray-600 hover:bg-gray-50"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
};

export default Header;
