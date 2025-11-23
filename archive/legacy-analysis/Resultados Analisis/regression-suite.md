# regression-suite.md

| Tipo               | Cobertura                                          | Comandos / Herramientas                                                               | Notas                                                                                                                                                  |
| ------------------ | -------------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Unit (Vitest)      | Hooks, contextos, utils (`frontend-core`, `state`) | `npm run test -- --maxWorkers=1 --no-file-parallelism`                                                     | Incluir mocks para localStorage, sanitizer, hooks SEO/analytics. Cobertura objetivo ≥80 %.                                                             |
| Integration API    | Auth, productos, analytics (`backend-lite`)        | `npm run test:ci` (Supertest)                                                         | Requiere backend levantado (`npm run dev --workspace backend`). Validar hashing, rate-limits y respuestas 4xx.                                         |
| E2E (Playwright)   | Flujos Store/Cart/Auth/Consent                     | `npm run test:e2e`                                                                    | Prepara build (`npm run build`), arranca preview y ejecuta specs (`e2e/search-filter-cart.spec.ts`, `auth-flow.spec.ts`, `analytics-consent.spec.ts`). |
| Seguridad estática | Secret scan + dep audit                            | `npx trufflehog filesystem .`, `npm audit`, `npx depcheck`                            | Bloquear PR si hay CVE alta o secretos. Añadir verificación en CI.                                                                                     |
| Performance        | k6 + Lighthouse budgets                            | `k6 run k6/store-smoke.js`, `npm run test:performance` (lighthouse-ci)                | Medir LCP, TTFB, INP. Registrar resultados en `metrics-dashboard.md`.                                                                                  |
| Accesibilidad      | Axe + Playwright + CI                              | `npx @axe-core/cli http://localhost:5173`, `npm run test:e2e -- --grep accessibility` | Validar modales (focus trap/aria), contraste y navegación teclado.                                                                                     |
| Observabilidad     | Contract tests de logs/traces                      | `npm run test -- logging`, verificar `monitoring/` dashboards                         | Asegura que cada request genera trace/metric según `docs/MONITORING_SETUP.md`.                                                                         |

## Ejecutar localmente

1. `npm install` (frontend) y `npm install` en `backend/` si aplica.
2. Levantar backend/API mocks antes de integration/e2e.
3. Usar `npm run regression` (tarea compuesta sugerida) para correr Unit → Integration → E2E → Axe.

## Automatización

- GitHub Actions pipeline con jobs paralelos (unit/lint, integration, e2e, audits).
- Publicar reportes (coverage, Playwright HTML, Lighthouse) como artifacts.
- Fijar umbrales: `branches: main` requiere suite completa; otras ramas pueden ejecutar subset si etiquetadas.
