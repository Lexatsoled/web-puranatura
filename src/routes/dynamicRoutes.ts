import { Product } from '../types';

export interface RouteMetadata {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogType?: 'website' | 'article' | 'product';
  ogImage?: string;
  structuredData?: Record<string, unknown>;
}

interface DynamicRoute<T = unknown> {
  path: string;
  getMetadata: (params: T) => Promise<RouteMetadata>;
  generateStaticPaths?: () => Promise<T[]>;
}

interface CategoryParams {
  category: string;
}

interface ProductParams {
  id: string;
}

interface BlogPostParams {
  slug: string;
}

// Rutas dinámicas para categorías
export const categoryRoute: DynamicRoute<CategoryParams> = {
  path: '/tienda/categoria/:category',
  async getMetadata({ category }) {
    return {
      title: `${category} | Pureza Naturalis`,
      description: `Descubre nuestra selección de productos naturales en la categoría ${category}. Productos de alta calidad para tu bienestar.`,
      ogType: 'website',
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: category,
        description: `Productos naturales en la categoría ${category}`,
      },
    };
  },
  async generateStaticPaths() {
    const categories = [
      'suplementos',
      'herbolaria',
      'aceites-esenciales',
      'productos-naturales',
      'remedios-homeopaticos',
    ];
    return categories.map((category) => ({ category }));
  },
};

// Rutas dinámicas para productos
export const productRoute: DynamicRoute<ProductParams> = {
  path: '/tienda/producto/:id',
  async getMetadata({ id }) {
    // Aquí obtendrías el producto de tu base de datos o API
    const product = (await fetch(`/api/products/${id}`).then((res) =>
      res.json()
    )) as Product;

    return {
      title: `${product.name} | Pureza Naturalis`,
      description: product.description || product.description,
      ogType: 'product',
      ogImage: product.images[0]?.full,
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description,
        image: product.images.map((img) => img.full),
        offers: {
          '@type': 'Offer',
          price: product.price,
          priceCurrency: 'EUR',
          availability: product.stock ? 'InStock' : 'OutOfStock',
        },
      },
    };
  },
  async generateStaticPaths() {
    // Aquí obtendrías todos los IDs de productos
    const products = (await fetch('/api/products').then((res) =>
      res.json()
    )) as Product[];
    return products.map((product) => ({ id: product.id }));
  },
};

// Rutas dinámicas para posts del blog
export const blogPostRoute: DynamicRoute<BlogPostParams> = {
  path: '/blog/:slug',
  async getMetadata({ slug }) {
    const post = await fetch(`/api/blog/${slug}`).then((res) => res.json());

    return {
      title: `${post.title} | Blog Pureza Naturalis`,
      description: post.excerpt,
      ogType: 'article',
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
          name: 'Pureza Naturalis',
        },
      },
    };
  },
  async generateStaticPaths() {
    const posts = await fetch('/api/blog').then((res) => res.json());
    return posts.map((post: { slug: string }) => ({ slug: post.slug }));
  },
};

export const dynamicRoutes = [categoryRoute, productRoute, blogPostRoute];
