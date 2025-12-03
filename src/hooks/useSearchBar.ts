import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import debounce from 'lodash/debounce';
import { buildActions, shouldSearch } from './useSearchBar.helpers';
import { SearchResult, UseSearchBarOptions } from './useSearchBar.types';

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

  const resetState = useCallback(() => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    setActiveIndex(-1);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!searchRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const doSearch = useCallback(
    async (q: string) => {
      if (!shouldSearch(q, minQueryLength)) {
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

  const debouncedSearch = useMemo(
    () => debounce((q: string) => void doSearch(q), debounceMs),
    [doSearch, debounceMs]
  );

  useEffect(() => () => debouncedSearch.cancel(), [debouncedSearch]);

  const handleSearchChange = (value: string) => {
    setQuery(value);
    debouncedSearch(value);
  };

  const handleKeyDown = (e: { key: string; preventDefault?: () => void }) => {
    if (!isOpen) return;
    const actions = buildActions(
      results,
      activeIndex,
      onResultClick,
      resetState,
      setActiveIndex,
      setIsOpen
    );

    const action = (actions as Record<string, () => void>)[e.key];
    if (action) {
      e.preventDefault?.();
      action();
    }
  };

  const handleResultClick = (result: SearchResult) => {
    onResultClick?.(result);
    resetState();
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
export type { SearchResult };
