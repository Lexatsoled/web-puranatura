/// <reference lib="webworker" />

import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import {
  StaleWhileRevalidate,
  CacheFirst,
  NetworkFirst,
} from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { BackgroundSyncPlugin } from 'workbox-background-sync';

declare const self: ServiceWorkerGlobalScope;

// Precache assets generados por build
precacheAndRoute(self.__WB_MANIFEST || [], {
  ignoreURLParametersMatching: [/^utm_/, /^fbclid$/, /^gclid$/, /^v$/, /^cacheBust$/],
});
cleanupOutdatedCaches();

// Cache API products con estrategia StaleWhileRevalidate (5 min, 50 entries)
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/v1/products'),
  new StaleWhileRevalidate({
    cacheName: 'api-products',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 5 * 60, // 5 minutos
      }),
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

// Generic runtime caching for all /api/v1/** endpoints (network-first with short cache)
// This ensures runtime caching only targets versioned API routes.
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/v1/'),
  new NetworkFirst({
    cacheName: 'api-runtime',
    networkTimeoutSeconds: 10,
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 6 * 60 * 60 }), // 6 hours
    ],
  })
);

// Cache imágenes con estrategia CacheFirst (30 días, 100 entries)
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 días
      }),
    ],
  })
);

// Cache fuentes con estrategia CacheFirst (1 año, 30 entries)
registerRoute(
  ({ request }) => request.destination === 'font',
  new CacheFirst({
    cacheName: 'fonts',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 30,
        maxAgeSeconds: 365 * 24 * 60 * 60, // 1 año
      }),
    ],
  })
);

// Network-first para HTML con fallback a cache
registerRoute(
  ({ request }) => request.mode === 'navigate',
  new NetworkFirst({
    cacheName: 'pages',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 24 * 60 * 60, // 24 horas
      }),
    ],
  })
);

// Background sync para órdenes (24h retention)
// La cola 'orders-queue' retiene los intentos de POST offline y los reintenta automáticamente.
const bgSyncPlugin = new BackgroundSyncPlugin('orders-queue', {
  maxRetentionTime: 24 * 60, // 24 horas en minutos
  onSync: async ({ queue }) => {
    // Log para debug de reintentos offline
    console.log('[SW] Reintentando pedidos encolados (orders-queue)...', queue);
    try {
      await queue.replayRequests();
      console.log('[SW] Todos los pedidos encolados han sido reenviados.');
    } catch (err) {
      console.error('[SW] Error reintentando pedidos encolados:', err);
    }
  },
});

registerRoute(
  ({ url, request }) =>
    url.pathname.startsWith('/api/v1/orders') && request.method === 'POST',
  new NetworkFirst({
    plugins: [bgSyncPlugin],
  }),
  'POST'
);

// Offline fallback para navegación
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(async () => {
        const cache = await caches.open('pages');
        const cachedResponse = await cache.match('/offline.html');
        return cachedResponse || new Response('Offline');
      })
    );
  }
});

// Push notifications handler
self.addEventListener('push', (event) => {
  const data = event.data?.json() || {};

  event.waitUntil(
    self.registration.showNotification(data.title || 'Pureza Naturalis', {
      body: data.body || 'Nueva notificación',
      icon: '/android-chrome-192x192.png',
      badge: '/favicon-32x32.png',
      data: data.url,
      tag: data.tag || 'default-notification',
      requireInteraction: false,
    })
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    self.clients.openWindow(event.notification.data || '/')
  );
});

// Skip waiting when new SW is installed
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
