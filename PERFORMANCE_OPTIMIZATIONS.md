# Performance Optimizations for Mobile Devices

## Overview

Comprehensive performance optimizations specifically targeting mobile devices to ensure fast loading, smooth interactions, and optimal user experience across various network conditions and device capabilities.

## Core Web Vitals Optimization

### Largest Contentful Paint (LCP) Improvements

#### Image Optimization Pipeline

```typescript
// Advanced image optimization with responsive loading
interface OptimizedImageProps {
  src: string;
  alt: string;
  sizes?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  quality?: number;
  format?: 'webp' | 'avif' | 'jpg' | 'png';
  className?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  loading = 'lazy',
  priority = false,
  quality = 80,
  format = 'webp',
  className
}) => {
  // Generate responsive image URLs with different formats
  const generateSrcSet = (baseSrc: string) => {
    const breakpoints = [320, 640, 768, 1024, 1280, 1920];
    const formats = ['webp', 'avif', 'jpg'];

    return formats.flatMap(format =>
      breakpoints.map(width => `${baseSrc}?w=${width}&f=${format}&q=${quality} ${width}w`)
    ).join(', ');
  };

  // Preload critical images
  useEffect(() => {
    if (priority) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = `${src}?w=640&f=${format}&q=${quality}`;
      link.imagesrcset = generateSrcSet(src);
      link.imagesizes = sizes;
      document.head.appendChild(link);

      return () => {
        document.head.removeChild(link);
      };
    }
  }, [src, priority, format, quality, sizes]);

  return (
    <img
      src={`${src}?w=640&f=${format}&q=${quality}`}
      srcSet={generateSrcSet(src)}
      sizes={sizes}
      alt={alt}
      loading={priority ? 'eager' : loading}
      decoding="async"
      className={className}
      // Add fetchpriority for critical images
      {...(priority && { fetchPriority: 'high' })}
    />
  );
};
```

#### Critical Resource Loading

```html
<!-- index.html - Optimized loading order -->
<head>
  <!-- Preload critical fonts -->
  <link
    rel="preload"
    href="/fonts/inter-var.woff2"
    as="font"
    type="font/woff2"
    crossorigin
  />

  <!-- Preload critical CSS -->
  <link rel="preload" href="/css/critical.css" as="style" />

  <!-- Preload critical JS -->
  <link rel="modulepreload" href="/js/core.js" />

  <!-- DNS prefetch for external resources -->
  <link rel="dns-prefetch" href="//fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

  <!-- Preload hero image -->
  <link
    rel="preload"
    href="/images/hero.webp"
    as="image"
    imagesrcset="/images/hero-640.webp 640w, /images/hero-1280.webp 1280w"
    imagesizes="(max-width: 768px) 100vw, 50vw"
  />
</head>
```

### First Input Delay (FID) and Interaction to Next Paint (INP) Optimization

#### JavaScript Bundle Splitting Strategy

```javascript
// vite.config.js - Advanced bundle splitting
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Core framework
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],

          // UI framework
          'ui-vendor': ['framer-motion', 'react-window'],

          // Utilities
          'utils-vendor': ['lodash', 'date-fns'],

          // PWA functionality
          'pwa-vendor': ['workbox-background-sync', 'workbox-expiration'],

          // Analytics (loaded after interaction)
          'analytics-vendor': ['@sentry/react', 'web-vitals'],

          // Heavy components (lazy loaded)
          'product-components': [
            './src/components/ProductCard',
            './src/components/ProductGrid',
          ],
          'checkout-components': [
            './src/pages/CheckoutPage',
            './src/components/PaymentForm',
          ],
        },

        // Optimize chunk file names for caching
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId
                .split('/')
                .pop()
                .replace('.tsx', '')
                .replace('.ts', '')
            : 'chunk';
          return `js/${facadeModuleId}-[hash].js`;
        },

        // Optimize asset names
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name)) {
            return `images/[name]-[hash].${ext}`;
          }
          if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
            return `fonts/[name]-[hash].${ext}`;
          }
          return `assets/[name]-[hash].${ext}`;
        },
      },
    },

    // Optimize chunk size limits
    chunkSizeWarningLimit: 600,

    // Enable source maps for production debugging
    sourcemap: true,

    // Minimize bundle size
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
      },
    },
  },
};
```

