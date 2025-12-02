# Roadmap de Refactor y Deuda Técnica

## Principios

- SOLID, Clean Architecture (capas: rutas → servicios → repos → modelo), separación UI/estado/datos en frontend.
- Complejidad ciclomática <10, cognitive <15 en funciones; dividir componentes grandes.
- Reducir duplicación (Cart/Notification) y side effects en hooks.

## Backend

    - Extraer servicios: AuthService, ProductService, OrderService, AnalyticsService. (LLM/AI integrations should be handled externally via orchestrators or provider-specific services, not embedded in the core repo.)

- Repositorios Prisma delgados (selects explícitos, sin lógica de dominio).
- Middleware común de errores con códigos consistentes; reuse sendErrorResponse.
- Logger estructurado (pino) con child por traceId.
  - Circuit breaker/retry con jitter y timeout para integraciones externas.

## Frontend

- Boundaries claras: `ui/`, `state/`, `data/` para hooks y API.
- Modales (Auth/Cart): focus trap, portal, controlados; ESC y aria.
- Eliminar imports pesados en layout inicial; lazy + suspense; catálogos legacy en import dinámico.
- Sanitización unificada: helpers únicos (`sanitizeProductContent`, `sanitizeHtml`).
- Fallback offline seguro para catálogo: cache local sanitizada y con expiración.

## Migraciones de compatibilidad

- Feature flags para nuevos endpoints/contratos (analytics, CSP enforce).
- Versionado de API: header `X-API-Version`, semver en OpenAPI.
- Deprecaciones: anunciar, mantener compat 1 release, fallback controlado.

## Métricas de éxito

- Maintainability index en verde; CC promedio <7; duplicación <5%.
- Bundle inicial <600kB; tests de regresión verdes.
- Error budget respetado; `useApi` con retry/circuit breaker validado en caos/stage.
