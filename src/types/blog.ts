export interface BlogPost {
  id: string;
  title: string;
  content: string;
  summary: string;
  author: string;
  date: string;
  imageUrl: string;
  tags: string[];
  slug: string;
  readTime: number;
  category: string;
}

export interface BlogFilters {
  category?: string;
  tag?: string;
  searchTerm?: string;
  author?: string;
}