#### Service Worker for Caching Strategy

```javascript
// service-worker.js - Advanced caching with mobile optimization
const CACHE_NAME = 'pureza-naturalis-v3.1.0';
const STATIC_CACHE = 'static-v1.1.0';
const DYNAMIC_CACHE = 'dynamic-v1.1.0';
const API_CACHE = 'api-v1.1.0';
const IMAGE_CACHE = 'images-v1.1.0';

// Resources to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html',
  // Critical CSS and fonts
  '/css/critical.css',
  '/fonts/inter-var.woff2',
];

// API endpoints with different strategies
const API_ENDPOINTS = {
  // Cache first, then network
  products: '/api/products',
  categories: '/api/categories',

  // Network first, cache fallback
  search: '/api/search',
  recommendations: '/api/recommendations',

  // Network only (real-time)
  cart: '/api/cart',
  checkout: '/api/checkout',
};

self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => cache.addAll(STATIC_ASSETS)),
      // Cache offline page
      caches.open(DYNAMIC_CACHE).then((cache) => cache.add('/offline.html')),
    ])
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (
            ![STATIC_CACHE, DYNAMIC_CACHE, API_CACHE, IMAGE_CACHE].includes(
              cacheName
            )
          ) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle different resource types
  if (request.destination === 'image') {
    event.respondWith(handleImageRequest(request));
  } else if (isApiRequest(url)) {
    event.respondWith(handleApiRequest(request, url));
  } else if (request.destination === 'font') {
    event.respondWith(handleFontRequest(request));
  } else {
    event.respondWith(handleStaticRequest(request));
  }
});

async function handleImageRequest(request) {
  const cache = await caches.open(IMAGE_CACHE);

  // Try cache first
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    // Update cache in background
    fetch(request).then((networkResponse) => {
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
    });
    return cachedResponse;
  }

  // Fetch from network
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    // Return placeholder for failed images
    return new Response('', { status: 404 });
  }
}

async function handleApiRequest(request, url) {
  const cache = await caches.open(API_CACHE);
  const endpoint = Object.keys(API_ENDPOINTS).find((key) =>
    url.pathname.startsWith(API_ENDPOINTS[key])
  );

  if (!endpoint) {
    return fetch(request);
  }

  // Different strategies based on endpoint
  switch (endpoint) {
    case 'products':
    case 'categories':
      // Cache first strategy
      const cached = await cache.match(request);
      if (cached) {
        // Background update
        fetch(request).then((response) => {
          if (response.ok) cache.put(request, response);
        });
        return cached;
      }
      const network = await fetch(request);
      if (network.ok) cache.put(request, network.clone());
      return network;

    case 'search':
    case 'recommendations':
      // Network first strategy
      try {
        const network = await fetch(request);
        if (network.ok) cache.put(request, network.clone());
        return network;
      } catch (error) {
        return (
          cache.match(request) ||
          new Response(JSON.stringify({ error: 'Offline' }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' },
          })
        );
      }

    default:
      // Network only
      return fetch(request);
  }
}

async function handleStaticRequest(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cached = await cache.match(request);

  if (cached) {
    return cached;
  }

  try {
    const network = await fetch(request);
    if (network.ok && !network.url.includes('chrome-extension')) {
      cache.put(request, network.clone());
    }
    return network;
  } catch (error) {
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/offline.html');
    }
    throw error;
  }
}

function isApiRequest(url) {
  return url.pathname.startsWith('/api/');
}
```

### Cumulative Layout Shift (CLS) Prevention

#### Layout Stability Techniques

