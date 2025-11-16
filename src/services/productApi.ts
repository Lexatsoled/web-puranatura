import { apiClient } from './apiClient';
import type { Product } from '@/types/product';

type BackendProduct = {
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
  components: Array<{
    name: string;
    description: string;
    amount?: string | null;
  }>;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  scientificReferences: Array<{
    title: string;
    authors: string[] | string;
    journal: string;
    year: number;
    doi?: string;
    url?: string;
    summary?: string;
  }>;
  tags: string[];
  priceNote: string | null;
  createdAt: string;
};

type ProductListResponse = {
  products: BackendProduct[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

type ProductResponse = { product: BackendProduct };

type ProductCollectionResponse = { products: BackendProduct[]; total: number };

const toProductImage = (url: string) => ({
  full: url,
  thumbnail: url,
});

const normalizeWarnings = (warnings: string | null | undefined): string[] | undefined => {
  if (!warnings) return undefined;
  return warnings
    .split(';')
    .map((item) => item.trim())
    .filter(Boolean);
};

const normalizeAuthors = (authors: string[] | string | undefined): string => {
  if (!authors) return '';
  if (Array.isArray(authors)) {
    return authors.join(', ');
  }
  return authors;
};

const mapBackendProduct = (backend: BackendProduct): Product => ({
  id: String(backend.id),
  name: backend.name,
  description: backend.description ?? '',
  price: backend.price,
  priceNote: backend.priceNote ?? undefined,
  categories:
    backend.categories && backend.categories.length > 0
      ? backend.categories
      : [backend.category, backend.subcategory].filter(Boolean) as string[],
  images: (backend.images ?? []).map(toProductImage),
  stock: backend.stock ?? 0,
  sku: backend.sku ?? `PN-${backend.id}`,
  tags: backend.tags ?? [],
  compareAtPrice: backend.compareAtPrice ?? undefined,
  rating: backend.rating ?? undefined,
  reviewCount: backend.reviewCount ?? undefined,
  benefits: backend.benefits ?? [],
  benefitsDescription: backend.benefitsDescription ?? [],
  usage: backend.usage ?? undefined,
  dosage: backend.dosage ?? undefined,
  administrationMethod: backend.administrationMethod ?? undefined,
  ingredients: backend.ingredients ?? [],
  warnings: normalizeWarnings(backend.warnings),
  detailedDescription: backend.detailedDescription ?? undefined,
  mechanismOfAction: backend.mechanismOfAction ?? undefined,
  healthIssues: backend.healthIssues ?? [],
  components:
    backend.components?.map((component) => ({
      name: component.name,
      description: component.description,
      amount: component.amount ?? undefined,
    })) ?? [],
  faqs: backend.faqs ?? [],
  scientificReferences:
    backend.scientificReferences?.map((reference) => ({
      title: reference.title,
      authors: normalizeAuthors(reference.authors),
      journal: reference.journal,
      year: reference.year,
      doi: reference.doi,
      url: reference.url,
      summary: reference.summary ?? '',
      relevance: 'alta',
      studyType: 'revision-sistematica',
      keyFindings: [],
    })) ?? [],
});

const buildQueryParams = (params: Record<string, unknown>) =>
  Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .reduce<Record<string, unknown>>((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});

export const productApi = {
  async fetchProducts(params: {
    category?: string;
    search?: string;
    featured?: boolean;
    page?: number;
    limit?: number;
  } = {}): Promise<ProductListResponse & { items: Product[] }> {
    const response = await apiClient.get<ProductListResponse>('/api/v1/products', {
      params: buildQueryParams(params),
    });

    return {
      ...response.data,
      items: response.data.products.map(mapBackendProduct),
    };
  },

  async fetchProductById(id: string): Promise<Product> {
    const response = await apiClient.get<ProductResponse>(`/api/v1/products/${id}`);
    return mapBackendProduct(response.data.product);
  },

  async fetchByCategory(category: string, limit?: number): Promise<Product[]> {
    const response = await apiClient.get<ProductCollectionResponse>(
      `/api/v1/products/category/${encodeURIComponent(category)}`,
      {
        params: buildQueryParams({ limit }),
      }
    );
    return response.data.products.map(mapBackendProduct);
  },

  async fetchFeatured(limit?: number): Promise<Product[]> {
    const response = await apiClient.get<ProductCollectionResponse>('/api/v1/products/featured', {
      params: buildQueryParams({ limit }),
    });
    return response.data.products.map(mapBackendProduct);
  },

  async search(query: string, limit?: number): Promise<Product[]> {
    // SEC-INPUT-001: Validate query length to prevent DoS
    const sanitizedQuery = query.substring(0, 200);
    if (sanitizedQuery !== query) {
      console.warn(`[SECURITY] Query truncada de ${query.length} a 200 caracteres`);
    }
    const response = await apiClient.get<ProductCollectionResponse>('/api/v1/products/search', {
      params: buildQueryParams({ q: sanitizedQuery, limit }),
    });
    return response.data.products.map(mapBackendProduct);
  },

  async fetchBySystem(params: {
    systemId: string;
    search?: string;
    featured?: boolean;
    page?: number;
    limit?: number;
  }): Promise<ProductListResponse & { items: Product[] }> {
    const { systemId, ...queryParams } = params;
    const response = await apiClient.get<ProductListResponse>(
      `/api/v1/products/system/${encodeURIComponent(systemId)}`,
      {
        params: buildQueryParams(queryParams),
      }
    );

    return {
      ...response.data,
      items: response.data.products.map(mapBackendProduct),
    };
  },
};

export type ProductApi = typeof productApi;
