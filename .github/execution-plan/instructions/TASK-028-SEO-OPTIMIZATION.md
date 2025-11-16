# TASK-028: SEO Optimization

## 📋 INFORMACIÓN

**ID**: TASK-028 | **Fase**: 3 | **Prioridad**: ALTA | **Estimación**: 3h

## 🎯 OBJETIVO

Optimizar SEO con meta tags, sitemap.xml, robots.txt, structured data (JSON-LD) y Open Graph.

## 🛠️ IMPLEMENTACIÓN

### Paso 1: React Helmet para Meta Tags

**Archivo**: `frontend/src/components/SEOHead.tsx`

```typescript
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  jsonLd?: object;
}

export function SEOHead({
  title,
  description,
  canonical,
  image = '/og-image.jpg',
  type = 'website',
  jsonLd,
}: SEOHeadProps) {
  const fullTitle = `${title} | Pureza Naturalis`;
  const url = canonical || window.location.href;

  return (
    <Helmet>
      {/* Basic */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Pureza Naturalis" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* JSON-LD */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
}
```

### Paso 2: Structured Data para Productos

**Archivo**: `frontend/src/utils/structuredData.ts`

```typescript
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
```

### Paso 3: Uso en Páginas

**Archivo**: `frontend/src/pages/ProductDetail.tsx`

```typescript
import { SEOHead } from '../components/SEOHead';
import { generateProductSchema, generateBreadcrumbSchema } from '../utils/structuredData';

export function ProductDetail({ product }: { product: Product }) {
  const breadcrumbs = [
    { name: 'Inicio', url: 'https://purezanaturalis.com' },
    { name: 'Productos', url: 'https://purezanaturalis.com/products' },
    { name: product.category, url: `https://purezanaturalis.com/products?category=${product.category}` },
    { name: product.name, url: `https://purezanaturalis.com/products/${product.id}` },
  ];

  return (
    <>
      <SEOHead
        title={product.name}
        description={product.description}
        canonical={`https://purezanaturalis.com/products/${product.id}`}
        image={product.images[0]}
        type="product"
        jsonLd={[
          generateProductSchema(product),
          generateBreadcrumbSchema(breadcrumbs),
        ]}
      />
      
      {/* Rest of component */}
    </>
  );
}
```

### Paso 4: Sitemap Generator

**Archivo**: `backend/src/routes/sitemap.ts`

```typescript
import { FastifyPluginAsync } from 'fastify';
import { db } from '../db/index.js';

export const sitemapRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/sitemap.xml', async (request, reply) => {
    const products = db.prepare('SELECT id, updated_at FROM products').all();
    const categories = ['vitaminas', 'minerales', 'suplementos', 'hierbas', 'aceites'];

    const urls = [
      // Static pages
      { loc: '/', priority: 1.0, changefreq: 'daily' },
      { loc: '/products', priority: 0.9, changefreq: 'daily' },
      { loc: '/about', priority: 0.5, changefreq: 'monthly' },
      { loc: '/contact', priority: 0.5, changefreq: 'monthly' },
      
      // Categories
      ...categories.map(cat => ({
        loc: `/products?category=${cat}`,
        priority: 0.8,
        changefreq: 'daily',
      })),
      
      // Products
      ...products.map((p: any) => ({
        loc: `/products/${p.id}`,
        lastmod: p.updated_at,
        priority: 0.7,
        changefreq: 'weekly',
      })),
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>https://purezanaturalis.com${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    reply.type('application/xml').send(xml);
  });
};
```

### Paso 5: Robots.txt

**Archivo**: `frontend/public/robots.txt`

```txt
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /cart
Disallow: /checkout
Disallow: /profile

Sitemap: https://purezanaturalis.com/sitemap.xml
```

### Paso 6: Prerender para Crawlers

**Archivo**: `backend/src/middleware/prerender.ts`

```typescript
import { FastifyRequest, FastifyReply } from 'fastify';

const BOT_USER_AGENTS = [
  'googlebot',
  'bingbot',
  'slurp',
  'duckduckbot',
  'baiduspider',
  'yandexbot',
  'facebookexternalhit',
  'twitterbot',
];

/**
 * Detectar si es un bot
 */
function isBot(userAgent: string): boolean {
  return BOT_USER_AGENTS.some(bot => 
    userAgent.toLowerCase().includes(bot)
  );
}

/**
 * Middleware para prerender
 */
export async function prerenderMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userAgent = request.headers['user-agent'] || '';
  
  if (isBot(userAgent)) {
    // Aquí podrías usar un servicio de prerendering
    // como Prerender.io o generar HTML server-side
    request.log.info({ userAgent }, 'Bot detected');
  }
}
```

### Paso 7: HTML Meta Tags Base

**Archivo**: `frontend/index.html`

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- SEO -->
  <meta name="robots" content="index, follow">
  <meta name="googlebot" content="index, follow">
  <meta name="author" content="Pureza Naturalis">
  <meta name="keywords" content="vitaminas, suplementos, productos naturales, salud">
  
  <!-- Geo -->
  <meta name="geo.region" content="ES">
  <meta name="geo.placename" content="España">
  
  <!-- Verification -->
  <meta name="google-site-verification" content="YOUR_VERIFICATION_CODE">
  
  <!-- Favicons -->
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  
  <!-- Manifest -->
  <link rel="manifest" href="/manifest.json">
  
  <title>Pureza Naturalis - Productos Naturales y Suplementos</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>
```

### Paso 8: Google Analytics 4

**Archivo**: `frontend/src/utils/analytics.ts`

```typescript
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export function initGA4(measurementId: string) {
  // Load gtag.js
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  script.async = true;
  document.head.appendChild(script);

  // Initialize
  window.gtag = function(...args: any[]) {
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push(args);
  };

  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    send_page_view: false, // Manual page views
  });
}

export function trackPageView(path: string) {
  window.gtag?.('event', 'page_view', {
    page_path: path,
  });
}

export function trackEvent(name: string, params?: object) {
  window.gtag?.('event', name, params);
}
```

## ✅ CRITERIOS DE ACEPTACIÓN

- [x] Meta tags dinámicos
- [x] Open Graph completo
- [x] Structured data (JSON-LD)
- [x] Sitemap.xml dinámico
- [x] Robots.txt configurado
- [x] Canonical URLs
- [x] Google Analytics 4
- [x] Bot detection

## 🧪 VALIDACIÓN

```bash
# Validar structured data
curl https://purezanaturalis.com/products/1 | grep 'application/ld+json'

# Ver sitemap
curl https://purezanaturalis.com/sitemap.xml

# Test Open Graph
curl -I https://purezanaturalis.com/products/1 | grep -i "og:"

# Rich Results Test
# https://search.google.com/test/rich-results

# Lighthouse SEO
npx lighthouse https://purezanaturalis.com --only-categories=seo --view
```

---

**Status**: COMPLETO ✅
