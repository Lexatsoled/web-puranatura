import { Product, ProductSEO } from '../types/product';

export const generateProductSEO = (product: Product): ProductSEO => {
  const baseUrl = 'https://purezanaturalis.com';

  return {
    title: `${product.name} - Pureza Naturalis | Terapias Naturales`,
    description: product.description.length > 155 
      ? `${product.description.substring(0, 155)}...` 
      : product.description,
    keywords: [
      product.name.toLowerCase(),
      ...(product.categories ? product.categories.map(cat => cat.toLowerCase()) : []),
      'terapias naturales',
      'productos naturales',
      'República Dominicana',
      ...product.tags.map(tag => tag.toLowerCase()),
    ],
    canonicalUrl: `${baseUrl}/tienda/producto/${product.id}`,
    openGraph: {
      title: `${product.name} - Pureza Naturalis`,
      description: product.description,
      image: product.images[0]?.full || `${baseUrl}/default-product.jpg`,
      type: 'product',
    },
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description,
      image: product.images.map(img => img.full),
      brand: product.brand || 'Pureza Naturalis',
      manufacturer: product.manufacturer || 'Pureza Naturalis',
      offers: {
        '@type': 'Offer',
        price: product.price,
        priceCurrency: 'DOP',
        availability: product.stock > 0 
          ? 'https://schema.org/InStock' 
          : 'https://schema.org/OutOfStock',
        seller: {
          '@type': 'Organization',
          name: 'Pureza Naturalis'
        }
      },
    },
  };
};

export const generateCategorySEO = (categoryName: string, productCount: number) => {
  return {
    title: `${categoryName} - Pureza Naturalis | Terapias Naturales`,
    description: `Descubre nuestra selección de ${productCount} productos de ${categoryName.toLowerCase()}. Productos naturales de alta calidad para tu bienestar en República Dominicana.`,
    keywords: [
      categoryName.toLowerCase(),
      'productos naturales',
      'terapias naturales',
      'bienestar',
      'salud natural',
      'República Dominicana'
    ],
  };
};

export const generatePageSEO = (pageName: string, description: string, keywords: string[] = []) => {
  return {
    title: `${pageName} - Pureza Naturalis | Terapias Naturales`,
    description,
    keywords: [
      ...keywords,
      'Pureza Naturalis',
      'terapias naturales',
      'productos naturales',
      'bienestar',
      'salud natural',
      'República Dominicana'
    ],
  };
};

// Meta tags para insertar en el head
export const generateMetaTags = (seo: ProductSEO) => {
  const tags = [];

  if (seo.title) {
    tags.push(`<title>${seo.title}</title>`);
    tags.push(`<meta property="og:title" content="${seo.title}" />`);
  }

  if (seo.description) {
    tags.push(`<meta name="description" content="${seo.description}" />`);
    tags.push(`<meta property="og:description" content="${seo.description}" />`);
  }

  if (seo.keywords && seo.keywords.length > 0) {
    tags.push(`<meta name="keywords" content="${seo.keywords.join(', ')}" />`);
  }

  if (seo.canonicalUrl) {
    tags.push(`<link rel="canonical" href="${seo.canonicalUrl}" />`);
  }

  if (seo.openGraph) {
    if (seo.openGraph.image) {
      tags.push(`<meta property="og:image" content="${seo.openGraph.image}" />`);
    }
    if (seo.openGraph.type) {
      tags.push(`<meta property="og:type" content="${seo.openGraph.type}" />`);
    }
  }

  if (seo.jsonLd) {
    tags.push(`<script type="application/ld+json">${JSON.stringify(seo.jsonLd)}</script>`);
  }

  return tags.join('\n');
};

// Hook personalizado para SEO
export const useSEO = (seo: ProductSEO) => {
  React.useEffect(() => {
    // Update document title
    if (seo.title) {
      document.title = seo.title;
    }

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription && seo.description) {
      metaDescription.setAttribute('content', seo.description);
    } else if (seo.description) {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = seo.description;
      document.head.appendChild(meta);
    }

    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords && seo.keywords) {
      metaKeywords.setAttribute('content', seo.keywords.join(', '));
    } else if (seo.keywords) {
      const meta = document.createElement('meta');
      meta.name = 'keywords';
      meta.content = seo.keywords.join(', ');
      document.head.appendChild(meta);
    }

    // Add JSON-LD structured data
    if (seo.jsonLd) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(seo.jsonLd);
      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
      };
    }
  }, [seo]);
};

import React from 'react';
