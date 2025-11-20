# Metrics Dashboard

| Métrica                    | Baseline (11/2025)         | Target Q1 2026             | Cómo medir / Owner                                  |
| -------------------------- | -------------------------- | -------------------------- | --------------------------------------------------- |
| LCP Home (`frontend-core`) | 3.8 s (desktop Lighthouse) | ≤ 2.5 s                    | `npm run build` + `npx lighthouse` / Frontend Guild |
| TTFB API `/auth/login`     | 900 ms (mock)              | ≤ 300 ms                   | k6 load + APM backend / SRE                         |
| Bundle inicial             | 2.1 MB                     | ≤ 650 kB                   | `vite build --analyze` / Frontend Guild             |
| Error rate Auth            | 6 % (por fallas locales)   | ≤ 1 %                      | Sentry + backend logs / AppSec                      |
| Cobertura pruebas          | 42 % statements            | ≥ 80 %                     | `npm run test:coverage` / QA                        |
| Secret leaks por release   | 2 hallazgos críticos       | 0                          | `gitleaks detect` en CI / DevSecOps                 |
| CLS promedio               | 0.18                       | ≤ 0.10                     | Lighthouse + RUM / UX                               |
| Eventos analytics válidos  | 0 % (feature rota)         | ≥ 95 % tras consentimiento | GA debug view + contract tests / Marketing Ops      |
