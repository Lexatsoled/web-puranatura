# ⚡ INSTRUCCIONES PERFORMANCE

> Guía completa de optimización: Bundle, lazy loading, imágenes, Web Vitals  
> Stack: Vite + React + Sharp + Lighthouse + Web Vitals

---

## 1. Análisis de Bundle

### 1.1 Visualizador de Bundle

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
      filename: 'dist/stats.html'
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separar vendor chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'state-vendor': ['zustand', 'immer'],
          'ui-vendor': ['clsx', 'dompurify']
        }
      }
    },
    chunkSizeWarningLimit: 500,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
});
```

### 1.2 Analizar Bundle

```bash
# Generar reporte de bundle
npm run build

# Abrir stats.html para ver visualización
# Buscar:
# - Chunks > 500KB (dividir)
# - Dependencias duplicadas (eliminar)
# - Dead code (tree shaking)
```

---

## 2. Code Splitting

### 2.1 Lazy Loading de Rutas

```typescript
// src/router/routes.tsx
import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import SimpleLayout from '@/components/layout/SimpleLayout';
import LoadingSpinner from '@/components/common/LoadingSpinner';

// Lazy loading de páginas
const HomePage = lazy(() => import('@/pages/HomePage'));
const ProductsPage = lazy(() => import('@/pages/ProductsPage'));
const ProductDetailPage = lazy(() => import('@/pages/ProductDetailPage'));
const CartPage = lazy(() => import('@/pages/CartPage'));
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));

// Wrapper con Suspense
const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingSpinner />}>
    {children}
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <SimpleLayout />,
    children: [
      { 
        index: true, 
        element: <SuspenseWrapper><HomePage /></SuspenseWrapper> 
      },
      { 
        path: 'productos', 
        element: <SuspenseWrapper><ProductsPage /></SuspenseWrapper> 
      },
      { 
        path: 'productos/:id', 
        element: <SuspenseWrapper><ProductDetailPage /></SuspenseWrapper> 
      },
      { 
        path: 'carrito', 
        element: <SuspenseWrapper><CartPage /></SuspenseWrapper> 
      },
      { 
        path: 'checkout', 
        element: <SuspenseWrapper><CheckoutPage /></SuspenseWrapper> 
      },
      { 
        path: 'perfil', 
        element: <SuspenseWrapper><ProfilePage /></SuspenseWrapper> 
      }
    ]
  }
]);
```

### 2.2 Lazy Loading de Componentes

```typescript
// src/pages/HomePage.tsx
import { lazy, Suspense } from 'react';

// Componentes pesados cargados bajo demanda
const HeavyChart = lazy(() => import('@/components/HeavyChart'));
const ProductCarousel = lazy(() => import('@/components/ProductCarousel'));

export default function HomePage() {
  return (
    <div>
      <h1>Inicio</h1>
      
      {/* Contenido crítico */}
      <HeroSection />
      
      {/* Contenido secundario lazy loaded */}
      <Suspense fallback={<div>Cargando productos...</div>}>
        <ProductCarousel />
      </Suspense>
      
      {/* Contenido below-the-fold */}
      <Suspense fallback={<div>Cargando gráfico...</div>}>
        <HeavyChart />
      </Suspense>
    </div>
  );
}
```

### 2.3 Dynamic Imports

```typescript
// src/utils/dynamicImports.ts

// Importar solo cuando se necesita
export const loadPDFLibrary = async () => {
  const { jsPDF } = await import('jspdf');
  return jsPDF;
};

export const loadExcelLibrary = async () => {
  const XLSX = await import('xlsx');
  return XLSX;
};

// Uso en componente
import { loadPDFLibrary } from '@/utils/dynamicImports';

function ExportButton() {
  const handleExportPDF = async () => {
    const jsPDF = await loadPDFLibrary();
    const doc = new jsPDF();
    doc.text('Reporte', 10, 10);
    doc.save('reporte.pdf');
  };

  return <button onClick={handleExportPDF}>Exportar PDF</button>;
}
```

---

## 3. Optimización de Imágenes

### 3.1 Responsive Images

```typescript
// src/components/ProductImage/ProductImage.tsx
import { useState, useEffect } from 'react';

interface ProductImageProps {
  src: string;
  alt: string;
  sizes?: string;
  className?: string;
}

export function ProductImage({ 
  src, 
  alt, 
  sizes = '(max-width: 768px) 100vw, 50vw',
  className = '' 
}: ProductImageProps) {
  const [currentSrc, setCurrentSrc] = useState('');

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => setCurrentSrc(src);
  }, [src]);

  // Generar srcset para diferentes tamaños
  const srcset = [
    `${src}?w=320 320w`,
    `${src}?w=640 640w`,
    `${src}?w=960 960w`,
    `${src}?w=1280 1280w`
  ].join(', ');

  return (
    <img
      src={currentSrc || '/placeholder.png'}
      srcSet={srcset}
      sizes={sizes}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
    />
  );
}
```

### 3.2 Lazy Loading de Imágenes

```typescript
// src/components/LazyImage/LazyImage.tsx
import { useEffect, useRef, useState } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  placeholder?: string;
  className?: string;
}

