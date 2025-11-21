# Roadmap de Mejoras

---

version: 1.0  
updated: 2025-11-19  
owner: PM Técnico

## Tabla de iniciativas

| ID       | Descripción                                          | Dependencias                        | ETA      | Métrica de éxito                                          |
| -------- | ---------------------------------------------------- | ----------------------------------- | -------- | --------------------------------------------------------- |
| IMPR-001 | Backend Auth + tokens seguros (BFF Express + SQLite) | Fase 1 completada, recursos backend | 1 semana | API 3001 operativa, tests integración OK                  |
| IMPR-002 | Refactor `withLazyLoading` + code-splitting          | IMPR-001                            | 3 días   | Bundle inicial ≤650 kB, Lighthouse LCP <2.5 s             |
| IMPR-003 | `optimizeImages.ts` real + pipeline de assets        | IMPR-001                            | 2 días   | 90 % assets WebP/AVIF, build sin warnings                 |
| IMPR-004 | Sanitización DOM y políticas CSP mínimas             | IMPR-001                            | 2 días   | 0 hallazgos XSS, tests DOMPurify aprobados                |
| IMPR-005 | Revisión completa de Playwright + helpers            | IMPR-003                            | 4 días   | Playwright estable (<5% flaky), assertions significativas |
| IMPR-006 | Limpieza de encoding/i18n                            | IMPR-001                            | 3 días   | UI sin mojibake, `Intl.NumberFormat` adoptado             |
| IMPR-007 | Dashboard de métricas (LCP, errores, coverage)       | IMPR-002/005                        | 3 días   | `metrics-dashboard.md` actualizado tras cada release      |
| IMPR-008 | Generador de manifest de imágenes + validación       | IMPR-003                            | 2 días   | 0 imágenes 404 (IMG-ASSET-010 cerrado)                    |

## Roadmap visual (Q4 2025 → Q1 2026)

```
Semana 1: [IMPR-001][IMPR-004]
Semana 2: [IMPR-002][IMPR-003]
Semana 3: [IMPR-005]
Semana 4: [IMPR-006]
Semana 5: [IMPR-007] + preparación release
```

## Riesgos y mitigaciones

- **Capacidad backend limitada:** priorizar endpoints mínimos (login/refresh/profile) y mockear desde BFF temporal.
- **Flujos CI largos:** paralelizar jobs (lint/unit/e2e) y usar cache npm.
- **Cambios de encoding masivos:** trabajar en feature branch y usar snapshots actualizados.

---

### Historial de cambios

- **2025-11-19 · v1.0** – Roadmap inicial alineado al plan por fases.
