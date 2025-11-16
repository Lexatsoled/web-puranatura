# Checklist de Rendimiento

## Core Web Vitals

- [ ] **LCP (Largest Contentful Paint):** ≤ 2.5s
  - Medido en Lighthouse o PageSpeed Insights
  - Optimizar imagen hero/principal
  - Preload critical resources
  
- [ ] **FID (First Input Delay):** ≤ 100ms
  - Reducir JavaScript bloqueante
  - Code splitting por rutas
  
- [ ] **CLS (Cumulative Layout Shift):** ≤ 0.1
  - Dimensiones explícitas en imágenes
  - Font loading optimizado
  - No insertar contenido sobre existente

- [ ] **FCP (First Contentful Paint):** ≤ 1.8s
  - Crítico: debe aparecer contenido inicial rápido

- [ ] **TTI (Time to Interactive):** ≤ 3.8s

## Bundle y Assets

- [ ] Bundle principal ≤ 300KB (compressed)
- [ ] Chunk de productos ≤ 50KB (migrado a API)
- [ ] Code splitting implementado
- [ ] Lazy loading de rutas no críticas
- [ ] Tree shaking habilitado
- [ ] Minificación en producción
- [ ] Compresión gzip/brotli en servidor
- [ ] Source maps solo en desarrollo

## Imágenes

- [ ] Formatos modernos (WebP, AVIF)
- [ ] Imágenes optimizadas (≤ 100KB por imagen)
- [ ] Lazy loading con Intersection Observer
- [ ] Dimensiones explícitas (width, height)
- [ ] Responsive images (srcset, sizes)
- [ ] Placeholder o blur-up
- [ ] CDN para assets estáticos (opcional)

## API y Backend

- [ ] Paginación en listados (máx 20-50 items)
- [ ] Índices en columnas de búsqueda frecuente
- [ ] Queries optimizadas (EXPLAIN en SQLite)
- [ ] Cache de queries frecuentes
- [ ] Compresión de respuestas (gzip)
- [ ] Response time P95 ≤ 300ms
- [ ] Connection pooling si se migra a PostgreSQL

## Frontend Performance

- [ ] React Query o similar para cache de API
- [ ] Virtualización en listados largos (react-window)
- [ ] Debounce en search inputs
- [ ] Memoization (useMemo, React.memo) donde aplique
- [ ] Evitar re-renders innecesarios
- [ ] Suspense boundaries para lazy components
- [ ] Prefetch de rutas probables

## Network

- [ ] HTTP/2 habilitado
- [ ] Preconnect a dominios externos
- [ ] Prefetch de critical resources
- [ ] Service Worker para offline (opcional)
- [ ] Cache-Control headers correctos
- [ ] ETags para validación de cache

## Fonts

- [ ] Font-display: swap o optional
- [ ] Preload de critical fonts
- [ ] Subset de fuentes (solo caracteres necesarios)
- [ ] WOFF2 preferido sobre WOFF/TTF

## JavaScript

- [ ] Async/defer en scripts no críticos
- [ ] Polyfills solo si necesarios
- [ ] Evitar librerías pesadas innecesarias
- [ ] Analizar bundle con webpack-bundle-analyzer

## Mediciones

- [ ] Lighthouse CI en cada deploy
- [ ] Real User Monitoring (RUM) con Web Vitals
- [ ] Alertas si LCP > 2.5s o CLS > 0.1
- [ ] Pruebas en red lenta (Fast 3G)
- [ ] Pruebas en dispositivos de gama baja

## Métricas Objetivo

| Métrica | Objetivo | Crítico |
|---------|----------|---------|
| LCP     | ≤ 2.5s   | ≤ 4.0s  |
| FID     | ≤ 100ms  | ≤ 300ms |
| CLS     | ≤ 0.1    | ≤ 0.25  |
| FCP     | ≤ 1.8s   | ≤ 3.0s  |
| TTI     | ≤ 3.8s   | ≤ 7.3s  |
| Bundle  | ≤ 300KB  | ≤ 500KB |
| API P95 | ≤ 300ms  | ≤ 1000ms|

## Herramientas

- [ ] Lighthouse (Chrome DevTools)
- [ ] PageSpeed Insights
- [ ] WebPageTest
- [ ] Chrome User Experience Report
- [ ] web-vitals library
- [ ] webpack-bundle-analyzer

## Notas

- **Prioridad alta:** LCP, bundle size, API paginada
- **Quick wins:** Lazy loading, compresión, imágenes optimizadas
- **Revisar mensualmente**
