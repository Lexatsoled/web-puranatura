# Dashboard de Metricas

## Objetivos de Rendimiento (Web Vitals)

| Metrica                            | Baseline (Actual)                           | Target (Objetivo) | Estado           |
| ---------------------------------- | ------------------------------------------- | ----------------- | ---------------- |
| **LCP** (Largest Contentful Paint) | 2.2s (desk, 08/12) / 3.6s (mob, 04/12)      | < 2.5s            | ✓ Desktop cumple |
| **FID/INP** (Input)                | INP <100ms (Lighthouse audit)               | < 100ms           | ✓ Cumple         |
| **CLS** (Cumulative Layout Shift)  | 0 (desk, 08/12) / 0.000 (mob, 04/12)        | < 0.1             | ✓ Cumple         |
| **TTFB** (Time to First Byte)      | 3ms (mob, 04/12)                            | < 200ms           | ✓ Cumple         |
| **Bundle inicial gzip**            | ~109KB (index 72.22KB + `products` 38.49KB) | < 200KB           | ✓ Dentro budget  |
| **TTI/TBT** (Interaccion/Bloqueo)  | TTI ~2.2s (desk, 08/12) / TBT <60ms         | < 300ms TBT       | ✓ Cumple         |

## Objetivos de Accesibilidad y UX

| Metrica                         | Baseline                  | Target | Estado |
| ------------------------------- | ------------------------- | ------ | ------ |
| **Puntaje axe/playwright**      | 0 violaciones (run 08/12) | >= 90  | ✓      |
| **Navegacion teclado bloqueos** | Sin hallazgos en axe      | 0      | ✓      |

## Objetivos de Calidad de Codigo

| Metrica                    | Baseline    | Target          | Estado          |
| -------------------------- | ----------- | --------------- | --------------- |
| **Cobertura de Tests**     | Desconocida | > 80%           | ƒ?" Medir       |
| **Deuda Tecnica (Issues)** | N/A         | 0 Critical/High | ƒ?" En progreso |
| **Build Time**             | N/A         | < 2 min         | ? OK            |

## Objetivos de API (Backend)

| Metrica              | Target                  |
| -------------------- | ----------------------- |
| **Error Rate (5xx)** | < 0.1% (actual: 0%)     |
| **P95 Latency**      | < 300ms (actual: ~17ms) |
| **P99 Latency**      | < 400ms (actual: ~36ms) |
| **Uptime**           | 99.9%                   |

- `npm run perf:api` (k6 smoke) genera p95 ≈ 17 ms y p99 ≈ 36 ms para `/api/products?page=1&pageSize=5` cuando el backend arranca con `DATABASE_URL=file:./prisma/dev.db` tras aplicar migraciones y seed; 0 % `http_req_failed`. Mantén los artefactos `reports/observability/perf-summary.md`, `reports/observability/observability-artifacts.zip` y `reports/observability/metrics-snapshot.txt` adjuntos a cada release/PR, y actualiza este dashboard con los percentiles antes de cerrar el gate.

## Mediciones recientes (08/12/2025)

- `npm run build`: `dist/assets/index-DV-irMwS.js` en 223.45kB (72.22k gzip) y `products-j7gKeNRV.js` en 145.75kB (38.49k gzip, chunk deprecado para fallback legacy). Bundle total gzip ~109KB para ruta crítica.
- `npm run perf:web` (Lighthouse): LCP 2.2s (desktop, 08/12), CLS 0, TTI ~2.2s, TBT <60ms. Report HTML generado en `localhost_2025-12-08_10-49-12.report.html`. Desktop cumple objetivo LCP <2.5s. Mobile dato anterior: LCP 3.6s (04/12) - **acción futura**: optimizar mobile LCP con lazy-load de imágenes si es necesario.
- `npm run a11y`: axe/playwright 0 violaciones (run 08/12), sin bloqueos de teclado detectados. Score >=90 confirmado.
- Resumen: Fase 3 objetivos cumplidos en desktop (LCP, CLS, TTI, TBT, bundle, a11y). Mobile LCP aún en 3.6s (por encima de 2.5s objetivo) pero dentro de rango acceptable para iteración futura post-Fase-3.

## Como medir (nota operativa)

- Despues de `npm install`: `npm run build && npm run perf:web` (LHCI) para LCP/CLS/INP/TTI y peso de bundle gzip. Si Lighthouse falla al borrar tmp en Windows, toma las métricas desde el HTML generado en `reports/`.
- Accesibilidad: `npm run a11y` (axe/playwright). Registrar score y bloqueos de teclado.
- API perf (opcional fase 4): `npm run perf:api` para p95/error rate.
