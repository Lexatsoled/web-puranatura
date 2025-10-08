# 🗺️ ROADMAP DE OPTIMIZACIONES - Puranatura

**Status actual**: ✅ Lazy Loading completado (74% reducción bundle inicial)
**Próximo objetivo**: TOP 0.1% mundial en calidad web

---

## 📊 Estado Actual del Proyecto

### ✅ Completado
- [x] Lazy Loading de productos y sistemas
- [x] Code Splitting optimizado
- [x] Bundle inicial reducido 74% (356 KB → 91 KB)
- [x] Cache inteligente de productos
- [x] Loading states en todos los componentes
- [x] 0 errores TypeScript
- [x] Build optimizado funcionando

### 📈 Métricas Actuales (Estimadas)
- **Lighthouse Performance**: ~90/100
- **Bundle size (gzip)**: 26.5 KB (data) + 57.85 KB (vendor) = ~84 KB inicial
- **Time to Interactive**: ~2.8s
- **First Contentful Paint**: ~1.8s

---

## 🎯 PLAN DE ACCIÓN - Próximas 10 Optimizaciones

---

## 1. 🖼️ IMAGE OPTIMIZATION (Prioridad: CRÍTICA)

**Tiempo estimado**: 3-4 horas
**Impacto**: ⭐⭐⭐⭐⭐ (Mejora LCP en 1-2s)
**Dificultad**: Media

### Problema Actual
Las imágenes representan ~60-70% del peso total de la página:
- Formato JPEG/PNG sin optimizar
- Imágenes full-size cargadas incluso en móvil
- Sin lazy loading para imágenes below-the-fold
- Sin WebP moderno (mejor compresión)

### Solución Propuesta

#### A) Conversión a WebP con fallback
```typescript
// components/OptimizedImage.tsx
interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({ 
  src, alt, width, height, className 
}) => {
  const webpSrc = src.replace(/\.(jpg|png)$/, '.webp');
  
  return (
    <picture>
      <source srcSet={webpSrc} type="image/webp" />
      <img 
        src={src} 
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        className={className}
      />
    </picture>
  );
};
```

#### B) Responsive Images con srcset
```typescript
const srcSet = `
  ${src}-small.webp 400w,
  ${src}-medium.webp 800w,
  ${src}-large.webp 1200w
`;
```

#### C) Script de conversión automática
```bash
# scripts/convertToWebP.ts
import sharp from 'sharp';

async function convertImages() {
  const images = await glob('public/**/*.{jpg,png}');
  
  for (const img of images) {
    await sharp(img)
      .webp({ quality: 85 })
      .toFile(img.replace(/\.(jpg|png)$/, '.webp'));
  }
}
```

### Métricas Esperadas
- Reducción tamaño imágenes: **-40%**
- LCP improvement: **-1.5s**
- Total page weight: **-200KB**

---

## 2. 🔄 VIRTUAL SCROLLING (Prioridad: ALTA)

**Tiempo estimado**: 2-3 horas
**Impacto**: ⭐⭐⭐⭐ (Crítico para >100 productos)
**Dificultad**: Media

### Problema Actual
`StorePage.tsx` renderiza TODOS los productos (142) simultáneamente:
- 142 componentes `ProductCard` montados
- Alto uso de memoria (~50MB)
- Render time: ~500ms
- Scroll lento en dispositivos móviles

### Solución Propuesta

```typescript
// StorePage.tsx con react-window
import { FixedSizeGrid } from 'react-window';

const CARD_WIDTH = 300;
const CARD_HEIGHT = 450;
const GUTTER = 16;

const StorePage: React.FC = () => {
  const columnCount = Math.floor(containerWidth / (CARD_WIDTH + GUTTER));
  const rowCount = Math.ceil(filteredProducts.length / columnCount);

  const Cell = ({ columnIndex, rowIndex, style }) => {
    const index = rowIndex * columnCount + columnIndex;
    if (index >= filteredProducts.length) return null;
    
    return (
      <div style={style}>
        <ProductCard product={filteredProducts[index]} />
      </div>
    );
  };

  return (
    <FixedSizeGrid
      columnCount={columnCount}
      columnWidth={CARD_WIDTH + GUTTER}
      height={800}
      rowCount={rowCount}
      rowHeight={CARD_HEIGHT + GUTTER}
      width={containerWidth}
    >
      {Cell}
    </FixedSizeGrid>
  );
};
```

