export interface ProductImage {
  full: string;
  thumbnail: string;
}

export interface ProductCategory {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: ProductImage[];
  stock: number;
  sku: string;
  tags: string[];
  specifications?: {
    [key: string]: string;
  };
  relatedProducts?: string[];
  isNew?: boolean;
  isBestSeller?: boolean;
  compareAtPrice?: number;
  detailedDescription?: string;
  mechanismOfAction?: string;
  benefitsDescription?: string[];
  healthIssues?: string[];
  components?: Array<{ name: string; description?: string; amount?: string }>;
  faqs?: Array<{ question: string; answer: string }>;
  dosage?: string;
  administrationMethod?: string;
}

export type SortOption =
  | 'name-asc'
  | 'name-desc'
  | 'price-asc'
  | 'price-desc'
  | 'default';

export interface ProductFilters {
  category?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  searchTerm?: string;
  sortBy?: SortOption;
  tags?: string[];
}
