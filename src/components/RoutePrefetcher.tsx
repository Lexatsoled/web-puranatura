import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Mapa de rutas probables basado en la ruta actual
 * Define qué rutas es probable que el usuario visite después
 */
const ROUTE_PREDICTIONS: Record<string, string[]> = {
  '/': ['/tienda', '/servicios', '/blog', '/sobre-nosotros'],
  '/tienda': ['/carrito', '/lista-deseos'],
  '/producto/:id': ['/carrito', '/tienda', '/checkout'],
  '/carrito': ['/checkout', '/tienda'],
  '/checkout': ['/pedido-confirmado/:id'],
  '/blog': ['/blog/:id', '/contacto'],
  '/servicios': ['/servicios/:id', '/contacto', '/tienda'],
};

/**
 * Mapa de chunks dinámicos por ruta
 * Estos son los archivos JS que Vite genera para cada página
 */
const ROUTE_CHUNKS: Record<string, string> = {
  '/tienda': '/assets/StorePage',
  '/servicios': '/assets/ServicesPage',
  '/blog': '/assets/BlogPage',
  '/carrito': '/assets/CartPage',
  '/checkout': '/assets/CheckoutPage',
  '/sobre-nosotros': '/assets/AboutPage',
  '/contacto': '/assets/ContactPage',
  '/lista-deseos': '/assets/WishlistPage',
};

/**
 * Componente que gestiona el prefetching de rutas de manera inteligente
 */
const RoutePrefetcher: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Obtener rutas probables basadas en la ruta actual
    const currentPath = location.pathname;
    let predictedRoutes: string[] = [];

    // Buscar coincidencia exacta o por patrón
    if (ROUTE_PREDICTIONS[currentPath]) {
      predictedRoutes = ROUTE_PREDICTIONS[currentPath];
    } else {
      // Buscar patrón genérico (ej: /producto/123 → /producto/:id)
      for (const [pattern, routes] of Object.entries(ROUTE_PREDICTIONS)) {
        if (pattern.includes(':') && matchesPattern(currentPath, pattern)) {
          predictedRoutes = routes;
          break;
        }
      }
    }

    // Prefetch después de un delay para no interferir con la carga inicial
    const timeoutId = setTimeout(() => {
      predictedRoutes.forEach((route) => {
        // Si es un patrón con :id, usar solo la base
        const baseRoute = route.split('/:')[0];
        const chunkPath = ROUTE_CHUNKS[baseRoute];

        if (chunkPath) {
          prefetchChunk(chunkPath);
        }
      });
    }, 1500); // Esperar 1.5s después de navegar

    return () => clearTimeout(timeoutId);
  }, [location.pathname]);

  return null; // Este componente no renderiza nada
};

/**
 * Verifica si una ruta coincide con un patrón
 */
const matchesPattern = (path: string, pattern: string): boolean => {
  const pathParts = path.split('/');
  const patternParts = pattern.split('/');

  if (pathParts.length !== patternParts.length) {
    return false;
  }

  return patternParts.every((part, i) => {
    return part.startsWith(':') || part === pathParts[i];
  });
};

/**
 * Prefetch de un chunk específico
 */
const prefetchChunk = (chunkPath: string) => {
  // Buscar si ya existe un link de prefetch
  const existingLink = document.querySelector(`link[href^="${chunkPath}"]`);
  if (existingLink) {
    return; // Ya está prefetched
  }

  // Crear link element
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.as = 'script';

  // Vite añade hash al final, por eso buscamos archivos que empiecen con el nombre base
  // En producción, necesitaremos el nombre exacto del chunk
  // Por ahora, dejamos que el navegador maneje el prefetch
  link.href = `${chunkPath}.js`;

  document.head.appendChild(link);
};

/**
 * Componente para prefetch de recursos críticos en el <head>
 */
export const CriticalResourceHints: React.FC = () => {
  return (
    <>
      {/* Preconnect a dominios externos comunes */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />

      {/* DNS Prefetch para CDNs y APIs */}
      <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      <link rel="dns-prefetch" href="https://fonts.gstatic.com" />

      {/* Preload de fuentes críticas (si las hay) */}
      {/* <link rel="preload" href="/fonts/main-font.woff2" as="font" type="font/woff2" crossOrigin="anonymous" /> */}
    </>
  );
};

export default RoutePrefetcher;
