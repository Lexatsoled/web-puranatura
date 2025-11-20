# Architecture Map

## 1. Capas y módulos (según `module_id` del inventario)

- **frontend-core**: SPA en React/Vite (`App.tsx`, `SimpleLayout`, `pages/*`, `contexts/*`, `src/components/*`). Maneja routing con `react-router-dom`, providers de carrito/autenticación y animaciones (`framer-motion`).
- **data-assets**: Datos inmutables (`data/*.ts`) y assets (`public/**/*`, `scripts/optimizeImages.ts`). Alimentan catálogos, blog y galerías sin API.
- **quality-pipeline**: Harness Playwright/Vitest (`e2e/*`, `test/*`, `vitest.config.ts`, `playwright.config.ts`).
- **backend-lite**: SQLite y backups (`backend/database.sqlite`, `backend/backups/*.gz`) más `.env` con llaves JWT.
- **docs-knowledge**: Procedimientos en `docs/` (deploy, backups, seguridad).
- **tooling-config**: Configuración de build (Vite, Tailwind, ESLint, tsconfig, scripts npm).
- **misc**: Archivos auxiliares en raíz.

## 2. Diagrama textual de alto nivel

```
[Browser / SPA]
   │
   ├─ UI (frontend-core)
   │    ├─ Layout/Header/Footer
   │    ├─ Pages (Home, Store, Blog, Profile)
   │    └─ Components (CartModal, ProductCard)
   │
   ├─ Estado local
   │    ├─ Cart/Wishlist/Auth Contexts → localStorage/sessionStorage
   │    └─ Zustand stores (cartStore)
   │
   ├─ Servicios
   │    ├─ useApi (axios + sanitization middleware)
   │    ├─ useAnalytics/useSeo hooks
   │    └─ Static data providers (`data/*.ts`)
   │
   ├─ Integraciones
   │    ├─ Fetch `/api/analytics/events` (Express handler en `src/api`)
   │    └─ Imports masivos de assets (`public/optimized`)
   │
   └─ Observabilidad/tests (quality-pipeline)
        ├─ Vitest (unit)
        ├─ Playwright (e2e)
        └─ K6/perf scripts (k6/, docs)

[Backend-lite]
   ├─ SQLite + backups
   └─ Variables (.env) → aún no integradas con el SPA
```

## 3. Flujos de datos sensibles

1. **Autenticación simulada**: Formularios en `AuthModal` → `AuthContext` → arrays `puranatura-users`/`puranatura-user` en localStorage. No pasa por backend ni hashing.
2. **Carrito/Pedidos**: `ProductCard`/`CartModal` → `CartContext` (localStorage `pura-natura-cart`) → UI/checkout ficticio.
3. **Analytics**: `useAnalytics` → GA/Facebook scripts + `fetch('/api/analytics/events')` → handler Express (`src/api/analytics/events.ts`) → `storeEvent` (stub para Mongo) → `models/AnalyticsEvent` (mongoose). Sin autenticación/rate-limit.
4. **Datos estáticos**: `data/products.ts`/`blog.ts` se importan directamente en los bundles (sin API). Assets en `public/optimized` se sirven como archivos estáticos vía Vite.
5. **Backups**: Carpeta `backend/backups` expone dumps comprimidos que contienen datos personales.

## 4. Límites de confianza

- **Cliente (no confiable)**: Formularios, contexts y localStorage pueden ser manipulados/XSS.
- **Capa SPA**: Solo debería consumir APIs pero actualmente toma decisiones de seguridad (autenticación, pagos simulados).
- **Backend-lite (potencial)**: SQLite + `.env` fuera del navegador, debería manejar auth/analytics reales; requiere endurecimiento (secretos, acceso mínimo, TLS, rate limits).
- **Servicios externos**: Google Analytics / Facebook Pixel se cargan sin gating; requieren consentimiento previo.

## 5. Entrypoints

- **HTTP**: `/` y rutas SPA (`/tienda`, `/blog`, `/perfil`, `/lista-deseos`).
- **API interna**: `POST /api/analytics/events` (Express handler incrustado; sin autenticación).
- **CLI/Jobs**: `npm run dev/build/test`, `npm run optimize-images` (placeholder), scripts de backup documentados en `docs/BACKUP_RESTORE_GUIDE.md`.
- **Tests**: `npm run test`, `npm run test:e2e`, `k6 run k6/*.js`.

## 6. Observaciones clave

- Dependencias críticas: React 19, react-router-dom 7, zustand 5, axios 1.11, mongoose 8 (solo modelos), Next-specific libs (`next-seo`) sin runtime compatible.
- No existe capa de servicios real para productos/usuarios; todo se mantiene en memoria/localStorage → dificulta escalar o proteger datos.
- Analytics y backups cruzan el límite de confianza sin sanitización/controles (recomendado aplicar Zero Trust + validaciones).
