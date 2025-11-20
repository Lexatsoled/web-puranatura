# metrics-dashboard.md

| Métrica                        | Baseline (nov-2025)              | Target                  | Owner    | Fuente                       |
| ------------------------------ | -------------------------------- | ----------------------- | -------- | ---------------------------- |
| LCP (StorePage móvil)          | 4.1 s (Lighthouse 2025-11-04)    | ≤ 2.5 s                 | Frontend | lighthouse-ci, k6            |
| CLS                            | 0.14                             | ≤ 0.10                  | Frontend | lighthouse-ci                |
| INP                            | 280 ms                           | ≤ 200 ms                | Frontend | Web Vitals proxy             |
| Bundle JS Tienda               | ~780 KB (Vite stats)             | ≤ 250 KB                | Frontend | `vite build --report`        |
| API Auth p95                   | n/a (sin backend)                | ≤ 300 ms tras migración | Backend  | k6 / APM                     |
| Incidentes de secretos en repo | 3 archivos (`.env`, DB, backups) | 0                       | SecOps   | gitleaks / secret scan       |
| XSS PoC abierto                | true (BlogPostModal)             | false                   | AppSec   | Playwright + sanitizer tests |
| Consent opt-in registrado      | 0 %                              | ≥ 80 %                  | Producto | Analytics consent banner     |
| Cobertura unit tests           | 42 % (`npm run test:coverage`)   | ≥ 80 %                  | QA       | Vitest coverage              |
| Error rate Sentry              | n/a                              | <0.5 % sesiones         | Platform | Sentry / monitoring          |
