# Arquitectura del Sistema (vista 360)

## Contexto (C4 nivel 1)

Usuario → SPA (Vite/React) → BFF Express (Node 20) → Prisma/SQLite (upgradeable a Postgres) → Integraciones opcionales (servicios externos: GA, FB Pixel, etc.).

- Observabilidad: Prometheus + (future) Grafana; LHCI para web; k6 para API.

## Componentes (C4 nivel 2)

- Frontend
  - UI/Presentación: pages + components + SimpleLayout (nav/header/footer).
  - Estado: Contexts (Auth/Cart/Wishlist/Notifications) + stores Zustand persistidas.
  - Datos: `useApi` (axios + CSRF + sanitización), content loaders (fallback data/\*).
  - SEO/A11y: next-seo, Breadcrumbs JSON-LD, DOMPurify sanitization.
- BFF / API
  - Entrypoint: Express app con helmet, cors, rate-limit, csrf doble submit, prom-client.
  - Rutas: auth (JWT cookies), products (paginado + cache headers), orders (transacción stock), health, metrics, analytics (a implementar).
  - Middlewares: traceId, requestLogger (histogram), auth (JWT decode + admin), error envelope.
  - Datos: Prisma models User/Product/Order/Review; seeds; migraciones.
- Infra / CI
  - GH Actions CI: build, lint, type-check, test, contract, e2e, perf smoke, gitleaks, npm audit, k6, LHCI.
  - Scripts locales: optimize-images, axe, gitleaks, trivy, k6.

## Diagramas (texto)

### Flujo Auth + Orden

User → SPA `/login` → `useApi.post /api/auth/login` (CSRF token) → Express auth route → Prisma user lookup + bcrypt → set cookies (token/refresh) → SPA guarda session en Context → (Checkout) `useApi.post /api/orders` → Zod validate → Prisma transaction (order + stock decrement) → response `{order, traceId}` → prom-client metrics/logs.

### Clases / Módulos (simplificado)

- Frontend
  - `useApi` (axios client) → middlewares (sanitization, csrf attach).
  - `useAnalytics` → GA/FB + `/api/analytics/events`.
  - Stores: `cartStore` (Zustand), `uiStore`.
- Backend
  - `routes/*` delegan a servicios:
    - AuthService (bcrypt/jwt)
    - ProductService (cache headers, search/paginate)
    - OrderService (transaction stock)
    - External provider clients (if added) should live out-of-repo and be injected via orchestration; prefer webhooks/orchestrators for LLM calls.
    - AnalyticsService (ingest + persist)
  - Utilidades: logger, response envelope, loginLockout.

### Flujos de datos sensibles

- Credenciales → /api/auth/login → bcrypt → JWT (cookie httpOnly).
- Tokens → headers/cookies → auth middleware → req.user.
- Orders → Prisma → SQLite → backups cifrados.
- Analytics → (nuevo) ingest con validación y almacenamiento.

## Decisiones clave (ADR resumen)

- JWT en cookies httpOnly + refresh: simplicidad SPA; requiere CSRF doble submit.
- Prisma + SQLite local: rápido; plan de migración a Postgres para prod.
- DOMPurify en frontend: sanitiza HTML de CMS/fallback; evitar XSS.
- Rate-limit y CSRF en BFF: mitigación de abuso y CSRF.
- Prometheus + traceId: observabilidad mínima unificada.

## Riesgos actuales

- Secretos/SQLite en repo (deben eliminarse).
- CSP incompleta (bloquea terceros o permite gaps).
- Endpoint analytics ausente (404); GA/FB no medidos.
- Bundle grande por import estático de catálogo.
- Modal Auth sin a11y adecuado.

## Objetivos arquitectónicos

- Latencia sub-100ms en BFF (P95 <300ms), LCP <2.5s.
- Seguridad por capas (CSP completa, CSRF, JWT seguro, secret mgmt).
- Observabilidad completa (trazas + métricas + logs).
- Despliegues sin downtime (canary/blue-green) y backups probados.
