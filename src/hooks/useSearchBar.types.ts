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
