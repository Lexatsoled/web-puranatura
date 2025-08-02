import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Product } from '../types';

interface NotFoundProps {
  suggestedProducts?: Product[];
  searchQuery?: string;
  onSearch?: (query: string) => void;
  popularCategories?: { id: string; name: string }[];
}

const NotFound: React.FC<NotFoundProps> = ({
  suggestedProducts = [],
  searchQuery,
  onSearch,
  popularCategories = [],
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSuggestions(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        when: 'beforeChildren',
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const errorCode = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <motion.div
        className="max-w-3xl w-full space-y-8 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Código de error animado */}
        <motion.div
          className="text-9xl font-bold text-green-600 opacity-20"
          variants={errorCode}
        >
          404
        </motion.div>

        <motion.div variants={itemVariants}>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Página no encontrada
          </h1>
          <p className="text-lg text-gray-600">
            Lo sentimos, la página que buscas no existe o ha sido movida.
          </p>
        </motion.div>

        {/* Búsqueda */}
        {onSearch && (
          <motion.div variants={itemVariants} className="max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                defaultValue={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                placeholder="Intenta buscar lo que necesitas..."
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <svg
                  className="w-5 h-5 text-gray-400"
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
              </div>
            </div>
          </motion.div>
        )}

        {/* Enlaces rápidos */}
        <motion.div variants={itemVariants}>
          <div className="flex justify-center space-x-4">
            <Link
              to="/"
              className="text-green-600 hover:text-green-700 font-medium flex items-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Inicio
            </Link>
            <Link
              to="/store"
              className="text-green-600 hover:text-green-700 font-medium flex items-center"
            >
              <svg
                className="w-5 h-5 mr-2"
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
              Tienda
            </Link>
            <Link
              to="/contact"
              className="text-green-600 hover:text-green-700 font-medium flex items-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Contacto
            </Link>
          </div>
        </motion.div>

        {/* Sugerencias */}
        <AnimatePresence>
          {showSuggestions && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="mt-12"
            >
              {suggestedProducts.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Productos que te podrían interesar
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {suggestedProducts.slice(0, 3).map((product) => (
                      <Link
                        key={product.id}
                        to={`/product/${product.id}`}
                        className="group block"
                      >
                        <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                          <img
                            src={product.images[0].thumbnail}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <h3 className="mt-2 text-sm font-medium text-gray-900 group-hover:text-green-600 transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-sm text-green-600">
                          DOP ${product.price.toFixed(2)}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {popularCategories.length > 0 && (
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Categorías populares
                  </h2>
                  <div className="flex flex-wrap justify-center gap-2">
                    {popularCategories.map((category) => (
                      <Link
                        key={category.id}
                        to={`/category/${category.id}`}
                        className="px-4 py-2 bg-white rounded-full text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors border border-gray-200"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default NotFound;
