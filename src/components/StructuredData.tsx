/**
 * SEO Structured Data - JSON-LD Components
 *
 * Componentes para generar structured data compatible con schema.org
 * que permite rich snippets en Google Search Results.
 *
 * Tipos implementados:
 * - Product (productos individuales)
 * - Organization (info de la empresa)
 * - WebSite (info del sitio)
 * - BreadcrumbList (navegación)
 * - BlogPosting (posts del blog)
 */

import React from 'react';

// Tipo Product simplificado para structured data
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image?: string;
  gallery?: string[];
  brand?: string;
  rating?: number;
  reviews?: Array<{
    author?: string;
    date?: string;
    text: string;
    rating: number;
  }>;
}

// JSON value type for structured data
type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

interface StructuredDataProps {
  data: JsonValue;
}

/**
 * Componente base para inyectar JSON-LD en el head
 */
export const StructuredData: React.FC<StructuredDataProps> = ({ data }) => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
};

/**
 * Product Schema - Para páginas de productos
 *
 * Rich snippets incluyen:
 * - Imagen del producto
 * - Precio
 * - Disponibilidad
 * - Rating y reseñas
 * - Marca
 *
 * Ejemplo de uso:
 * <ProductStructuredData product={product} />
 */
interface ProductStructuredDataProps {
  product: Product;
  url?: string;
}

export const ProductStructuredData: React.FC<ProductStructuredDataProps> = ({
  product,
  url,
}) => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image
      ? [
          `https://web.purezanaturalis.com${product.image}`,
          // Agregar más imágenes si existen
          ...(product.gallery || []).map(
            (img: string) => `https://web.purezanaturalis.com${img}`
          ),
        ]
      : [],
    brand: {
      '@type': 'Brand',
      name: product.brand || 'Pureza Naturalis',
    },
    offers: {
      '@type': 'Offer',
      url: url || `https://web.purezanaturalis.com/product/${product.id}`,
      priceCurrency: 'USD',
      price: product.price,
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0], // Válido por 1 año
      availability:
        product.stock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
    ...(product.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating,
        bestRating: 5,
        worstRating: 1,
        ratingCount: product.reviews?.length || 1,
      },
    }),
    ...(product.reviews &&
      product.reviews.length > 0 && {
        review: product.reviews.map((review) => ({
          '@type': 'Review',
          author: {
            '@type': 'Person',
            name: review.author || 'Cliente Verificado',
          },
          datePublished: review.date || new Date().toISOString().split('T')[0],
          reviewBody: review.text,
          reviewRating: {
            '@type': 'Rating',
            ratingValue: review.rating,
            bestRating: 5,
            worstRating: 1,
          },
        })),
      }),
  };

  return <StructuredData data={structuredData} />;
};

/**
 * Organization Schema - Para páginas de empresa (About, Contact)
 */
interface OrganizationStructuredDataProps {
  url?: string;
}

export const OrganizationStructuredData: React.FC<
  OrganizationStructuredDataProps
> = ({ url = 'https://web.purezanaturalis.com' }) => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Pureza Naturalis - Terapias Naturales',
    alternateName: 'Pureza Naturalis',
    url: url,
    logo: `${url}/logo.png`,
    description:
      'Productos naturales y terapias holísticas para tu bienestar. Suplementos naturales, vitaminas, minerales y productos orgánicos de la más alta calidad.',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'ES', // Ajustar según ubicación
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: ['Spanish', 'English'],
    },
    sameAs: [
      // Redes sociales (agregar cuando estén disponibles)
      'https://www.facebook.com/purezanaturalis',
      'https://www.instagram.com/purezanaturalis',
      'https://twitter.com/purezanaturalis',
    ],
  };

  return <StructuredData data={structuredData} />;
};

/**
 * WebSite Schema - Para la homepage
 */
interface WebSiteStructuredDataProps {
  url?: string;
}

export const WebSiteStructuredData: React.FC<WebSiteStructuredDataProps> = ({
  url = 'https://web.purezanaturalis.com',
}) => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Pureza Naturalis - Terapias Naturales',
    url: url,
    description:
      'Tu tienda online de productos naturales, suplementos, vitaminas y terapias holísticas. Mejora tu bienestar con productos naturales de calidad.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${url}/store?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return <StructuredData data={structuredData} />;
};

/**
 * BreadcrumbList Schema - Para navegación
 */
interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbStructuredDataProps {
  items: BreadcrumbItem[];
}

export const BreadcrumbStructuredData: React.FC<
  BreadcrumbStructuredDataProps
> = ({ items }) => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return <StructuredData data={structuredData} />;
};

/**
 * BlogPosting Schema - Para posts del blog
 */
interface BlogPostingStructuredDataProps {
  title: string;
  description: string;
  author: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
  url: string;
}

export const BlogPostingStructuredData: React.FC<
  BlogPostingStructuredDataProps
> = ({
  title,
  description,
  author,
  datePublished,
  dateModified,
  image,
  url,
}) => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: description,
    author: {
      '@type': 'Person',
      name: author,
    },
    datePublished: datePublished,
    dateModified: dateModified || datePublished,
    image: image || 'https://web.purezanaturalis.com/default-blog-image.jpg',
    publisher: {
      '@type': 'Organization',
      name: 'Pureza Naturalis',
      logo: {
        '@type': 'ImageObject',
        url: 'https://web.purezanaturalis.com/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };

  return <StructuredData data={structuredData} />;
};

/**
 * Hook para generar meta tags dinámicos
 *
 * Ejemplo de uso:
 * const { setMetaTags } = useMetaTags();
 *
 * useEffect(() => {
 *   setMetaTags({
 *     title: 'Producto - Pureza Naturalis',
 *     description: 'Descripción del producto...',
 *     image: '/product.jpg'
 *   });
 * }, []);
 */
// useMetaTags hook moved to src/hooks/useMetaTags.ts
