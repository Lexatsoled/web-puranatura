interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  rating?: number;
  reviewCount?: number;
}

/**
 * Genera schema JSON-LD para producto
 */
export function generateProductSchema(product: Product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images,
    sku: `PRD-${product.id}`,
    brand: {
      '@type': 'Brand',
      name: 'Pureza Naturalis',
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      url: `https://purezanaturalis.com/products/${product.id}`,
    },
    ...(product.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating,
        reviewCount: product.reviewCount || 0,
      },
    }),
  };
}

/**
 * Genera schema JSON-LD para organización
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Pureza Naturalis',
    url: 'https://purezanaturalis.com',
    logo: 'https://purezanaturalis.com/logo.png',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+34-XXX-XXX-XXX',
      contactType: 'Customer Service',
      email: 'info@purezanaturalis.com',
    },
    sameAs: [
      'https://www.facebook.com/purezanaturalis',
      'https://www.instagram.com/purezanaturalis',
      'https://twitter.com/purezanaturalis',
    ],
  };
}

/**
 * Genera schema JSON-LD para breadcrumb
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Genera schema JSON-LD para búsqueda de sitio
 */
export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Pureza Naturalis',
    url: 'https://purezanaturalis.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://purezanaturalis.com/products?search={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };
}
