# PWA Enhancements Implementation

## Advanced Install Prompts

### Smart Timing Strategy

- **User Engagement Detection**: Track user interactions (scroll depth, time spent, clicks)
- **Contextual Triggers**: Show prompts after positive interactions (add to cart, product views)
- **Frequency Control**: Implement smart dismissal logic (don't show again for 7 days)
- **Device Optimization**: Different prompts for mobile vs desktop

### Conversion Tracking Implementation

```typescript
interface InstallPromptAnalytics {
  shown: boolean;
  dismissed: boolean;
  accepted: boolean;
  timestamp: Date;
  userAgent: string;
  engagementScore: number;
  trigger: string;
}

// Track install prompt events
const trackInstallPrompt = (
  event: keyof InstallPromptAnalytics,
  data?: any
) => {
  analytics.track('pwa_install_prompt', {
    event,
    ...data,
    sessionId: getSessionId(),
    url: window.location.href,
  });
};
```

### A/B Testing Framework

```typescript
interface PromptVariant {
  id: string;
  title: string;
  description: string;
  icon: string;
  ctaText: string;
  design: 'minimal' | 'rich' | 'urgent';
}

const promptVariants: PromptVariant[] = [
  {
    id: 'minimal',
    title: 'Instalar Pureza Naturalis',
    description: 'Acceso rápido desde tu pantalla de inicio',
    icon: 'download',
    ctaText: 'Instalar',
    design: 'minimal',
  },
  {
    id: 'rich',
    title: '¡Descubre Pureza Naturalis en tu dispositivo!',
    description:
      'Acceso instantáneo, sin conexión a internet y notificaciones de ofertas',
    icon: 'sparkles',
    ctaText: 'Instalar App',
    design: 'rich',
  },
];
```

## Enhanced Offline Experience

### Progressive Offline Features

- **Offline Product Browsing**: Cache product catalog for offline viewing
- **Offline Cart**: Allow adding items to cart while offline
- **Offline Forms**: Store form submissions for later sync
- **Offline Search**: Basic search functionality with cached data

### Background Sync Implementation

```typescript
interface SyncTask {
  id: string;
  type: 'cart_sync' | 'order_submit' | 'review_post';
  data: any;
  timestamp: Date;
  retryCount: number;
}

// Background sync manager
class BackgroundSyncManager {
  private syncQueue: SyncTask[] = [];

  async addToSyncQueue(
    task: Omit<SyncTask, 'id' | 'timestamp' | 'retryCount'>
  ) {
    const syncTask: SyncTask = {
      ...task,
      id: generateId(),
      timestamp: new Date(),
      retryCount: 0,
    };

    this.syncQueue.push(syncTask);
    await this.persistQueue();

    // Register background sync if available
    if (
      'serviceWorker' in navigator &&
      'sync' in window.ServiceWorkerRegistration.prototype
    ) {
      const registration = await navigator.serviceWorker.ready;
      await registration.sync.register('background-sync');
    }
  }

  private async persistQueue() {
    try {
      const queueData = JSON.stringify(this.syncQueue);
      localStorage.setItem('pwa_sync_queue', queueData);
    } catch (error) {
      console.error('Failed to persist sync queue:', error);
    }
  }
}
```

## Push Notification System

### Notification Types

- **Welcome Series**: Onboarding notifications for new users
- **Abandoned Cart**: Reminders for incomplete purchases
- **Product Restock**: Alerts when out-of-stock items become available
- **Special Offers**: Time-limited promotions and discounts
- **Order Updates**: Shipping confirmations and delivery updates

### Notification Management

```typescript
interface PushNotification {
  id: string;
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  image?: string;
  actions?: NotificationAction[];
  data?: any;
  tag?: string;
  requireInteraction?: boolean;
  silent?: boolean;
}

class PushNotificationManager {
  private permission: NotificationPermission = 'default';

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      return false;
    }

    this.permission = await Notification.requestPermission();
    return this.permission === 'granted';
  }

  async sendNotification(notification: PushNotification) {
    if (this.permission !== 'granted') {
      return;
    }

    const registration = await navigator.serviceWorker.ready;
    await registration.showNotification(notification.title, {
      body: notification.body,
      icon: notification.icon || '/favicon-192x192.png',
      badge: notification.badge,
      image: notification.image,
      actions: notification.actions,
      data: notification.data,
      tag: notification.tag,
      requireInteraction: notification.requireInteraction,
      silent: notification.silent,
    });
  }
}
```

## Service Worker Enhancements

### Advanced Caching Strategies

```javascript
// service-worker.js
const CACHE_NAME = 'pureza-naturalis-v3';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';
const API_CACHE = 'api-v1';

// Static assets to cache
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  // CSS and JS bundles
  // Font files
  // Critical images
];

// API endpoints to cache
const API_ENDPOINTS = ['/api/products', '/api/categories', '/api/systems'];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(STATIC_ASSETS))
  );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (
            cacheName !== STATIC_CACHE &&
            cacheName !== DYNAMIC_CACHE &&
            cacheName !== API_CACHE
          ) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // API requests - Network first with cache fallback
  if (API_ENDPOINTS.some((endpoint) => url.pathname.startsWith(endpoint))) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful responses
          if (response.ok) {
            const responseClone = response.clone();
            caches
              .open(API_CACHE)
              .then((cache) => cache.put(request, responseClone));
          }
          return response;
        })
        .catch(() => {
          // Return cached version if network fails
          return caches.match(request);
        })
    );
  }
  // Static assets - Cache first
  else if (
    STATIC_ASSETS.includes(url.pathname) ||
    request.destination === 'style' ||
    request.destination === 'script'
  ) {
    event.respondWith(
      caches.match(request).then((response) => response || fetch(request))
    );
  }
  // Images - Cache first with network update
  else if (request.destination === 'image') {
    event.respondWith(
      caches.match(request).then((response) => {
        // Update cache in background
        fetch(request).then((networkResponse) => {
          if (networkResponse.ok) {
            caches
              .open(DYNAMIC_CACHE)
              .then((cache) => cache.put(request, networkResponse));
          }
        });
        return response || fetch(request);
      })
    );
  }
  // Other requests - Network first
  else {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful GET requests
          if (request.method === 'GET' && response.ok) {
            const responseClone = response.clone();
            caches
              .open(DYNAMIC_CACHE)
              .then((cache) => cache.put(request, responseClone));
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
  }
});
```

## Performance Optimizations

### Bundle Splitting Strategy

```javascript
// vite.config.js
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React libraries
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],

          // UI libraries
          'ui-vendor': ['framer-motion', 'react-window'],

          // Utility libraries
          'utils-vendor': ['lodash', 'date-fns'],

          // PWA specific
          'pwa-vendor': ['workbox-background-sync', 'workbox-expiration'],

          // Analytics
          'analytics-vendor': ['@sentry/react', 'web-vitals'],
        },
      },
    },
  },
};
```

### Image Optimization

- **Responsive Images**: Multiple sizes for different devices
- **Modern Formats**: WebP with fallbacks
- **Lazy Loading**: Intersection Observer API
- **Preloading**: Critical images loaded eagerly

### Critical Resource Loading

```html
<!-- index.html -->
<head>
  <!-- Preload critical resources -->
  <link
    rel="preload"
    href="/fonts/inter-var.woff2"
    as="font"
    type="font/woff2"
    crossorigin
  />
  <link rel="preload" href="/css/critical.css" as="style" />

  <!-- Preconnect to external domains -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

  <!-- DNS prefetch for analytics -->
  <link rel="dns-prefetch" href="//www.google-analytics.com" />
</head>
```

## Analytics and Monitoring

### PWA Metrics Tracking

```typescript
interface PWAMetrics {
  installPromptShown: number;
  installPromptAccepted: number;
  installPromptDismissed: number;
  offlineUsageDuration: number;
  backgroundSyncSuccess: number;
  backgroundSyncFailure: number;
  pushNotificationSent: number;
  pushNotificationClicked: number;
  serviceWorkerErrors: number;
}

class PWAAnalytics {
  private metrics: PWAMetrics = {
    installPromptShown: 0,
    installPromptAccepted: 0,
    installPromptDismissed: 0,
    offlineUsageDuration: 0,
    backgroundSyncSuccess: 0,
    backgroundSyncFailure: 0,
    pushNotificationSent: 0,
    pushNotificationClicked: 0,
    serviceWorkerErrors: 0,
  };

  trackMetric(metric: keyof PWAMetrics, value: number = 1) {
    this.metrics[metric] += value;

    // Send to analytics service
    analytics.track('pwa_metric', {
      metric,
      value: this.metrics[metric],
      timestamp: new Date().toISOString(),
    });
  }

  getMetrics(): PWAMetrics {
    return { ...this.metrics };
  }
}
```

## Implementation Roadmap

### Phase 1: Core PWA Infrastructure (Week 1-2)

- [ ] Enhanced service worker with advanced caching
- [ ] Improved install prompt UX
- [ ] Basic offline product browsing
- [ ] Performance optimizations

### Phase 2: Advanced Features (Week 3-4)

- [ ] Push notification system
- [ ] Background sync implementation
- [ ] A/B testing framework for prompts
- [ ] Analytics integration

### Phase 3: Optimization and Testing (Week 5-6)

- [ ] Bundle splitting and code optimization
- [ ] Cross-browser testing
- [ ] Performance monitoring
- [ ] User acceptance testing

### Phase 4: Launch and Monitoring (Week 7-8)

- [ ] Production deployment
- [ ] Real user monitoring
- [ ] Conversion tracking
- [ ] Iterative improvements

## Success Metrics

### Technical Metrics

- **Lighthouse PWA Score**: Target >90
- **Time to Interactive**: <3 seconds
- **Cache Hit Rate**: >80%
- **Service Worker Coverage**: 100%

### User Engagement Metrics

- **Install Rate**: Percentage of visitors who install PWA
- **Daily Active Users**: PWA vs web app
- **Session Duration**: Offline vs online usage
- **Push Notification Engagement**: Open rates and interactions

### Business Metrics

- **Conversion Rate**: PWA vs standard web
- **Average Order Value**: PWA users
- **Cart Recovery Rate**: Background sync effectiveness
- **User Retention**: 1-day, 7-day, 30-day retention rates
