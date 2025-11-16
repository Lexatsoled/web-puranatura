import type {
  ProductComponent,
  ProductFaq,
  ScientificReference,
} from '../db/schema';

export interface ProductBase {
  id: number;
  name: string;
  description: string | null;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  category: string;
  subcategory: string | null;
  categories: string[];
  sku: string | null;
  isFeatured: boolean;
  images: string[];
  benefits: string[];
  benefitsDescription: string[];
  ingredients: string[];
  usage: string | null;
  dosage: string | null;
  administrationMethod: string | null;
  warnings: string | null;
  rating: number;
  reviewCount: number;
  detailedDescription: string | null;
  mechanismOfAction: string | null;
  healthIssues: string[];
  components: ProductComponent[];
  faqs: ProductFaq[];
  scientificReferences: ScientificReference[];
  tags: string[];
  priceNote: string | null;
  createdAt: string;
}

export interface ProductFilters {
  category?: string;
  search?: string;
  featured?: boolean;
  limit?: number;
  page?: number;
  cursor?: number | string | null;
  priceMin?: number;
  priceMax?: number;
  inStock?: boolean;
  sortBy?: 'price' | 'name' | 'createdAt';
  sortDir?: 'asc' | 'desc';
}

export interface ProductListResult {
  products: ProductBase[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  nextCursor: number | string | null;
  prevCursor: number | string | null;
  hasMore: boolean;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string | null;
  price: number;
  available: boolean;
  attributes: Record<string, string>;
}

export interface ProductReview {
  id: string;
  rating: number;
  title: string;
  body: string;
  author: string;
  createdAt: string;
  helpfulVotes: number;
}

export interface ProductV2 extends ProductBase {
  variants: ProductVariant[];
  reviews: ProductReview[];
}

export interface ProductListResultV2 extends Omit<ProductListResult, 'products'> {
  products: ProductV2[];
}