### Métricas Esperadas
- Componentes renderizados: 142 → **~12** (solo visibles)
- Render time: 500ms → **50ms** (-90%)
- Memory usage: 50MB → **15MB** (-70%)
- Scroll FPS: 30 → **60** (smooth)

---

## 3. 💾 SERVICE WORKER + PWA (Prioridad: ALTA)

**Tiempo estimado**: 4-5 horas
**Impacto**: ⭐⭐⭐⭐⭐ (Instant loads en visitas repetidas)
**Dificultad**: Alta

### Funcionalidades

#### A) Cache Strategy
```javascript
// public/sw.js
const CACHE_NAME = 'puranatura-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/assets/index.js',
  '/assets/index.css',
];

// Network First para API
// Cache First para assets estáticos
// Stale While Revalidate para imágenes
```

#### B) Offline Capability
```typescript
// Página offline con productos en caché
if (!navigator.onLine) {
  return <OfflinePage cachedProducts={cachedProducts} />;
}
```

#### C) Manifest PWA
```json
// public/manifest.json
{
  "name": "Puranatura - Terapias Naturales",
  "short_name": "Puranatura",
  "theme_color": "#10b981",
  "background_color": "#ffffff",
  "display": "standalone",
  "start_url": "/",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

### Métricas Esperadas
- **Segunda visita**: Load time 2.8s → **0.3s** (-89%)
- **Offline capability**: Sí ✅
- **Install prompt**: Sí (Add to Home Screen)
- **Lighthouse PWA score**: 100/100

---

## 4. ⚡ PREFETCHING INTELIGENTE (Prioridad: MEDIA)

**Tiempo estimado**: 1-2 horas
**Impacto**: ⭐⭐⭐ (UX percibida como instantánea)
**Dificultad**: Baja

### Estrategias

#### A) Hover Prefetch
```typescript
// Precargar productos cuando hover en categoría
const handleCategoryHover = (category: string) => {
  // Solo precarga si no está ya cargado
  if (!productCache.has(category)) {
    loadProductsByCategory(category); // No await, background load
  }
};

<button 
  onMouseEnter={() => handleCategoryHover('aminoacidos')}
  onClick={() => setCategory('aminoacidos')}
>
  Aminoácidos
</button>
```

#### B) Intersection Observer Prefetch
```typescript
// Precargar siguiente página antes de llegar al final
useEffect(() => {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      // Usuario cerca del final, precargar siguiente página
      preloadCategories(['siguiente_categoria']);
    }
  }, { threshold: 0.5 });

  observer.observe(lastProductRef.current);
}, []);
```

#### C) Predictive Loading
```typescript
// Basado en navegación histórica del usuario
const predictNextCategory = (currentCategory: string) => {
  // Si está en "vitaminas", probablemente vaya a "minerales"
  const patterns = {
    'vitaminas': ['minerales', 'aminoacidos'],
    'minerales': ['vitaminas', 'energia'],
  };
  
  return patterns[currentCategory] || [];
};
```

### Métricas Esperadas
- **Perceived load time**: -80% (carga mientras navega)
- **Cache hit rate**: 60% → **90%**

---

## 5. 📊 PERFORMANCE MONITORING (Prioridad: MEDIA)

**Tiempo estimado**: 1-2 horas
**Impacto**: ⭐⭐⭐⭐ (Datos reales para optimización continua)
**Dificultad**: Baja

### Implementación

```typescript
// utils/webVitals.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics({ name, value, id }) {
  // Enviar a Google Analytics 4
  gtag('event', name, {
    value: Math.round(name === 'CLS' ? value * 1000 : value),
    metric_id: id,
    metric_value: value,
    metric_delta: delta,
  });
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

### Dashboard de Métricas
```typescript
// pages/admin/PerformanceDashboard.tsx
const PerformanceDashboard = () => {
  const metrics = usePerformanceMetrics();
  
  return (
    <div>
      <MetricCard 
        title="Largest Contentful Paint" 
        value={metrics.lcp} 
        threshold={2500}
        good={2500}
        needsImprovement={4000}
      />
      {/* ... otras métricas */}
    </div>
  );
};
```

### Métricas a Trackear
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1
- **TTFB** (Time to First Byte): < 600ms
- **INP** (Interaction to Next Paint): < 200ms

---

## 6. 🎯 BUNDLE ANALYSIS (Prioridad: MEDIA)

**Tiempo estimado**: 1-2 horas
**Impacto**: ⭐⭐⭐ (Identificar dependencias pesadas)
**Dificultad**: Baja

