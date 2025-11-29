import { useState, useEffect, useRef, useCallback } from 'react';
import debounce from 'lodash/debounce';

export type SearchResult = {
  type: 'product' | 'category' | 'suggestion';
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
  url: string;
  relevance?: number;
};

export type UseSearchBarOptions = {
  onSearch: (q: string) => Promise<SearchResult[]>;
  onResultClick?: (r: SearchResult) => void;
  minQueryLength?: number;
  debounceMs?: number;
};

export function useSearchBar({
  onSearch,
  onResultClick,
  minQueryLength = 2,
  debounceMs = 300,
}: UseSearchBarOptions) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);

  const searchRef = useRef<HTMLDivElement | null>(null);

  // click outside closes the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const doSearch = useCallback(
    async (q: string) => {
      if (q.length < minQueryLength) {
        setResults([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const r = await onSearch(q);
        setResults(r);
        setIsOpen(true);
      } finally {
        setIsLoading(false);
      }
    },
    [onSearch, minQueryLength]
  );

  const debouncedSearch = useCallback(
    debounce((q: string) => void doSearch(q), debounceMs),
    [doSearch, debounceMs]
  );

  useEffect(() => () => debouncedSearch.cancel(), [debouncedSearch]);

  const handleSearchChange = (value: string) => {
    setQuery(value);
    debouncedSearch(value);
  };

  const handleKeyDown = (e: { key: string; preventDefault?: () => void }) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault?.();
        setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault?.();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault?.();
        if (activeIndex >= 0 && results[activeIndex]) {
          const r = results[activeIndex];
          if (onResultClick) onResultClick(r);
          // reset
          setQuery('');
          setResults([]);
          setIsOpen(false);
          setActiveIndex(-1);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  const handleResultClick = (result: SearchResult) => {
    onResultClick?.(result);
    setQuery('');
    setResults([]);
    setIsOpen(false);
    setActiveIndex(-1);
  };

  return {
    query,
    setQuery,
    results,
    isOpen,
    isLoading,
    activeIndex,
    setIsOpen,
    setActiveIndex,
    searchRef,
    handleSearchChange,
    handleKeyDown,
    handleResultClick,
  };
}

export default useSearchBar;
