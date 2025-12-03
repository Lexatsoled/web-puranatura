import { Product } from '../../types';
import { SearchResult } from '../../hooks/useSearchBar';

export type Category = { id: string; name: string; image?: string };

export interface SearchBarProps {
  onSearch: (query: string) => Promise<SearchResult[]>;
  onResultClick: (result: SearchResult) => void;
  recentSearches?: string[];
  popularProducts?: Product[];
  categories?: Category[];
  isLoading?: boolean;
}
