import React, { useState, useEffect } from 'react';
// Using CSS transitions for category cards instead of framer-motion
import {
  Category,
  CategoryScrollBar,
  FeaturedCategoryCard,
  RegularCategoryCard,
} from './CategoryNavigation.helpers';

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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const featuredCategories = categories.filter((cat) => cat.featured);
  const regularCategories = categories.filter((cat) => !cat.featured);

  return (
    <div className="mb-8">
      <div
        className={`sticky top-0 z-10 bg-white transition-shadow ${
          isScrolled ? 'shadow-md' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <CategoryScrollBar
            categories={categories}
            activeCategory={activeCategory}
            onSelect={onCategorySelect}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCategories.map((category) => (
            <FeaturedCategoryCard
              key={category.id}
              category={category}
              onSelect={onCategorySelect}
            />
          ))}
        </div>

        {(showAllCategories || regularCategories.length <= 6) && (
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {regularCategories.map((category) => (
              <RegularCategoryCard
                key={category.id}
                category={category}
                onSelect={onCategorySelect}
              />
            ))}
          </div>
        )}

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

      <style>{`
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