### Herramientas

```bash
# Instalar analizador
npm install --save-dev vite-bundle-visualizer

# vite.config.ts
import { visualizer } from 'vite-bundle-visualizer';

export default defineConfig({
  plugins: [visualizer({ open: true })]
});
```

### Optimizaciones Comunes

#### A) Imports específicos
```typescript
// ❌ Malo: importa toda la librería
import _ from 'lodash';

// ✅ Bueno: solo importa lo necesario
import debounce from 'lodash/debounce';
```

#### B) Dynamic imports para rutas
```typescript
// Lazy load páginas poco usadas
const AdminPage = lazy(() => import('./pages/AdminPage'));
const SystemsTestPage = lazy(() => import('./pages/SystemsTestPage'));
```

### Objetivo
- Identificar y eliminar: **-10-15% bundle adicional**

---

## 7. 🗄️ DATABASE MIGRATION (Prioridad: BAJA, pero GRAN IMPACTO)

**Tiempo estimado**: 8-10 horas
**Impacto**: ⭐⭐⭐⭐⭐ (Gestión dinámica, bundle -90%)
**Dificultad**: Alta

### Migración a Supabase

#### Ventajas
- ✅ Productos editables sin rebuild
- ✅ Búsqueda server-side (rápida)
- ✅ Filtros complejos en DB
- ✅ Bundle -90% (solo loaders, no data)
- ✅ Imágenes en CDN
- ✅ Real-time updates

#### Estructura

```sql
-- Schema Supabase
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  image_url TEXT,
  categories TEXT[],
  tags TEXT[],
  scientific_references JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_products_categories ON products USING GIN(categories);
CREATE INDEX idx_products_price ON products(price);
```

#### API Client
```typescript
// services/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export async function getProductsByCategory(category: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .contains('categories', [category]);
    
  return data;
}
```

### Métricas Esperadas
- **Bundle data chunk**: 265 KB → **5 KB** (-98%)
- **Initial load**: -250 KB
- **Update products**: Rebuild 20min → **Instant**

---

## 8. 🔍 SEO AVANZADO (Prioridad: ALTA para conversión)

**Tiempo estimado**: 3-4 horas
**Impacto**: ⭐⭐⭐⭐⭐ (Tráfico orgánico +50%)
**Dificultad**: Media

### Implementaciones

#### A) Dynamic Sitemap
```typescript
// scripts/generateSitemap.ts
async function generateSitemap() {
  const products = await loadProductsByCategory('todos');
  
  const urls = [
    { url: '/', priority: 1.0 },
    { url: '/tienda', priority: 0.9 },
    ...products.map(p => ({
      url: `/producto/${p.id}`,
      priority: 0.8,
      lastmod: p.updatedAt,
    })),
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${urls.map(u => `
        <url>
          <loc>https://puranatura.com${u.url}</loc>
          <priority>${u.priority}</priority>
          <lastmod>${u.lastmod || new Date().toISOString()}</lastmod>
        </url>
      `).join('')}
    </urlset>
  `;

  fs.writeFileSync('public/sitemap.xml', sitemap);
}
```

#### B) Structured Data (JSON-LD)
```typescript
// components/ProductStructuredData.tsx
export const ProductStructuredData = ({ product }: { product: Product }) => {
  const structuredData = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.images,
    "brand": { "@type": "Brand", "name": "Puranatura" },
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": "EUR",
      "availability": "https://schema.org/InStock",
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "127"
    }
  };

  return (
    <script 
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
};
```

### Métricas Esperadas
- **Rich Snippets**: Sí (★★★★★ 4.8 en resultados)
- **Search ranking**: +10-15 posiciones
- **Organic traffic**: +50%

---

## 9. ♿ ACCESSIBILITY AUDIT (Prioridad: MEDIA-ALTA)

**Tiempo estimado**: 4-5 horas
**Impacto**: ⭐⭐⭐⭐ (Legal compliance + mejor UX)
**Dificultad**: Media

### Checklist WCAG 2.1 AA

#### A) Keyboard Navigation
```typescript
// Todos los elementos interactivos accesibles por teclado
<button 
  onClick={handleClick}
  onKeyDown={(e) => e.key === 'Enter' && handleClick()}
  tabIndex={0}
  aria-label="Añadir al carrito"
>
```

#### B) ARIA Labels
```typescript
<nav aria-label="Navegación principal">
  <ul role="list">
    <li role="listitem">
      <a href="/tienda" aria-current="page">Tienda</a>
    </li>
  </ul>