```css
/* Prevent layout shifts with aspect ratios */
.product-image {
  aspect-ratio: 4 / 3;
  width: 100%;
  object-fit: cover;
}

/* Reserve space for dynamic content */
.product-title {
  min-height: 3rem; /* Reserve space for 2 lines of text */
}

.product-price {
  min-height: 1.5rem; /* Reserve space for price */
}

/* Skeleton loading prevents layout shifts */
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
```

## Mobile-Specific Optimizations

### Touch and Gesture Optimization

```typescript
// Optimized touch handling for mobile
const useOptimizedTouch = () => {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(
    null
  );
  const [isScrolling, setIsScrolling] = useState(false);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
    setIsScrolling(false);
  }, []);

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!touchStart) return;

      const touch = e.touches[0];
      const deltaX = Math.abs(touch.clientX - touchStart.x);
      const deltaY = Math.abs(touch.clientY - touchStart.y);

      // Determine if user is scrolling
      if (deltaY > deltaX && deltaY > 10) {
        setIsScrolling(true);
      }
    },
    [touchStart]
  );

  const handleTouchEnd = useCallback(() => {
    setTouchStart(null);
    setIsScrolling(false);
  }, []);

  return {
    touchHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
    isScrolling,
  };
};
```

### Memory Management for Mobile

```typescript
// Memory-efficient image loading
const useMemoryEfficientImage = (src: string, options: ImageOptions) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new Image();

    // Use Intersection Observer to load only when visible
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          img.src = src;
          observer.disconnect();
        }
      },
      { rootMargin: '50px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    img.onload = () => {
      setImageSrc(src);
      setIsLoaded(true);
    };

    img.onerror = () => {
      // Fallback to lower quality or placeholder
      setImageSrc('/images/placeholder.webp');
    };

    return () => {
      observer.disconnect();
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      if (imageSrc && imageSrc !== '/images/placeholder.webp') {
        // Optional: revoke object URL if using blob URLs
        URL.revokeObjectURL(imageSrc);
      }
    };
  }, [imageSrc]);

  return { imageSrc, isLoaded, imgRef };
};
```

## Network Optimization

### Adaptive Loading Based on Network Conditions

```typescript
// Network-aware loading
const useNetworkAwareLoading = () => {
  const [connection, setConnection] = useState<NetworkInformation | null>(null);

  useEffect(() => {
    if ('connection' in navigator) {
      const conn = (navigator as any).connection;
      setConnection(conn);

      const updateConnection = () => setConnection(conn);
      conn.addEventListener('change', updateConnection);

      return () => conn.removeEventListener('change', updateConnection);
    }
  }, []);

  const getOptimalImageQuality = () => {
    if (!connection) return 80;

    switch (connection.effectiveType) {
      case '4g':
        return 90;
      case '3g':
        return 70;
      case '2g':
      case 'slow-2g':
        return 50;
      default:
        return 80;
    }
  };

  const shouldLoadHighQuality = () => {
    return connection?.effectiveType === '4g' || connection?.downlink > 5;
  };

  return {
    connection,
    imageQuality: getOptimalImageQuality(),
    loadHighQuality: shouldLoadHighQuality(),
  };
};
```

### Progressive Loading Strategy

