# Mapa de Arquitectura – Pureza-Naturalis-V3

Visión en texto de cómo se conectan los módulos identificados en `inventory.json`. Los `module_id` entre paréntesis facilitan el cruce con el inventario.

## 1. Vista por capas

```
 Navegador / PWA (frontend-core)
   │  ▲            ▲    ▲
   │  │            │    └── Notificaciones push + Service Worker (frontend-core)
   │  │            └── Assets estáticos / imágenes (public-assets via CDN)
   │  │
   │  └── Axios (apiClient) → HTTPS → Fastify API (backend-api)
   │                                │
   │                                ├── Zod middlewares, Rate-limits, CSRF (backend-api)
   │                                ├── Redis opcional (devops-ci) para cache/rate limiting
   │                                └── Drizzle ORM → SQLite (`backend/database.sqlite`)
   │                                             │
   │                                             └── Jobs de respaldo y limpieza (backend-ops)
   │
   └── Observabilidad:
         • Web vitals → `/api/analytics/vitals`
         • Sentry (`src/sentry.ts`, `backend/src/plugins/sentry.ts`)
         • Prometheus `/metrics` (backend-api)
```

## 2. Componentes clave

| Capa | `module_id` | Responsabilidad | Referencias |
|------|-------------|-----------------|-------------|
| UI React + Zustand | `frontend-core` | Páginas, tiendas, stores (`src/pages`, `src/store`, `src/components`, `src/services/productApi.ts`) | Puntos de entrada `src/main.tsx` → `Router` |
| Service Worker / PWA | `frontend-core` | `src/service-worker.ts` intercepta `/api/products`/`/api/orders`, precachea assets, usa `workbox-*` | se registra vía `src/registerSW.ts` |
| Assets | `public-assets` | Imágenes en `/public/Jpeg` y `/public/optimized`, fuentes y manifest PWA | servido por CDN configurable `VITE_CDN_BASE_URL` |
| API | `backend-api` | Fastify + plugins (CSRF, rateLimit, versioning). Rutas `/api/v1` y `/api/v2` para auth, productos, órdenes, analytics | `backend/src/routes/**` |
| DB & ORM | `backend-api` + `backend-ops` | `Drizzle` y `better-sqlite3`. Cache en `cacheService` con Redis opcional. Jobs `cleanupSessions.ts`, `backupJob.ts`. | `backend/src/db/**`, `backend/database.sqlite` |
| Tooling | `tooling-automation` | Scripts de optimización de imágenes (`scripts/optimizeImages.ts`), chequeos de encoding, exporters. | `scripts/**`, `tools/**` |
| Observabilidad | `devops-ci` | Config Prometheus (`backend/src/plugins/prometheus.ts`), Sentry, gitleaks, GitHub Actions. | `.github/**`, `monitoring/**` |

## 3. Flujos de datos representativos

### 3.1 Catálogo / Producto
1. `HomePage`/`ProductsPage` (`frontend-core`) solicita productos vía `productApi.fetchProducts` → `apiClient` (Axios, cookies y refresh tokens).
2. `Fastify` (`backend-api/routes/v1/products.ts`) valida filtros (`ProductFiltersSchema`), aplica rate-limits y le pide a `productService` datos de SQLite.
3. `productService` usa Drizzle para componer records, cachea el resultado (`cacheService` + Redis) y responde JSON.
4. `ProductStore` (Zustand) normaliza y guarda en caché en memoria; componentes generan UI e imágenes (`OptimizedImage` + CDN).

### 3.2 Checkout
1. Store `cartStore` mantiene items en localStorage (persist middleware).
2. `CheckoutPage` usa `checkoutStore.processOrder` (actualmente mock sin API) y el `service-worker` intenta sincronizar `/api/orders` en background.
3. Backend expone `/api/v1/orders` (Fastify + Drizzle) que valida totales, crea registros en `orders` y `order_items` y emite logs de seguridad.
4. Webhooks/analytics: `securityService` (frontend-core) registra eventos en localStorage y Sentry; backend guarda sesiones con hash + familia de tokens.

