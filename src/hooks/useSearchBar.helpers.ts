import { SearchResult, UseSearchBarOptions } from './useSearchBar.types';

export const shouldSearch = (q: string, minQueryLength: number) =>
  q.trim().length >= minQueryLength;

export const buildActions = (
  results: SearchResult[],
  activeIndex: number,
  onResultClick: UseSearchBarOptions['onResultClick'],
  resetState: () => void,
  setActiveIndex: (value: number | ((prev: number) => number)) => void,
  setIsOpen: (value: boolean) => void
) =>
  ({
    ArrowDown: () =>
      setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev)),
    ArrowUp: () => setActiveIndex((prev) => (prev > 0 ? prev - 1 : -1)),
    Enter: () => {
      const r = results[activeIndex] || results[0];
      if (r) {
        onResultClick?.(r);
        resetState();
      }
    },
    Escape: () => setIsOpen(false),
  }) as const;
