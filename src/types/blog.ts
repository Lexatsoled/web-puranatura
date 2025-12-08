export interface BlogPost {
  id?: string;
  title: string;
  excerpt?: string;
  summary?: string; // Add summary as alias for excerpt or specific field
  content: string;
  date?: string;
  author?: string;
  readTime?: number;
  imageUrl: string;
  slug?: string;
  category?: string;
  tags?: string[];
}
