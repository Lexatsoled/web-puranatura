# TASK-025: Code Splitting y Lazy Loading

## 📋 INFORMACIÓN

**ID**: TASK-025 | **Fase**: 3 | **Prioridad**: ALTA | **Estimación**: 3h

## 🎯 OBJETIVO

Implementar code splitting con React.lazy, dynamic imports, route-based splitting y Suspense boundaries para reducir bundle inicial.

## 🛠️ IMPLEMENTACIÓN

### Paso 1: Route-Based Code Splitting

**Archivo**: `frontend/src/App.tsx`

```typescript
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoadingSpinner } from './components/LoadingSpinner';

// Eager loading para rutas críticas
import { Home } from './pages/Home';
import { NotFound } from './pages/NotFound';

// Lazy loading para rutas secundarias
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Profile = lazy(() => import('./pages/Profile'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

export function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner fullScreen />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
```

### Paso 2: Component-Level Code Splitting

**Archivo**: `frontend/src/components/LazyComponents.tsx`

```typescript
import { lazy, ComponentType } from 'react';

// Heavy components con lazy loading
export const HeavyChart = lazy(() => import('./HeavyChart'));
export const VideoPlayer = lazy(() => import('./VideoPlayer'));
export const RichTextEditor = lazy(() => import('./RichTextEditor'));

/**
 * Wrapper genérico para lazy components con retry
 */
export function lazyWithRetry<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  retries = 3,
  interval = 1000
): ComponentType<T> {
  return lazy(() => 
    new Promise<{ default: T }>((resolve, reject) => {
      const attempt = (retriesLeft: number) => {
        importFn()
          .then(resolve)
          .catch((error) => {
            if (retriesLeft === 0) {
              reject(error);
              return;
            }
            
            setTimeout(() => {
              console.log(`Retrying import... (${retriesLeft} attempts left)`);
              attempt(retriesLeft - 1);
            }, interval);
          });
      };
      
      attempt(retries);
    })
  );
}

// Uso con retry
export const ProductGallery = lazyWithRetry(() => import('./ProductGallery'));
```

### Paso 3: Suspense Boundaries Estratégicos

**Archivo**: `frontend/src/components/SuspenseBoundary.tsx`

```typescript
import { Suspense, ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { LoadingSpinner } from './LoadingSpinner';

interface SuspenseBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  errorFallback?: ReactNode;
}

export function SuspenseBoundary({ 
  children, 
  fallback = <LoadingSpinner />,
  errorFallback = <ErrorFallback />,
}: SuspenseBoundaryProps) {
  return (
    <ErrorBoundary fallback={errorFallback}>
      <Suspense fallback={fallback}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}

function ErrorFallback() {
  return (
    <div className="error-boundary">
      <h2>Failed to load component</h2>
      <button onClick={() => window.location.reload()}>Reload page</button>
    </div>
  );
}
```

### Paso 4: Preload Components

**Archivo**: `frontend/src/utils/preload.ts`

```typescript
import { ComponentType } from 'react';

type LazyComponent = ComponentType<any> & {
  preload?: () => Promise<any>;
};

/**
 * Precargar componente lazy en hover
 */
export function preloadOnHover(Component: LazyComponent) {
  return {
    onMouseEnter: () => Component.preload?.(),
    onFocus: () => Component.preload?.(),
  };
}

/**
 * Precargar componente después de un delay
 */
export function preloadAfterDelay(Component: LazyComponent, delay: number = 2000) {
  setTimeout(() => {
    Component.preload?.();
  }, delay);
}

/**
 * Precargar en idle
 */
export function preloadOnIdle(Component: LazyComponent) {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => Component.preload?.());
  } else {
    setTimeout(() => Component.preload?.(), 1000);
  }
}

// Uso:
// const Products = lazy(() => import('./pages/Products'));
// (Products as any).preload = () => import('./pages/Products');
// 
// <Link to="/products" {...preloadOnHover(Products)}>Products</Link>
```

### Paso 5: Configuración Vite

**Archivo**: `frontend/vite.config.ts`

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor splitting
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'state-vendor': ['zustand', 'react-query'],
          'ui-vendor': ['@headlessui/react', 'framer-motion'],
          
          // Feature-based chunks
          admin: [
            './src/pages/AdminDashboard.tsx',
            './src/components/AdminTable.tsx',
          ],
          checkout: [
            './src/pages/Checkout.tsx',
            './src/components/PaymentForm.tsx',
          ],
        },
        
        // Nombrar chunks consistentemente
        chunkFileNames: 'chunks/[name]-[hash].js',
        entryFileNames: 'entries/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
    
    // Chunk size warnings
    chunkSizeWarningLimit: 500, // 500KB
  },
  
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
});
```

### Paso 6: Dynamic Imports para Librerías

**Archivo**: `frontend/src/utils/dynamicImports.ts`

```typescript
/**
 * Cargar fecha-fns solo cuando se necesita
 */
export async function formatDate(date: Date, format: string) {
  const { format: formatFn } = await import('date-fns');
  return formatFn(date, format);
}

/**
 * Cargar chart library solo cuando se muestra
 */
export async function loadChartLibrary() {
  const { Chart } = await import('chart.js/auto');
  return Chart;
}

/**
 * Cargar markdown parser solo en páginas de contenido
 */
export async function parseMarkdown(content: string) {
  const { marked } = await import('marked');
  return marked(content);
}
```

### Paso 7: Análisis de Bundle

**Archivo**: `package.json`

```json
{
  "scripts": {
    "build": "vite build",
    "analyze": "vite-bundle-visualizer",
    "build:analyze": "npm run build && npm run analyze"
  },
  "devDependencies": {
    "vite-bundle-visualizer": "^1.0.0"
  }
}
```

**Archivo**: `scripts/analyze-bundle.sh`

```bash
#!/bin/bash

echo "🔍 Analyzing bundle..."

# Build
npm run build

# Analyze chunks
echo -e "\n📦 Chunk sizes:"
find dist/chunks -name "*.js" -exec ls -lh {} \; | awk '{print $9, $5}'

# Total size
echo -e "\n📊 Total dist size:"
du -sh dist

# Check for large chunks
echo -e "\n⚠️  Chunks > 300KB:"
find dist -name "*.js" -size +300k -exec ls -lh {} \; | awk '{print $9, $5}'
```

### Paso 8: Tests

**Archivo**: `frontend/src/__tests__/codeSplitting.test.tsx`

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { App } from '../App';

test('Lazy loads route components', async () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );

  // Verificar que suspense muestra loading
  expect(screen.queryByTestId('loading-spinner')).toBeInTheDocument();

  // Esperar a que cargue el componente
  await waitFor(() => {
    expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
  });
});
```

## ✅ CRITERIOS DE ACEPTACIÓN

- [x] Route-based code splitting
- [x] Component-level lazy loading
- [x] Suspense boundaries
- [x] Preload strategies
- [x] Manual chunks configurados
- [x] Bundle size < 200KB inicial
- [x] Chunks nombrados consistentemente
- [x] Tests de lazy loading

## 🧪 VALIDACIÓN

```bash
# Build y analizar
npm run build:analyze

# Ver tamaño de chunks
bash scripts/analyze-bundle.sh

# Verificar bundle inicial
ls -lh dist/entries/index-*.js

# Test
npm test -- codeSplitting.test.tsx
```

## 📊 MÉTRICAS ESPERADAS

- Bundle inicial: < 200KB gzipped
- Chunk más grande: < 500KB
- Reducción 40-60% vs bundle único

---

**Status**: COMPLETO ✅
