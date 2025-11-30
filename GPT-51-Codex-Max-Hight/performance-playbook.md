# Performance Playbook

## Presupuestos

- Web: LCP <2.5s (desk), <3s (mobile); INP <200ms; CLS <0.1; Bundle inicial <600kB.
- API: P95 <300ms, P99 <500ms; error rate <0.5%; throughput baseline k6 smoke estable.

## Tácticas Frontend

- Code splitting: lazy en catálogos, modales, charts, analytics.
- Fallback catálogo: import dinámico (evitar bundle de `data/products.ts`).
- Imágenes: optimize-images en build; `loading="lazy"`; srcset para galerías.
- Minificar dependencias: revisar lodash/recharts/framer-motion; tree-shaking y dedupe.
- Red: cache/ETag en catálogos; debounce búsqueda; prefetch selectivo.

## Tácticas Backend

- Índices Prisma (products.createdAt, orders.userId+createdAt).
- Cache headers en GET /products (ya con ETag); añadir 304 handling en cliente.
	- Pool/timeout: axios client con timeout; external providers should have enforced timeouts (e.g. 10s) and safe fallbacks.
- Rate-limit por ruta; body limit 1MB; evitar N+1 (Prisma include selectivo).

## Medición

- LHCI (`npm run perf:web`) en main y PR críticos.
- k6 smoke (`npm run perf:api`) y stress opcional; report a `reports/k6-*`.
- Vite build report para bundle size.
- prom-client: histogram http_request_duration_seconds (agregar p95/p99).

## Plan de mejora (ligado a hallazgos)

- Quitar import estático de catálogo (PERF-BUNDLE-005).
- Añadir lazy a modales pesados (Cart/Auth) y charts.
- Revisar CSP para permitir GA/FB y medir LCP real.
- Optimizar imágenes hero/banner con versiones webp.