export function LazyImage({ 
  src, 
  alt, 
  placeholder = '/placeholder.png',
  className = '' 
}: LazyImageProps) {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setImageSrc(src);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '50px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [src]);

  return (
    <img
      ref={imgRef}
      src={imageSrc}
      alt={alt}
      className={`${className} ${isLoaded ? 'loaded' : 'loading'}`}
      onLoad={() => setIsLoaded(true)}
    />
  );
}
```

### 3.3 Optimización con Sharp (Build)

```javascript
// scripts/optimize-images.mjs
import sharp from 'sharp';
import { readdir, mkdir } from 'fs/promises';
import { join } from 'path';

const inputDir = './public/images/products';
const outputDir = './public/images/optimized';

const sizes = [320, 640, 960, 1280];
const quality = 80;

async function optimizeImages() {
  // Crear directorio de salida
  await mkdir(outputDir, { recursive: true });

  // Obtener imágenes
  const files = await readdir(inputDir);
  const images = files.filter(f => /\.(jpg|jpeg|png)$/i.test(f));

  for (const image of images) {
    const inputPath = join(inputDir, image);
    const name = image.replace(/\.(jpg|jpeg|png)$/i, '');

    // Generar múltiples tamaños
    for (const size of sizes) {
      const outputPath = join(outputDir, `${name}-${size}.webp`);
      
      await sharp(inputPath)
        .resize(size, null, { withoutEnlargement: true })
        .webp({ quality })
        .toFile(outputPath);

      console.log(`✓ ${name}-${size}.webp`);
    }
  }

  console.log(`\n✅ Optimizadas ${images.length} imágenes`);
}

optimizeImages();
```

```bash
# Ejecutar optimización
node scripts/optimize-images.mjs
```

---

## 4. Web Vitals Monitoring

### 4.1 Reporte de Web Vitals

```typescript
// src/utils/webVitals.ts
import { onCLS, onFID, onFCP, onLCP, onTTFB, Metric } from 'web-vitals';

interface WebVitalsReport {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
}

export function reportWebVitals(onReport?: (metric: WebVitalsReport) => void) {
  const handleMetric = (metric: Metric) => {
    const report: WebVitalsReport = {
      name: metric.name,
      value: metric.value,
      rating: metric.rating || 'good',
      delta: metric.delta
    };

    // Log en desarrollo
    if (import.meta.env.DEV) {
      console.log(`[Web Vitals] ${report.name}:`, {
        value: `${report.value.toFixed(2)}ms`,
        rating: report.rating
      });
    }

    // Enviar a analytics (producción)
    if (import.meta.env.PROD && onReport) {
      onReport(report);
    }
  };

  onCLS(handleMetric);  // Cumulative Layout Shift
  onFID(handleMetric);  // First Input Delay
  onFCP(handleMetric);  // First Contentful Paint
  onLCP(handleMetric);  // Largest Contentful Paint
  onTTFB(handleMetric); // Time to First Byte
}

// src/main.tsx
import { reportWebVitals } from './utils/webVitals';

reportWebVitals((metric) => {
  // Enviar a analytics
  if (window.gtag) {
    window.gtag('event', metric.name, {
      value: Math.round(metric.value),
      metric_rating: metric.rating
    });
  }
});
```

### 4.2 Monitoreo de Performance

```typescript
// src/hooks/usePerformanceMonitor.ts
import { useEffect } from 'react';

export function usePerformanceMonitor(componentName: string) {
  useEffect(() => {
    const startMark = `${componentName}-start`;
    const endMark = `${componentName}-end`;
    const measureName = `${componentName}-render`;

    performance.mark(startMark);

    return () => {
      performance.mark(endMark);
      performance.measure(measureName, startMark, endMark);

      const measure = performance.getEntriesByName(measureName)[0];
      if (measure && import.meta.env.DEV) {
        console.log(`[Performance] ${componentName}: ${measure.duration.toFixed(2)}ms`);
      }

      performance.clearMarks(startMark);
      performance.clearMarks(endMark);
      performance.clearMeasures(measureName);
    };
  }, [componentName]);
}

// Uso en componente
export function HeavyComponent() {
  usePerformanceMonitor('HeavyComponent');

  return <div>{/* contenido */}</div>;
}
```

---

## 5. Memoización y Optimización React

### 5.1 React.memo para Componentes

```typescript
// src/components/ProductList/ProductList.tsx
import { memo } from 'react';

interface ProductListProps {
  products: Product[];
  onProductClick: (id: string) => void;
}

export const ProductList = memo<ProductListProps>(({ products, onProductClick }) => {
  return (
    <div className="product-list">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onClick={() => onProductClick(product.id)}
        />
      ))}
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparación
  return (
    prevProps.products.length === nextProps.products.length &&
    prevProps.products.every((p, i) => p.id === nextProps.products[i].id)
  );
});
```

### 5.2 useMemo para Cálculos Costosos

```typescript
// src/hooks/useFilteredProducts.ts
import { useMemo } from 'react';

