import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OptimizedImage } from './OptimizedImage';

interface Category {
  id: string;
  name: string;
  image: string;
  description: string;
  productCount: number;
  featured?: boolean;
}

interface CategoryNavigationProps {
  categories: Category[];
  onCategorySelect: (categoryId: string) => void;
  activeCategory?: string;
}

const CategoryNavigation: React.FC<CategoryNavigationProps> = ({
  categories,
  onCategorySelect,
  activeCategory,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);

  // Monitorear el scroll para efectos visuales
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const featuredCategories = categories.filter((cat) => cat.featured);
  const regularCategories = categories.filter((cat) => !cat.featured);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="mb-8">
      {/* Barra de navegación horizontal sticky */}
      <div
        className={`sticky top-0 z-10 bg-white transition-shadow ${
          isScrolled ? 'shadow-md' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="overflow-x-auto py-4 hide-scrollbar">
            <div className="flex space-x-4 min-w-max">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => onCategorySelect(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                    activeCategory === category.id
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.name}
                  <span className="ml-2 text-xs opacity-75">
                    ({category.productCount})
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid de categorías destacadas */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {featuredCategories.map((category) => (
            <motion.div
              key={category.id}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="relative rounded-xl overflow-hidden cursor-pointer group"
              onClick={() => onCategorySelect(category.id)}
            >
              <div className="aspect-[16/9] relative">
                <OptimizedImage
                  src={category.image}
                  alt={category.name}
                  className="object-cover"
                  aspectRatio={16/9}
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-opacity" />
              </div>
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <h3 className="text-xl font-bold text-white mb-2">
                  {category.name}
                </h3>
                <p className="text-white text-sm opacity-90 mb-4">
                  {category.description}
                </p>
                <span className="text-white text-sm">
                  {category.productCount} productos
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Categorías regulares en grid más pequeño */}
        <AnimatePresence>
          {(showAllCategories || regularCategories.length <= 6) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
            >
              {regularCategories.map((category) => (
                <motion.div
                  key={category.id}
                  variants={itemVariants}
                  whileHover={{ y: -3 }}
                  className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer"
                  onClick={() => onCategorySelect(category.id)}
                >
                  <div className="aspect-square relative">
                    <OptimizedImage
                      src={category.image}
                      alt={category.name}
                      className="object-cover"
                      aspectRatio={1}
                    />
                  </div>
                  <div className="p-3">
                    <h4 className="text-sm font-medium text-gray-800 text-center">
                      {category.name}
                    </h4>
                    <p className="text-xs text-gray-500 text-center mt-1">
                      {category.productCount} productos
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {regularCategories.length > 6 && (
          <div className="text-center mt-6">
            <button
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
            >
              {showAllCategories ? 'Ver menos' : 'Ver todas las categorías'}
              <svg
                className={`ml-1 w-4 h-4 transition-transform ${
                  showAllCategories ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Estilos para ocultar la barra de desplazamiento */}
      <style jsx global>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default CategoryNavigation;
