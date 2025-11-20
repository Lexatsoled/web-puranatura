# architecture-map

## Capas y responsabilidades

- **frontend-core** (`src/**`): SPA en React/Vite con contexts (Auth/Cart/Wishlist), stores Zustand y servicios `apiClient`/`productApi`.
- **frontend-shared-components** (`components/**`): Paquete legacy paralelo que algunos pages siguen importando (ej. `ProductPage`) y que carece de los últimos fixes de accesibilidad.
- **backend-api** (`backend/src/**`): Fastify + Drizzle sobre SQLite embebido; expone `/api/auth/*`, `/api/products/*`, `/health`.
- **tooling** (`scripts/**`, `tools/**`): Normalización de textos, optimización de imágenes, generación de reports.
- **public-assets** (`public/**`): Manifest estático, fuentes e ~30 MB de imágenes pre-renderizadas.
- **knowledge-base / templates**: Documentación operativa y contenido editorial.

## Diagrama textual del flujo

```
[Browser (Routes + Suspense)]
    |
    v
[Contexts/AuthProvider]
    |-- cookies (access/refresh) --> [Fastify Auth Routes]
    |---> [Zustand stores (Cart, Checkout, Product, Performance)]
                  |                    |                     |
                  |                    |-- localStorage (orders, cart, telemetry)
                  |                    '-- NotificationCenter + a11y LiveRegions
                  '-- productApi -> apiClient (axios)
                                  | (withCredentials=true)
                                  v
                        [/api/products,* Fastify]
                                  |
                                  v
                        [Drizzle ORM -> SQLite file]
                                  |
                                  '-- Seed scripts (`backend/src/db/seed.ts`)

[SecurityService + logger]
    |-- localStorage (audit cache)
    '-- Sentry SaaS (PII sin scrubbing)
```

### Flujos de datos sensibles

- **Credenciales**: `AuthProvider` confía en cookies httpOnly entregadas por `/api/auth/login`; no hay CSRF token y los refresh tokens no se rotan.
- **Pedidos**: `checkoutStore.processOrder` persiste shipping address + paymentMethod en `localStorage` y nunca toca backend.
- **Logs/alertas**: `logger.security` y `SecurityService` serializan payloads completos (incluyendo addresses) hacia Sentry/localStorage.
- **Multimedia**: `ImageZoom` y `generateSrcSet` consumen assets de `public/Jpeg` sin CDN ni resize dinámico.

### Límites de confianza

- **Client ↔ API**: se cruza en `apiClient` (axios). Se aceptan cookies de cualquier origen configurado en `VITE_API_URL`; falta validación de CSRF y firma de requests.
- **API ↔ Datos**: SQLite vive en `backend/database.sqlite` dentro del mismo contenedor/VM, sin cifrado ni separación de privilegios.
- **Tooling ↔ Repo**: scripts corren localmente con permisos de escritura sobre `public/**` y `reports/**`.

### Entrypoints

- **HTTP**: `/health`, `/api/auth/(signup|login|logout|refresh|me)`, `/api/products` (+ `/featured`, `/search`, `/category/:slug`, `/system/:systemId`).
- **CLI / Jobs**: `scripts/optimizeImages.ts`, `scripts/generateSitemap.ts`, `backend/src/db/migrate.ts`, `backend/src/db/seed.ts`.
- **Tests**: `npm run test:ci` (Vitest), `npm run test:e2e` (Playwright), `npm run audit:*` (text/links/components).

### Sinks / dependencias externas

- `localStorage`: carrito, checkout, security events, pedidos simulados.
- `Sentry`: recibe logs enriquecidos sin redacción (via `src/utils/logger.ts`).
- `SQLite file`: única copia estructurada de productos/usuarios (`backend/database.sqlite`).
- `Static assets`: servidos directamente por Vite/hosting (sin CDN ni policies de expiración).

### Riesgos arquitectónicos detectados

1. **Acoplamiento de tiendas con storage inseguro**: Cart y Checkout dependen de `localStorage`, exponiendo PII y duplicando lógica.
2. **Backend single-node**: Fastify + SQLite sin pooling, lo que bloquea el loop en cada query y no ofrece HA.
3. **Duplicación de componentes**: dos árboles (`src/components` y `/components`) generan incoherencia de UX/a11y.
4. **Observabilidad invasiva**: Logger envía datos crudos a Sentry sin clasificación ni minimización.

```

```
