import type { Product as DomainProduct } from './src/types/product';

export type {
  ProductImage,
  ProductCategory,
  ProductFilters,
  SortOption,
} from './src/types/product';

export type Product = DomainProduct;

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Service {
  title: string;
  description: string;
  imageUrl: string;
  price?: number;
  duration?: number;
  benefits?: string[];
}

export interface Testimonial {
  name: string;
  text: string;
  imageUrl?: string;
}

export interface BlogPost {
  title: string;
  summary: string;
  imageUrl: string;
  content: string;
}
