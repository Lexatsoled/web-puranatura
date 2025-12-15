import React from 'react';
// Simple CSS transitions instead of framer-motion for category cards
import { OptimizedImage } from './OptimizedImage';

export interface Category {
  id: string;
  name: string;
  image: string;
  description: string;
  productCount: number;
  featured?: boolean;
}

export const CategoryScrollBar: React.FC<{
  categories: Category[];
  activeCategory?: string;
  onSelect: (id: string) => void;
}> = ({ categories, activeCategory, onSelect }) => (
  <div className="overflow-x-auto py-4 hide-scrollbar">
    <div className="flex space-x-4 min-w-max">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelect(category.id)}
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
);

export const FeaturedCategoryCard: React.FC<{
  category: Category;
  onSelect: (id: string) => void;
}> = ({ category, onSelect }) => (
  <div
    className="relative rounded-xl overflow-hidden cursor-pointer group transform transition-transform duration-150 hover:-translate-y-1"
    onClick={() => onSelect(category.id)}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') onSelect(category.id);
    }}
  >
    <div className="aspect-[16/9] relative">
      <OptimizedImage
        src={category.image}
        alt={category.name}
        className="object-cover"
        aspectRatio={16 / 9}
      />
      <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-opacity" />
    </div>
    <div className="absolute inset-0 p-6 flex flex-col justify-end">
      <h3 className="text-xl font-bold text-white mb-2">{category.name}</h3>
      <p className="text-white text-sm opacity-90 mb-4">
        {category.description}
      </p>
      <span className="text-white text-sm">
        {category.productCount} productos
      </span>
    </div>
  </div>
);

export const RegularCategoryCard: React.FC<{
  category: Category;
  onSelect: (id: string) => void;
}> = ({ category, onSelect }) => (
  <div
    className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer transform transition-transform duration-150 hover:-translate-y-0.5"
    onClick={() => onSelect(category.id)}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') onSelect(category.id);
    }}
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
  </div>
);
