# Dashboard de Metricas

## Objetivos de Rendimiento (Web Vitals)

| Metrica                            | Baseline (Actual)                         | Target (Objetivo) | Estado                           |
| ---------------------------------- | ----------------------------------------- | ----------------- | -------------------------------- |
| **LCP** (Largest Contentful Paint) | 3.2s (desk, 01/12) / 3.6s (mob, 04/12)    | < 2.5s            | ƒsÿ‹÷? Pendiente bajar LCP móvil |
| **FID/INP** (Input)                | INP no emitido en audit perf              | < 100ms           | ƒ?" Medir (INP no emitido)       |
| **CLS** (Cumulative Layout Shift)  | 0 (desk) / 0.000 (mob, 04/12)             | < 0.1             | ƒo. Cumple                       |
| **TTFB** (Time to First Byte)      | 3ms (mob, 04/12)                          | < 200ms           | ƒo. Cumple                       |
| **Bundle inicial gzip**            | ~109KB (index 72.20k + `products` 38.49k) | < 200KB           | ƒo. Dentro de budget             |
| **TTI/TBT** (Interaccion/Bloqueo)  | TTI ~3.5s (mob, 04/12) / TBT 60ms         | < 300ms TBT       | ƒsÿ‹÷? Afinar junto con LCP      |

## Objetivos de Accesibilidad y UX

| Metrica                         | Baseline                       | Target | Estado |
| ------------------------------- | ------------------------------ | ------ | ------ |
| **Puntaje axe/playwright**      | axe: 0 violaciones (run 04/12) | >= 90  | ƒo.    |
| **Navegacion teclado bloqueos** | Sin hallazgos en axe           | 0      | ƒo.    |

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

## Mediciones recientes (04/12/2025)

- `npm run build`: `dist/assets/index-DslRoTFe.js` sigue en 223.44kB (72.20k gzip) y `SimpleLayout`/`AuthContext` no crecieron, mientras que el chunk `products-j7gKeNRV.js` permanece en 145.75kB (38.49k gzip) pero ahora sólo se solicita cuando `useProductDetails` activa el fallback legacy (import dinámico con caché). Esto mantiene la ruta crítica del catálogo ligera y empuja los datos pesados al escenario de degradado.
- `npm run perf:web`: LHCI móvil (reportes en `reports/lighthouse-mobile-latest.report.report.json`) sigue dando LCP 3.6s, CLS 0, TTI 3.5s y TBT 60ms tras esta refactorización, lo que confirma que el bundle ya no crece para el flujo principal aunque la métrica todavía requiere trabajo adicional.
- `npm run a11y`: axe/playwright (`reports/axe-report.json`) sigue sin violaciones (0 violations) ni bloqueos de teclado; genera los reportes `localhost_2025-12-04_15-34-40.report.html`/`.json` y `reports/axe-report.json`.

## Como medir (nota operativa)

- Despues de `npm install`: `npm run build && npm run perf:web` (LHCI) para LCP/CLS/INP/TTI y peso de bundle gzip. Si Lighthouse falla al borrar tmp en Windows, toma las métricas desde el HTML generado en `reports/`.
- Accesibilidad: `npm run a11y` (axe/playwright). Registrar score y bloqueos de teclado.
- API perf (opcional fase 4): `npm run perf:api` para p95/error rate.
