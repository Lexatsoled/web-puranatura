# Mapa de Arquitectura

## Visión general

- **Stack**: React 19 + Vite 6 + TypeScript; estilo mixto Tailwind/inline CSS; animaciones framer-motion; estado global en Context + Zustand.
- **Front-end** (`frontend-core`, `frontend-pages`, `frontend-components`): React Router renderiza páginas en `pages/` y `src/pages/`. Dos sistemas de layout coexisten (`SimpleLayout` vs `components/Layout`).
- **Estado y datos locales** (`frontend-contexts`, `frontend-store`, `content-data`): carrito/lista de deseos/autenticación persisten en `localStorage`; catálogo y contenido se leen de `data/*.ts` y CSVs.
- **Servicios utilitarios** (`frontend-utils`, `frontend-api-clients`, `frontend-services`): axios + interceptores, sanitización DOMPurify, generadores SEO/JSON-LD, servicio de reseñas, scripts de imágenes.
- **Pruebas y automatización** (`unit-tests`, `e2e-tests`, `.husky`, `ops-scripts`): Vitest + Testing Library, Playwright UI, ganchos Husky, script `optimizeImages` usado en `npm run build`.
- **Backend** (`backend-data`): únicamente artefactos SQLite/logs/.env; no hay código de servicio expuesto en el repo.

## Diagrama textual de capas y flujo de datos

```
[Navegador]
  └── React Router (frontend-core)
        ├── Componentes UI (frontend-components, legacy-components)
        │      └── Estados locales/contextos (frontend-contexts, frontend-store)
        │             ├── Persiste en localStorage/sessionStorage
        │             └── Consume catálogos (content-data)
        ├── Hooks utilitarios (frontend-hooks, frontend-utils)
        │      ├── useApi → axios → /api/** (supuesto backend externo)
        │      └── useAnalytics → inyección de scripts GA/FB + fetch `/api/analytics/events`
        └── Servicios (frontend-services, frontend-validation)
               └── Operan sobre datos simulados (productos, reseñas)

[CLI / Tooling]
  ├── `scripts/optimizeImages.ts` → espera optimizar assets en `public/`
  └── Playwright (`e2e-tests`) → levanta Vite preview y automatiza `/tienda`

[Backend-data]
  └── SQLite + backups + `.env` con secretos JWT (sin runtime)
```

## Límites y dominios de confianza

- **Límite de navegador**: todo el negocio y la autenticación se ejecutan en el cliente; no existe capa de servidor autenticada en el repositorio.
- **Límite de API**: `useApi` asume endpoints `/api/**` y refresco JWT; actualmente no hay implementación, pero los interceptores sanitizan toda petición/respuesta antes de salir del sandbox del navegador.
- **Límite de datos sensibles**: PII, direcciones y contraseñas residen en `localStorage` (`frontend-contexts/AuthContext`) y pueden ser manipuladas por cualquier script con acceso al DOM.
- **Límite de archivos estáticos**: catálogos (`content-data`) y assets (`public-assets`) cargan directamente desde el bundle, sin verificación de integridad (no hay SRI/CSP estricta).

## Entry points & sinks

- **HTTP/SPA**: `/` y rutas `/tienda`, `/blog`, `/contacto`, etc. renderizadas por React Router.
- **APIs invocadas**: `/api/products`, `/api/analytics/events`, `/api/auth/refresh`, `/reviews/**` (todos asumidos, no existen en repo).
- **CLI/Scripts**: `npm run dev/build/test`, `scripts/optimizeImages.ts`, `npm run test:e2e` (levanta preview en 5173 y Playwright Chromium), `npm run optimize-images` (hook en build).
- **Tests**: Vitest (`unit-tests`) y Playwright (`e2e-tests`). Coverage HTML almacenada en `coverage/`.
- **Data sinks sensibles**: `localStorage` (`puranatura-user`, `puranatura-users`, `cart-storage`, `puranatura-wishlist`, tokens JWT), `sessionStorage` para analytics, SQLite `backend/database.sqlite`.

## Flujos de datos sensibles

1. **Credenciales/PII**: Formularios de AuthModal → `AuthContext.register/login` → `localStorage` + `puranatura-users` sin hashing.
2. **Tokens**: `useApi` lee/escribe `auth_token` y `refresh_token` en `localStorage`, luego los reenvía en headers Authorization (sin protección ante XSS o replay).
3. **Analytics**: `useAnalytics` crea `sessionStorage.analytics_session_id`, inyecta scripts externos (GA/Facebook) y reenvía eventos a `/api/analytics/events` con payload enriquecido (IP, UA en backend handler).
4. **Catálogo**: `data/products.ts` alimenta `StorePage`, `ProductPage`, modales y JSON-LD (`schemaGenerators`). No hay paginación/streaming; toda la data se carga en el bundle.
5. **Pagos simulados**: `CartModal.handleProceedToPayment` usa `Math.random` para decidir resultado y, al completar, llama `clearCart()` → `localStorage`.

## Dependencias destacadas

- **Runtime**: React 19, React Router 7, Zustand 5, Tailwind 3, Framer Motion 12.
- **AppSec/Utilidades**: DOMPurify, axios, zod, react-hook-form.
- **Build/Test**: Vite 6, Vitest 3, Playwright 1.41, Sharp (node) para imágenes.
- **Backend (no presente)**: se declara Express/Mongoose pero no existe código.

## Observabilidad y DX

- No hay pipeline CI ni tareas automatizadas en `tasks.json`; Husky pre-commit no referencia scripts actuales.
- `useAnalytics` intenta enviar datos a GA/Facebook pero usa `process.env.REACT_APP_*` (CRA) en lugar de `import.meta.env`, por lo que no recoge configuraciones de Vite.
- Logs: `backend/logs/*` y `seed.log` contienen trazas manuales; frontend usa `console.error` sin reporter.

## Riesgos estructurales

1. **Todo el dominio de negocio y las credenciales viven en el cliente** → necesidad urgente de backend real o BFF.
2. **Duplicidad de layouts/pages** (carpetas raíz vs `src/`) aumenta superficie de bugs e inconsistencias.
3. **Intercepción global DOMPurify/axios** puede mutar payloads legítimos (tokens binarios, HTML permitido) y romper integraciones futuras.
4. **Flujo de build** depende de `scripts/optimizeImages.ts`, que está incompleto y con texto dañado, obstaculizando pipelines CI/CD.