```typescript
// Progressive enhancement for different devices
const useProgressiveEnhancement = () => {
  const [deviceCapabilities, setDeviceCapabilities] = useState({
    isMobile: false,
    hasTouch: false,
    supportsWebGL: false,
    memoryGB: 4,
    cores: 2,
  });

  useEffect(() => {
    const capabilities = {
      isMobile:
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        ),
      hasTouch: 'ontouchstart' in window,
      supportsWebGL: (() => {
        try {
          const canvas = document.createElement('canvas');
          return !!(window.WebGLRenderingContext && canvas.getContext('webgl'));
        } catch (e) {
          return false;
        }
      })(),
      memoryGB: (navigator as any).deviceMemory || 4,
      cores: navigator.hardwareConcurrency || 2,
    };

    setDeviceCapabilities(capabilities);
  }, []);

  const getRecommendedFeatures = () => {
    const { isMobile, memoryGB, cores } = deviceCapabilities;

    return {
      // Enable heavy animations only on capable devices
      enableAnimations: !isMobile || (memoryGB >= 4 && cores >= 4),

      // Use virtual scrolling on low-memory devices
      useVirtualScrolling: memoryGB < 4,

      // Load high-quality images on fast devices
      highQualityImages: !isMobile || memoryGB >= 3,

      // Enable advanced PWA features
      enableBackgroundSync: !isMobile && memoryGB >= 2,

      // Use simplified layouts on low-end devices
      simplifiedLayout: isMobile && memoryGB < 2,
    };
  };

  return {
    deviceCapabilities,
    recommendedFeatures: getRecommendedFeatures(),
  };
};
```

## Performance Monitoring

### Real-time Performance Tracking

```typescript
// Performance monitoring hook
const usePerformanceMonitoring = () => {
  const [metrics, setMetrics] = useState({
    fcp: 0,
    lcp: 0,
    fid: 0,
    cls: 0,
    ttfb: 0,
  });

  useEffect(() => {
    if (!('PerformanceObserver' in window)) return;

    // First Contentful Paint
    const fcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      setMetrics((prev) => ({ ...prev, fcp: lastEntry.startTime }));
    });
    fcpObserver.observe({ entryTypes: ['paint'] });

    // Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      setMetrics((prev) => ({ ...prev, lcp: lastEntry.startTime }));
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        setMetrics((prev) => ({
          ...prev,
          fid: entry.processingStart - entry.startTime,
        }));
      });
    });
    fidObserver.observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift
    const clsObserver = new PerformanceObserver((list) => {
      let clsValue = 0;
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      setMetrics((prev) => ({ ...prev, cls: clsValue }));
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });

    return () => {
      fcpObserver.disconnect();
      lcpObserver.disconnect();
      fidObserver.disconnect();
      clsObserver.disconnect();
    };
  }, []);

  // Time to First Byte
  useEffect(() => {
    const navigation = performance.getEntriesByType(
      'navigation'
    )[0] as PerformanceNavigationTiming;
    if (navigation) {
      setMetrics((prev) => ({
        ...prev,
        ttfb: navigation.responseStart - navigation.requestStart,
      }));
    }
  }, []);

  return metrics;
};
```

## Implementation Roadmap

### Phase 1: Core Performance Foundation (Week 1-2)

- [ ] Implement advanced image optimization
- [ ] Set up critical resource loading
- [ ] Configure bundle splitting strategy
- [ ] Add basic performance monitoring

### Phase 2: Mobile-Specific Optimizations (Week 3-4)

- [ ] Implement touch and gesture optimizations
- [ ] Add memory management for mobile devices
- [ ] Create network-aware loading
- [ ] Optimize service worker for mobile

### Phase 3: Advanced Features (Week 5-6)

- [ ] Implement progressive enhancement
- [ ] Add real-time performance monitoring
- [ ] Optimize for different device capabilities
- [ ] Implement adaptive loading strategies

### Phase 4: Testing and Validation (Week 7-8)

- [ ] Comprehensive performance testing
- [ ] Cross-device compatibility testing
- [ ] Network condition simulation
- [ ] Real user monitoring setup

## Success Metrics

### Core Web Vitals Targets

- **LCP**: <2.5 seconds
- **FID**: <100 milliseconds
- **CLS**: <0.1

### Mobile-Specific Metrics

- **Time to Interactive**: <3 seconds on 3G
- **Bundle Size**: <200KB for initial load
- **Memory Usage**: <50MB on mobile devices
- **Battery Impact**: Minimal battery drain

### User Experience Metrics

- **Page Load Satisfaction**: >90% user satisfaction
- **Interaction Responsiveness**: <50ms response time
- **Offline Functionality**: 80% feature availability offline
- **Cross-Device Consistency**: <5% performance variance
