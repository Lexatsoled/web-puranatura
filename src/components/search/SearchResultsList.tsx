import React from 'react';
import { motion } from 'framer-motion';
import { OptimizedImage } from '../OptimizedImage';
import { SearchResult } from '../../hooks/useSearchBar';

type Props = {
  results: SearchResult[];
  activeIndex: number;
  onSelect: (result: SearchResult) => void;
};

export const SearchResultsList: React.FC<Props> = ({
  results,
  activeIndex,
  onSelect,
}) => (
  <div className="py-2">
    {results.map((result, index) => (
      <motion.button
        key={result.id}
        onClick={() => onSelect(result)}
        className={`w-full flex items-center px-4 py-2 text-left ${
          index === activeIndex ? 'bg-gray-100' : 'hover:bg-gray-50'
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.05 }}
      >
        {result.image && (
          <div className="w-10 h-10 rounded-lg overflow-hidden mr-3">
            <OptimizedImage
              src={result.image}
              alt={result.title}
              className="w-full h-full object-cover"
              aspectRatio={1}
            />
          </div>
        )}
        <div>
          <div className="text-sm text-gray-700">{result.title}</div>
          {result.subtitle && (
            <div className="text-xs text-gray-500">{result.subtitle}</div>
          )}
        </div>
      </motion.button>
    ))}
  </div>
);
