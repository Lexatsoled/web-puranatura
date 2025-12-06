import React from 'react';
// Use CSS transitions for search result items instead of framer-motion
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
      <button
        key={result.id}
        onClick={() => onSelect(result)}
        className={`w-full flex items-center px-4 py-2 text-left ${
          index === activeIndex ? 'bg-gray-100' : 'hover:bg-gray-50'
        }`}
        // simple appearance handled by CSS (no framer-motion)
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
      </button>
    ))}
  </div>
);
