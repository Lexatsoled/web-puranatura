import { Product } from '../types';
import { tryProductFallback } from './dynamicRoutes.helpers.utils';

export interface RouteMetadata {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogType?: 'website' | 'article' | 'product';
  ogImage?: string;
  structuredData?: object;
}

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  featuredImage: string;
  publishDate: string;
}

const CATEGORY_NAMES = [
  'suplementos',
  'herbolaria',
  'aceites-esenciales',
  'productos-naturales',
  'remedios-homeopaticos',
];

const PRODUCT_API = '/api/products';
const BLOG_API = '/api/blog';

/**
 * Robust fetch wrapper that attempts the primary endpoint first.
 * On failure, attempts to load product data from a pre-built fallback JSON.
 */
const fetchJson = async <T>(endpoint: string): Promise<T> => {
  try {
    const res = await fetch(endpoint);
    if (!res.ok) {
      throw new Error(`fetch ${endpoint} failed with status ${res.status}`);
    }
    return (await res.json()) as T;
  } catch (primaryError) {
    // Attempt fallback for product endpoints
    try {
      return await tryProductFallback<T>(endpoint);
    } catch (fallbackError) {
      console.warn('Fetch fallback attempt failed', fallbackError);
      throw primaryError; // Re-throw original error
    }
  }
};

export const buildCategoryMetadata = async ({
  category,
}: {
  category: string;
}): Promise<RouteMetadata> => ({
  title: `${category} | PuraNatura`,
  description: `Descubre nuestra selección de productos naturales en la categoría ${category}. Productos de alta calidad para tu bienestar.`,
  ogType: 'website',
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: category,
    description: `Productos naturales en la categoría ${category}`,
  },
});

export const getCategoryPaths = async () =>
  CATEGORY_NAMES.map((category) => ({ category }));

export const fetchProductById = (id: string) =>
  fetchJson<Product>(`${PRODUCT_API}/${id}`);

export const buildProductStructuredData = (product: Product) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: product.name,
  description: product.description,
  image: (product.images ?? []).map((img) => img.full),
  offers: {
    '@type': 'Offer',
    price: product.price,
    priceCurrency: 'EUR',
    availability: product.inStock ? 'InStock' : 'OutOfStock',
  },
});

export const buildProductMetadata = (product: Product): RouteMetadata => ({
  title: `${product.name} | PuraNatura`,
  description: product?.seoDescription || product?.description || '',
  ogType: 'product' as const,
  ogImage: product?.images?.[0]?.full ?? undefined,
  structuredData: buildProductStructuredData(product ?? ({} as Product)),
});

export const getProductMetadata = async ({
  id,
}: {
  id: string;
}): Promise<RouteMetadata> => buildProductMetadata(await fetchProductById(id));

export const getProductPaths = async () =>
  (await fetchJson<Product[]>(PRODUCT_API)).map((product) => ({
    id: product.id,
  }));

export const fetchBlogPostBySlug = (slug: string) =>
  fetchJson<BlogPost>(`${BLOG_API}/${slug}`);

export const fetchBlogPosts = () =>
  fetchJson<Pick<BlogPost, 'slug'>[]>(BLOG_API);

export const buildBlogPostMetadata = async ({
  slug,
}: {
  slug: string;
}): Promise<RouteMetadata> => {
  const post = await fetchBlogPostBySlug(slug);
  return {
    title: `${post.title} | Blog PuraNatura`,
    description: post.excerpt,
    ogType: 'article' as const,
    ogImage: post.featuredImage,
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      image: post.featuredImage,
      datePublished: post.publishDate,
      author: {
        '@type': 'Organization',
        name: 'PuraNatura',
      },
    },
  };
};

export const getBlogPostPaths = async () =>
  (await fetchBlogPosts()).map((post) => ({ slug: post.slug }));