### 3.3 Observabilidad / Jobs
* Web Vitals (`src/utils/webVitalsReporter.ts`) envía métricas a `/api/analytics/vitals` → `analyticsRoutes` almacena en memoria (1000 máx) y ofrece dashboard JSON.
* Plugins `prometheusPlugin` y `sentryPlugin` se enganchan en Fastify. `backupService` y `cleanupSessions` corren vía `node-cron`/`setInterval` excepto en test env.

## 4. Entradas y sumideros

**Entradas (attack surface):**
- HTTP público `/api/(v1|v2)/**` (productos, auth, órdenes, analytics).
- Endpoints utilitarios `/api/csp-report`, `/api/upload/image`, `/api/test/product/:id`.
- Service Worker mensajes `SKIP_WAITING`, eventos `push`/`notificationclick`.
- CLI/scripts (`scripts/*.ts`, `backend/scripts/*.mjs`) que manipulan la BD y optimizan imágenes.
- Cron jobs (`backupJob`, `cleanupSessions`).

**Sumideros/salidas:**
- SQLite (`backend/database.sqlite` + WAL): productos, usuarios, pedidos, sesiones.
- Redis (si `REDIS_ENABLED=true`) para cache, rate-limits y sesiones temporales.
- CDN remoto (`cdnConfig` → Cloudflare/Bunny) para subir imágenes via `/api/upload/image`.
- Observabilidad: Sentry (frontend/backend), Prometheus `/metrics`, archivos en `logs/` y `reports/`.

## 5. Datos sensibles y límites de confianza

| Flujo | Datos sensibles | Control actual | Riesgos destacados |
|-------|-----------------|----------------|--------------------|
| Autenticación (`/api/v1/auth/*`) | Cookies `accessToken`/`refreshToken`, hash bcrypt, sesiones con `tokenHash` | CSRF + SameSite=strict, JWT rotation, `SessionService` | Endpoint `/test/product/:id` ignora auth; analytics y test endpoints no tienen `requireRole`. |
| Pedidos (`/api/v1/orders`) | Datos personales (direcciones, notas), totales de pago | Validación Zod, sanitización (`sanitizeAddress`) | Frontend no llama al backend → datos quedan solo en localStorage; servicio worker no intercepta `/api/v1/**`. |
| Imágenes (upload) | Archivos de admins | Valida mimetype `image/*`, tamaño 10MB, sube a CDN configurado | No se limpia `data.filename`, no hay antivirus. |
| Observabilidad | Web-vitals con user-agent y `referer` | `analyticsRoutes` guarda en memoria | Ruta `/admin/analytics/vitals` sin auth → fuga de PII. |
| Backups (`backupService`) | Dump SQLite cifrado opcional | Cron diario `BACKUP_SCHEDULE`, encryption key opcional | Si `BACKUP_ENCRYPTION_KEY` vacío, backups legibles en disco (`backend/backups`). |

## 6. Dependencias externas y módulos auxiliares

- **Workbox** (`frontend-core`): precache + background sync, requiere rutas correctas (`/api/v1`).
- **TanStack Query / Zustand** (`frontend-core`): caching en memoria.
- **Drizzle ORM + better-sqlite3** (`backend-api`): acceso nativo a SQLite.
- **Redis** (`devops-ci`): rate limiting, cache de productos y búsquedas.
- **Sentry, Prometheus, Loki**: telemetría y logging estructurado.
- **Gitleaks** (`.gitleaks.toml`) y scripts de encoding en `tools/`.

## 7. Referencias cruzadas por `module_id`

- `frontend-core`: `src/pages/**/*`, `src/components`, `src/store`, `src/services`, `src/utils`.
- `backend-api`: `backend/src/**/*.ts`, configuraciones en `backend/.env`.
- `backend-ops`: `backend/scripts/*.mjs`, `backend/src/jobs`.
- `tooling-automation`: `scripts/*.ts`, `tools/*.cjs`, `.husky/`.
- `public-assets`: `public/**` (excluyendo `/public/optimized` autogenerado).
- `devops-ci`: `.github/workflows`, `monitoring/**`, `k6/**`.

Estos bloques cubren >95 % de los 1 664 archivos inventariados (se excluyeron sólo artefactos generados como `/public/optimized` y `node_modules`).
