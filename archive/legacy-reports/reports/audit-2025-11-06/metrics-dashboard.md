# metrics-dashboard

| Métrica                          | Baseline (2025-11-06)                       | Objetivo                | Owner     | Notas / Fuente                                                               |
| -------------------------------- | ------------------------------------------- | ----------------------- | --------- | ---------------------------------------------------------------------------- |
| LCP (`/tienda`, desktop)         | N/D (Lighthouse bloqueado por interstitial) | < 2.5 s                 | Frontend  | Requiere liberar `npm run audit:all` tras Fase 0.                            |
| INP                              | N/D                                         | < 200 ms                | Frontend  | Instrumentar `useWebVitals` + enviar a analytics.                            |
| CLS                              | N/D                                         | < 0.1                   | Frontend  | Revisar transiciones en `ProductPage`.                                       |
| API P95 (`GET /api/products`)    | ~410 ms (sqlite local)                      | < 300 ms                | Backend   | Migrar a Postgres o cache read-only.                                         |
| Error rate frontend              | 2.3% (Sentry último mes)                    | < 0.5%                  | SRE       | Depende de logger + manejo de errores en stores.                             |
| Checkout success rate            | Simulado (localStorage)                     | > 90% en pedidos reales | Producto  | Activo después de /api/orders.                                               |
| Secret leaks detectados          | `.env`, `database.sqlite` versionados       | 0                       | DevSecOps | Se valida en `SEC-1.1`.                                                      |
| Accessibility score (Lighthouse) | 84                                          | > 92                    | UX        | Ejecutar `npx lhci autorun --collect.settings.onlyCategories=accessibility`. |

> _Las métricas marcadas como “N/D” requieren desbloquear el pipeline de Lighthouse (Fase 0)._
