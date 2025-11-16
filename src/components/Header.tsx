import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { LanguageSwitcher } from './LanguageSwitcher';

interface HeaderProps {
  onCartClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onCartClick }) => {
  const { t } = useTranslation();
  // Estado para mostrar el menú móvil
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Estado para mostrar el modal de búsqueda
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const location = useLocation();

  // Elementos del menú principal
  const menuItems = [
    { id: '1', label: t('nav.home'), path: '/' },
    { id: '2', label: t('nav.about'), path: '/sobre-nosotros' },
    { id: '3', label: t('nav.services'), path: '/servicios' },
    { id: '4', label: t('nav.products'), path: '/tienda' },
    {
      id: '8',
      label: t('nav.synergisticSystems'),
      path: '/sistemas-sinergicos',
      highlight: true,
    },
    { id: '5', label: t('nav.testimonials'), path: '/testimonios' },
    { id: '6', label: t('nav.blog'), path: '/blog' },
    { id: '7', label: t('nav.contact'), path: '/contacto' },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white shadow-md sticky top-0 z-50"
      role="banner"
      aria-label="Barra de navegación principal"
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img
              src="/logo-pureza-naturalis-largo_320.webp"
              alt="Pureza Naturalis"
              className="h-8 w-auto"
              loading="eager"
              decoding="async"
              width="128"
              height="32"
            />
          </Link>

          {/* Navegaciï¿½n Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className={`font-medium transition-colors ${
                  item.highlight
                    ? 'text-white bg-gradient-to-r from-green-600 to-emerald-700 px-3 py-2 rounded-full shadow-md hover:from-green-700 hover:to-emerald-800 transform hover:scale-105'
                    : `text-gray-700 hover:text-green-700 ${location.pathname === item.path ? 'text-green-700' : ''}`
                }`}
              >
                {item.highlight && '⚡ '} {item.label}
              </Link>
            ))}
          </div>

          {/* Acciones */}
          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Buscar */}
            <button
              onClick={() => setIsSearchVisible(true)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label={t('common.search')}
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            {/* Carrito */}
            <button
              onClick={onCartClick}
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label={t('nav.cart')}
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
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l-2.5-5M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z"
                />
              </svg>
            </button>

            {/* Menú mï¿½vil */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Menú"
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
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Menú mï¿½vil */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden bg-white border-t"
            >
              <div className="py-2">
                {menuItems.map((item: { id: string; label: string; path: string }) => (
                  <Link
                    key={item.id}
                    to={item.path}
                    className="block px-4 py-3 text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal de bï¿½squeda */}
        <AnimatePresence>
          {isSearchVisible && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
              onClick={() => setIsSearchVisible(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">{t('common.search')}</h3>
                  <button
                    onClick={() => setIsSearchVisible(false)}
                    className="p-1 hover:bg-gray-100 rounded"
                    aria-label={t('common.cancel')}
                    title={t('common.cancel')}
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
                <input
                  type="text"
                  placeholder={t('common.search')}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  autoFocus
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
};

export default Header;


