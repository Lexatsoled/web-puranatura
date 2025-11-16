import { useEffect, useRef, useCallback } from 'react';

/**
 * Hook para prefetch de imágenes
 * Precarga una imagen cuando es probable que el usuario la necesite
 */
export const usePrefetchImage = () => {
  const prefetchedImages = useRef<Set<string>>(new Set());

  const prefetchImage = useCallback((src: string) => {
    if (!src || prefetchedImages.current.has(src)) {
      return;
    }

    // Crear nueva imagen para precargar
    const img = new Image();
    img.src = src;
    prefetchedImages.current.add(src);
  }, []);

  const prefetchImages = useCallback(
    (srcs: string[]) => {
      srcs.forEach((src) => prefetchImage(src));
    },
    [prefetchImage]
  );

  return { prefetchImage, prefetchImages };
};

/**
 * Hook para prefetch de recursos con Intersection Observer
 * Precarga recursos cuando el elemento está cerca del viewport
 */
export const useIntersectionPrefetch = (
  callback: () => void,
  options: IntersectionObserverInit = {}
) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const hasExecuted = useRef(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || hasExecuted.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasExecuted.current) {
            hasExecuted.current = true;
            callback();
          }
        });
      },
      {
        rootMargin: '200px', // Precargar 200px antes de entrar en viewport
        threshold: 0.01,
        ...options,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [callback, options]);

  return elementRef;
};

/**
 * Hook para prefetch de data (productos, posts, etc.)
 */
export const usePrefetchData = () => {
  const prefetchedData = useRef<Set<string>>(new Set());

  const prefetchData = useCallback(async (url: string, key?: string) => {
    const cacheKey = key || url;

    if (prefetchedData.current.has(cacheKey)) {
      return;
    }

    try {
      // Fetch con baja prioridad para no interferir con requests críticos
      const response = await fetch(url, {
        priority: 'low' as RequestPriority,
        cache: 'force-cache',
      });

      if (response.ok) {
        // Los datos se quedan en HTTP cache del navegador
        prefetchedData.current.add(cacheKey);
      }
    } catch {
      // Silently fail - prefetch es opcional
    }
  }, []);

  return { prefetchData };
};

/**
 * Hook para prefetch de rutas (lazy-loaded chunks)
 */
export const usePrefetchRoute = () => {
  const prefetchedRoutes = useRef<Set<string>>(new Set());

  const prefetchRoute = useCallback((routePath: string) => {
    if (prefetchedRoutes.current.has(routePath)) {
      return;
    }

    // Crear link element para prefetch
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.as = 'script';
    link.href = routePath;

    document.head.appendChild(link);
    prefetchedRoutes.current.add(routePath);
  }, []);

  return { prefetchRoute };
};

/**
 * Hook para detectar idle time y prefetch en background
 */
export const useIdlePrefetch = (callback: () => void, delay: number = 2000) => {
  useEffect(() => {
    // Solo ejecutar si requestIdleCallback está disponible
    if ('requestIdleCallback' in window) {
      const idleCallbackId = window.requestIdleCallback(
        () => {
          callback();
        },
        { timeout: delay }
      );

      return () => {
        window.cancelIdleCallback(idleCallbackId);
      };
    } else {
      // Fallback a setTimeout para navegadores sin soporte
      const timeoutId = setTimeout(callback, delay);
      return () => clearTimeout(timeoutId);
    }
  }, [callback, delay]);
};