export function useFilteredProducts(
  products: Product[],
  searchTerm: string,
  category: string
) {
  return useMemo(() => {
    let filtered = products;

    // Filtro por búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
      );
    }

    // Filtro por categoría
    if (category) {
      filtered = filtered.filter(p => p.category === category);
    }

    // Ordenar por relevancia
    return filtered.sort((a, b) => {
      if (searchTerm) {
        const aScore = a.name.toLowerCase().indexOf(searchTerm.toLowerCase());
        const bScore = b.name.toLowerCase().indexOf(searchTerm.toLowerCase());
        return aScore - bScore;
      }
      return 0;
    });
  }, [products, searchTerm, category]);
}
```

### 5.3 useCallback para Funciones

```typescript
// src/pages/ProductsPage.tsx
import { useState, useCallback } from 'react';

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);

  // Función memoizada
  const handleAddToCart = useCallback((productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      cartStore.addItem({
        productId: product.id,
        quantity: 1,
        price: product.price
      });
    }
  }, [products]);

  return (
    <ProductList 
      products={products} 
      onAddToCart={handleAddToCart} 
    />
  );
}
```

---

## 6. Caching y Persistencia

### 6.1 Service Worker para Cache

```typescript
// public/service-worker.js
const CACHE_NAME = 'puranatura-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/assets/main.js',
  '/assets/main.css'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - devolver desde cache
        if (response) {
          return response;
        }

        // Clone request
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then((response) => {
          // Verificar respuesta válida
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone response
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
  );
});
```

### 6.2 HTTP Cache Headers (Backend)

```typescript
// backend/src/middleware/cache.middleware.ts
import { Request, Response, NextFunction } from 'express';

export const cacheMiddleware = (duration: number) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Solo cachear GET
    if (req.method !== 'GET') {
      return next();
    }

    // Set cache headers
    res.set({
      'Cache-Control': `public, max-age=${duration}`,
      'Expires': new Date(Date.now() + duration * 1000).toUTCString()
    });

    next();
  };
};

// Uso en rutas
app.get('/api/products', 
  cacheMiddleware(3600), // 1 hora
  ProductController.getAll
);

app.get('/api/products/:id', 
  cacheMiddleware(1800), // 30 minutos
  ProductController.getById
);
```

---

## 7. Lighthouse y Auditoría

### 7.1 Ejecutar Lighthouse

```bash
# Instalar Lighthouse CLI
npm install -g lighthouse

# Ejecutar auditoría
lighthouse http://localhost:5173 \
  --output html \
  --output-path ./reports/lighthouse-report.html \
  --view

# Auditoría específica
lighthouse http://localhost:5173 \
  --only-categories=performance \
  --view
```

### 7.2 Metas de Performance

| Métrica | Objetivo | Actual | Estado |
|---------|----------|--------|--------|
| Performance Score | > 90 | 85 | 🟡 |
| FCP (First Contentful Paint) | < 1.8s | 1.2s | ✅ |
| LCP (Largest Contentful Paint) | < 2.5s | 2.1s | ✅ |
| TBT (Total Blocking Time) | < 200ms | 180ms | ✅ |
| CLS (Cumulative Layout Shift) | < 0.1 | 0.05 | ✅ |
| Speed Index | < 3.4s | 2.8s | ✅ |

---

## 8. Optimización de Producción

### 8.1 Build Optimizado

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    target: 'es2015',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info']
      }
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('react')) {
              return 'react-vendor';
            }
            if (id.includes('zustand')) {
              return 'state-vendor';
            }
            return 'vendor';
          }
        }
      }
    },
    chunkSizeWarningLimit: 500,
    sourcemap: false, // Desactivar en producción
    assetsInlineLimit: 4096 // Inline assets < 4KB
  }
});
```

### 8.2 Compresión (Backend)

```typescript
// backend/src/app.ts
import compression from 'compression';

app.use(compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
  level: 6 // Nivel de compresión (0-9)
}));
```

---

## 9. Checklist de Performance

### 9.1 Bundle

- [ ] Bundle total < 300KB (gzipped)
- [ ] Chunks individuales < 150KB
- [ ] Vendor chunks separados
- [ ] Tree shaking activado
- [ ] Dead code eliminado
- [ ] Source maps desactivados en prod

### 9.2 Loading

- [ ] Lazy loading de rutas
- [ ] Code splitting por feature
- [ ] Dynamic imports para código pesado
- [ ] Suspense con fallbacks
- [ ] Preload de recursos críticos

### 9.3 Imágenes

- [ ] Formato WebP
- [ ] Responsive images (srcset)
- [ ] Lazy loading (loading="lazy")
- [ ] Dimensiones explícitas (width/height)
- [ ] Compresión < 100KB por imagen

### 9.4 Web Vitals

- [ ] LCP < 2.5s
- [ ] FID < 100ms
- [ ] CLS < 0.1
- [ ] FCP < 1.8s
- [ ] TTFB < 800ms

### 9.5 Caching

- [ ] Service Worker registrado
- [ ] Cache headers configurados
- [ ] Static assets cacheados
- [ ] API responses cacheadas
- [ ] localStorage para estado

---

**Estado**: ✅ Guía de Performance Completa