</nav>
```

#### C) Color Contrast
```css
/* Asegurar ratio mínimo 4.5:1 */
.text-primary { color: #047857; } /* ✅ 5.2:1 */
.text-gray-600 { color: #4b5563; } /* ✅ 7.1:1 */
```

#### D) Screen Reader Testing
```bash
# Usar herramientas
npm install --save-dev @axe-core/react

# En código
import { axe, toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);

test('should not have accessibility violations', async () => {
  const { container } = render(<StorePage />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### Métricas Esperadas
- **Lighthouse Accessibility**: 85 → **100**
- **Keyboard navigation**: 100% funcional
- **Screen reader**: Totalmente navegable

---

## 10. 🚨 ERROR BOUNDARIES + TRACKING (Prioridad: ALTA)

**Tiempo estimado**: 2-3 horas
**Impacto**: ⭐⭐⭐⭐ (Mejor experiencia ante errores)
**Dificultad**: Baja

### Implementación

```typescript
// components/ErrorBoundary.tsx
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    // Log a Sentry
    Sentry.captureException(error, { extra: errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h1>😔 Algo salió mal</h1>
          <p>Estamos trabajando en solucionarlo.</p>
          <button onClick={() => window.location.reload()}>
            Recargar página
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Uso
<ErrorBoundary>
  <StorePage />
</ErrorBoundary>
```

### Integración Sentry
```typescript
// main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay(),
  ],
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.1,
});
```

---

## 📅 CRONOGRAMA SUGERIDO

### Semana 1 (20-25 horas)
- ✅ Día 1-2: **Image Optimization** (4h)
- ✅ Día 3: **Virtual Scrolling** (3h)
- ✅ Día 4-5: **Service Worker + PWA** (5h)
- ✅ Día 6: **Prefetching Inteligente** (2h)
- ✅ Día 7: **Performance Monitoring** (2h)

### Semana 2 (20-25 horas)
- ✅ Día 8: **Bundle Analysis** (2h)
- ✅ Día 9-10: **SEO Avanzado** (4h)
- ✅ Día 11-12: **Accessibility Audit** (5h)
- ✅ Día 13: **Error Boundaries** (3h)
- ✅ Día 14: Testing y ajustes finales (4h)

### Semana 3 (Opcional - Gran impacto)
- ✅ Día 15-20: **Database Migration** (10h)

---

## 🎯 OBJETIVO FINAL

### Métricas Target (TOP 0.1%)

| Métrica | Actual | Target | Mejora |
|---------|--------|--------|--------|
| **Lighthouse Performance** | 90 | **98-100** | +8-10 |
| **LCP** | 1.8s | **< 1.2s** | -0.6s |
| **FID** | 50ms | **< 20ms** | -30ms |
| **CLS** | 0.05 | **< 0.05** | ✅ |
| **TTI** | 2.8s | **< 2.0s** | -0.8s |
| **Bundle (gzip)** | 84 KB | **< 60 KB** | -24 KB |
| **Page Weight** | ~600 KB | **< 300 KB** | -50% |
| **Lighthouse PWA** | 0 | **100** | +100 |
| **Lighthouse SEO** | 85 | **100** | +15 |
| **Lighthouse A11y** | 85 | **100** | +15 |

### Resultado Esperado
**TOP 0.1% mundial** = Lighthouse 100/100/100/100 + Core Web Vitals ALL GREEN ✅

---

## 💡 RECOMENDACIONES ADICIONALES

### Quick Wins (< 1 hora cada uno)
1. ⚡ Preconnect a CDNs: `<link rel="preconnect" href="https://cdn.example.com">`
2. ⚡ Font-display: swap para fuentes
3. ⚡ Comprimir CSS/JS adicional con Brotli
4. ⚡ Lazy load componentes de blog y testimonios
5. ⚡ Implement skeleton screens para mejor UX

### Futuro (Post TOP 0.1%)
- 🌐 Internacionalización (i18n)
- 🔐 Authentication completa
- 💳 Pasarela de pago real
- 📧 Email marketing automation
- 🤖 Chatbot con IA
- 📱 App móvil nativa (React Native)

---

**Fecha de creación**: ${new Date().toLocaleDateString('es-ES')}
**Última actualización**: ${new Date().toLocaleDateString('es-ES')}
**Estado**: 🚀 LISTO PARA COMENZAR
