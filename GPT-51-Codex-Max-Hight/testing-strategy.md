# Estrategia de Testing (cobertura objetivo 100% rutas críticas)

## Tipos y alcance
- Unit: lógica pura (sanitizer, mappers, stores Zustand, utilidades). Cobertura objetivo ≥90% statements/branches en utils/stores.
- Component/UI: Testing Library + jsdom/happy-dom para componentes clave (AuthModal, CartModal, ProductCard, Breadcrumbs).
- Integration (frontend): flujos `useApi` con MSW; AuthContext + CartContext + Wishlist.
- Contract/API: Prism/Dredd contra OpenAPI 3.1 (auth/products/orders/analytics/ai/health).
- E2E: Playwright/Cypress (login, catálogo, carrito, checkout, wishlist, métricas page).
- Seguridad: gitleaks, trivy fs, eslint-plugin-security, npm audit (high), CSP check.
- Performance: LHCI (web), k6 (API smoke/stress), bundle report Vite.
- A11y: axe-playwright (páginas y modales) + contrast checks.
- Regresión: suites etiquetadas por dominio (auth, catálogo, órdenes, perfil).
- Fuzzing (ligero): fast-check/zod-fuzz en payloads críticos (auth, orders, analytics) para inputs inesperados.

## Matriz de escenarios críticos
- Auth: register/login/logout/refresh, lockout, MFA header, cookies secure.
- Productos: list paginado, filtros/búsqueda, 304 con ETag, producto inexistente 404.
- Orders: crear con stock suficiente, insuficiente (400), listado usuario, authz admin.
- Analytics: POST /analytics/events con y sin payload válido (429, 400).
- AI: prompt válido, prompt vacío (400), timeout (simulado), rate-limit.
- Frontend UX: modal foco/Escape, accesibilidad de formularios, lazy load catálogo.
- Observabilidad: /metrics responde 200; traceId en headers; logs con traceId.

## Cobertura y métricas
- Cobertura mínima: 85% global, 100% en rutas críticas (auth, orders, products).
- Mutation testing opcional (stryker) en utils/stores (objetivo ≥60%).
- Performance budgets: LCP <2.5s, CLS <0.1, INP <200ms, bundle <600kB.
- Contract drift: verificar que OpenAPI ↔ implementación coincide (Prism/Dredd) y regenerar tipos desde OpenAPI.

## Datos de prueba
- Fixtures seed Prisma por ambiente (dev/stage); MSW para frontend.
- Usuarios: admin (email en env.adminEmails), user normal, lockout user.
- Productos: catálogo mínimo 10 items con stock variado; out-of-stock para pruebas negativas.
- Datos sintéticos: sin PII; anonimizar cualquier dump; diferenciar datasets dev/stage/prod (no compartir prod).

## Automatización (scripts)
- `npm run test:ci` (vitest) — unit/integration.
- `npm run test:e2e` — build + e2e.
- `npm run test:contract` — contratos OpenAPI.
- `npm run a11y` — axe-playwright.
- `npm run perf:web` — LHCI.
- `npm run perf:api` — k6 smoke.
- `npm run scan:security` — gitleaks + trivy.
- `npm run test:fuzz` (sugerido) — fast-check/zod-fuzz en endpoints críticos.

## Política de PR
- Cada PR: pruebas relevantes + contract + lint + type + coverage ≥ umbral; adjuntar reportes (coverage, LHCI si toca UI, k6 si toca API).
- No merge si falla algún gate o hay findings high/critical abiertos.
