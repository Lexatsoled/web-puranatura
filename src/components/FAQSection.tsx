import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags?: string[];
}

interface FAQCategoryCount {
  [key: string]: number;
}

interface FAQSectionProps {
  items: FAQItem[];
  categories: string[];
  defaultCategory?: string;
  onContactSupport?: () => void;
}

const FAQSection: React.FC<FAQSectionProps> = ({
  items,
  categories,
  defaultCategory = 'all',
  onContactSupport,
}) => {
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory);

  // Calcular el conteo de items por categoría
  const categoryCount: FAQCategoryCount = useMemo(() => {
    return items.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {} as FAQCategoryCount);
  }, [items]);

  // Filtrar y ordenar los items
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        const matchesSearch =
          searchQuery === '' ||
          item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.tags?.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          );

        const matchesCategory =
          selectedCategory === 'all' || item.category === selectedCategory;

        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => a.question.localeCompare(b.question));
  }, [items, searchQuery, selectedCategory]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const toggleItem = (itemId: string) => {
    setActiveItemId(activeItemId === itemId ? null : itemId);
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            ¿Cómo podemos ayudarte?
          </h2>
          <p className="text-lg text-gray-600">
            Encuentra respuestas rápidas a las preguntas más comunes
          </p>
        </div>

        {/* Barra de búsqueda */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar en las preguntas frecuentes..."
              className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
          </div>
        </div>

        {/* Navegación por categorías */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex space-x-2 min-w-max">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todas ({items.length})
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category} ({categoryCount[category] || 0})
              </button>
            ))}
          </div>
        </div>

        {/* Lista de preguntas */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {filteredItems.length === 0 ? (
            <motion.div variants={itemVariants} className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-gray-600 mb-4">
                No se encontraron resultados para "{searchQuery}"
              </p>
              {onContactSupport && (
                <button
                  onClick={onContactSupport}
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  Contactar con soporte
                </button>
              )}
            </motion.div>
          ) : (
            filteredItems.map((item) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleItem(item.id)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <span className="font-medium text-gray-900">
                    {item.question}
                  </span>
                  <svg
                    className={`w-5 h-5 text-gray-500 transition-transform ${
                      activeItemId === item.id ? 'transform rotate-180' : ''
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
                <AnimatePresence>
                  {activeItemId === item.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                        <p className="text-gray-600 whitespace-pre-line">
                          {item.answer}
                        </p>
                        {item.tags && item.tags.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {item.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Sección de ayuda adicional */}
        {onContactSupport && filteredItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 text-center"
          >
            <p className="text-gray-600 mb-4">¿No encuentras lo que buscas?</p>
            <button
              onClick={onContactSupport}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
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
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              Contactar con soporte
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FAQSection;
