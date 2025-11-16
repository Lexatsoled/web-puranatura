# TASK-026: Service Worker y PWA

## 📋 INFORMACIÓN

**ID**: TASK-026 | **Fase**: 3 | **Prioridad**: MEDIA | **Estimación**: 4h

## 🎯 OBJETIVO

Implementar Service Worker con Workbox, offline support, background sync y push notifications para convertir en PWA.

## 🛠️ IMPLEMENTACIÓN

### Paso 1: Instalar Dependencias

```bash
npm install --save-dev workbox-cli workbox-webpack-plugin
npm install --save workbox-window
```

### Paso 2: Manifest PWA

**Archivo**: `frontend/public/manifest.json`

```json
{
  "name": "Pureza Naturalis",
  "short_name": "Pureza",
  "description": "Tienda online de productos naturales y suplementos",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#2d5f3f",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "screenshots": [
    {
      "src": "/screenshots/home.png",
      "sizes": "1280x720",
      "type": "image/png"
    }
  ],
  "categories": ["health", "shopping"],
  "shortcuts": [
    {
      "name": "Ver Productos",
      "url": "/products",
      "icons": [{ "src": "/icons/products-96x96.png", "sizes": "96x96" }]
    },
    {
      "name": "Mi Carrito",
      "url": "/cart",
      "icons": [{ "src": "/icons/cart-96x96.png", "sizes": "96x96" }]
    }
  ]
}
```

### Paso 3: Service Worker con Workbox

**Archivo**: `frontend/src/service-worker.ts`

```typescript
/// <reference lib="webworker" />

import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, CacheFirst, NetworkFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { BackgroundSyncPlugin } from 'workbox-background-sync';

declare const self: ServiceWorkerGlobalScope;

// Precache assets generados por build
precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

// Cache API responses (stale-while-revalidate)
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/products'),
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

// Cache imágenes (cache-first)
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

// Cache fuentes (cache-first)
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

// Network-first para HTML
registerRoute(
  ({ request }) => request.mode === 'navigate',
  new NetworkFirst({
    cacheName: 'pages',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

// Background sync para ordenes
const bgSyncPlugin = new BackgroundSyncPlugin('orders-queue', {
  maxRetentionTime: 24 * 60, // 24 horas
});

registerRoute(
  ({ url }) => url.pathname === '/api/orders',
  new NetworkFirst({
    plugins: [bgSyncPlugin],
  }),
  'POST'
);

// Offline fallback
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('/offline.html') || new Response('Offline');
      })
    );
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  const data = event.data?.json() || {};
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'Pureza Naturalis', {
      body: data.body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      data: data.url,
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    self.clients.openWindow(event.notification.data || '/')
  );
});
```

### Paso 4: Registrar Service Worker

**Archivo**: `frontend/src/registerSW.ts`

```typescript
import { Workbox } from 'workbox-window';

export async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    const wb = new Workbox('/service-worker.js');

    // Evento de actualización disponible
    wb.addEventListener('waiting', () => {
      const updateConfirm = confirm(
        'Nueva versión disponible. ¿Actualizar ahora?'
      );
      
      if (updateConfirm) {
        wb.messageSkipWaiting();
        window.location.reload();
      }
    });

    // SW activado
    wb.addEventListener('activated', (event) => {
      if (!event.isUpdate) {
        console.log('Service Worker activated for the first time!');
      }
    });

    // Registrar
    try {
      await wb.register();
      console.log('Service Worker registered');
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }

    return wb;
  }
}
```

### Paso 5: Integrar en App

**Archivo**: `frontend/src/main.tsx`

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { registerServiceWorker } from './registerSW';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Registrar SW en producción
if (import.meta.env.PROD) {
  registerServiceWorker();
}
```

### Paso 6: Push Notifications

**Archivo**: `frontend/src/utils/notifications.ts`

```typescript
/**
 * Solicitar permiso para notificaciones
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === 'granted';
}

/**
 * Suscribirse a push notifications
 */
export async function subscribeToPush(): Promise<PushSubscription | null> {
  const registration = await navigator.serviceWorker.ready;
  
  try {
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        import.meta.env.VITE_VAPID_PUBLIC_KEY
      ),
    });
    
    // Enviar subscription al servidor
    await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscription),
    });
    
    return subscription;
  } catch (error) {
    console.error('Push subscription failed:', error);
    return null;
  }
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
```

### Paso 7: Offline Page

**Archivo**: `frontend/public/offline.html`

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sin conexión - Pureza Naturalis</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      background: #f5f5f5;
    }
    .container {
      text-align: center;
      padding: 2rem;
    }
    h1 { color: #2d5f3f; }
    button {
      background: #2d5f3f;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>📡 Sin conexión</h1>
    <p>No hay conexión a internet. Algunas funciones pueden estar limitadas.</p>
    <button onclick="window.location.reload()">Reintentar</button>
  </div>
</body>
</html>
```

### Paso 8: Vite Plugin para SW

**Archivo**: `frontend/vite.config.ts`

```typescript
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'icons/*.png'],
      manifest: false, // Usamos manifest.json manual
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.purezanaturalis\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 5,
              },
            },
          },
        ],
      },
    }),
  ],
});
```

## ✅ CRITERIOS DE ACEPTACIÓN

- [x] Service Worker registrado
- [x] Manifest PWA válido
- [x] Offline support
- [x] Cache strategies (stale-while-revalidate, cache-first)
- [x] Background sync
- [x] Push notifications
- [x] Installable app
- [x] Offline fallback page

## 🧪 VALIDACIÓN

```bash
# Build con SW
npm run build

# Test PWA con Lighthouse
npx lighthouse http://localhost:3000 --view

# Verificar manifest
curl http://localhost:3000/manifest.json

# Test offline (DevTools > Network > Offline)
# Verificar que la app funciona sin conexión
```

---

**Status**: COMPLETO ✅
