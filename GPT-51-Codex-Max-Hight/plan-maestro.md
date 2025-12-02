# Plan Maestro Ejecutivo (v2.0)

owner: Arquitectura & SRE  
duración estimada: 6-8 semanas (iterable, sprint 1-2 semanas)  
principios: seguridad-primero, prueba-antes-de-avanzar, evidencia medible

## Gates por fase

- Gate común: `npm run lint && npm run type-check && npm run test:ci && npm run scan:security && npm run format:check`.
- Gate de seguridad: gitleaks=0, npm audit high=0, trivy fs=0 críticos.
- Gate de desempeño: LCP desktop <2.5s, API P95 <300ms, error rate <0.5%.
- Gate de a11y: axe-playwright sin “serious/critical”.
- Gate de datos: migraciones Prisma aplicadas en stage + backup verificado antes de prod.
- Gate de contratos: OpenAPI actualizado y `npm run test:contract` verde; drift check pasado.
- Gate de supply-chain: SBOM generado + política de licencias aprobada.

## Fase 0 — Preparación y contención (2-3 días)

- T0.1 Inventario y hashes (refrescar `inventory.json`) y comparar con baseline.
- T0.2 Secretos: eliminar .env/.sqlite versionados; rotar JWT y otras claves/provider keys; reforzar .gitignore; activar gitleaks pre-commit y en CI.
- T0.3 Congelar deploy hasta cerrar críticos; RFC del alcance; habilitar CSP en report-only.
- Entregables: plan de trabajo aprobado, secrets rotados, CSP report-only activa, respaldo cifrado (RPO 24h) probado.

> Nota: Para seguimiento fino y evidencia del progreso, consulta `CheckList.md` en esta misma carpeta; contiene el estado actual, evidencia y próximos pasos por tarea.

## Fase 1 — Seguridad & Estabilidad (5-7 días)

- T1.1 Backend hardening: helmet CSP explícita (dominios GA/FB/Maps), HSTS, rate-limit por ruta, body limit 1MB, CORS mínimo, cookies Secure/HttpOnly/SameSite=strict.
- T1.2 AuthN/AuthZ: zod en entradas, roles admin/user, bloqueo login (ya), MFA estática → dinámica; refresh token rotación.
  - T1.3 Validación/sanitización: zod en /products, /orders; DOMPurify en frontend; escape server-side.
- T1.4 Gestión de secretos y dependencias: vault/gh-secrets; SBOM (CycloneDX); npm audit + overrides documentados.
- T1.5 Seguridad de IA: ENABLED via external integrations only — project removed built-in /api/ai; any LLM integration should be handled externally and follow secrets best-practices.
- T1.6 DAST/SAST: eslint-plugin-security, trivy fs, zap-baseline; gitleaks en PR.
- T1.7 Supply chain: attestation/firmas (cosign) opcional; política de licencias (allowlist).
- Entregables: security-playbook actualizado, threat-model, CSP enforce lista, report SAST/DAST adjunto.

## Fase 2 — Datos, API y contratos (5-7 días)

    - T2.1 OpenAPI 3.1 completa (auth/products/orders/health/analytics) + tests de contrato (Prism/Dredd).

- T2.2 Prisma: migraciones versionadas; índices para products (createdAt), orders (userId, createdAt DESC), stock decrements transaccionales.
- T2.3 Catálogo: paginación defensiva, búsqueda insensible, ETag + Cache-Control 5m; fallback catálogo lazy import (remover bundle gordo).
- T2.4 Integridad: seeds idempotentes; validación de cantidades/stock; respuestas normalizadas `{code,message,traceId}`.
- T2.5 Analytics: implementar /api/analytics/events con zod, rate-limit y almacenamiento asíncrono; opcional cola.
- T2.6 Drift check: validar que OpenAPI ↔ implementaciones no divergen; regenerar tipos desde OpenAPI.
- Entregables: openapi.yaml, migraciones aplicadas en stage, pruebas de contrato verdes, bundle inicial <600kB.

## Fase 3 — Frontend UX, A11y y Performance (5-7 días)

- T3.1 Estado y modales: focus trap + ESC en AuthModal; providers únicos; evitar doble fetch en StrictMode.
- T3.2 Code splitting/lazy: catálogo legacy lazy, modales, gráficos; revisar imports pesados (lodash, recharts, framer-motion).
- T3.3 Imágenes: optimize-images en build, `loading="lazy"` default, srcset/responsive para galerías.
- T3.4 A11y WCAG 2.2 AA: landmarks, aria en inputs, contraste header/hero, navegación teclado en menús y sliders.
- T3.5 Performance web: medir LCP/INP/CLS con LHCI; perf budgets en CI; prefetech selectivo, debounce en search.
- Entregables: LHCI reporte, axe-playwright reporte, bundle report, checklist a11y cumplida.

## Fase 4 — Observabilidad, CI/CD y Resiliencia (5-7 días)

- T4.1 Logging/tracing: logger estructurado (pino) con niveles, máscara de PII; OpenTelemetry (HTTP client/server) con traceId en headers.
- T4.2 Métricas: prom-client ampliado (p95/p99, error_rate, queue time); dashboards (Grafana/LHCI/k6); alertas con umbrales dinámicos.
- T4.3 CI/CD: pipeline build→lint→type→test→contract→a11y→perf (smoke)→security→deploy canary→smoke→promote; artefactos (SBOM, coverage, LHCI).
- T4.4 Feature flags y despliegues: FF por capacidad; canary 5%-25%-50%-100% con rollback automático; blue/green opcional.
- T4.5 Backups/DR: snapshot DB cifrado (RPO 24h, RTO 2h), restore test trimestral; DR runbook.
- T4.6 Monitoreo sintético: checks de login, catálogo, checkout; alertas de burn-rate de SLO.
- Entregables: pipeline YAML actualizado, dashboards y alertas activas, runbooks verificados.

## Fase 5 — Refactor, deuda y prevención (4-5 días)

- T5.1 Complejidad: reducir CC >10 y cognitive >15; dividir componentes grandes; hooks reutilizables.
- T5.2 Patrones: aplicar SOLID y Clean Architecture en backend (rutas→servicios→repositorios); frontend con boundaries (UI/estado/datos).
- T5.3 Pre-commit y normas: husky + lint-staged + tests rápidos; code review checklist; guía de estilo por lenguaje.
- T5.4 Documentación viva: ADRs para decisiones críticas (CSP, tracing, flags); actualización continua de OpenAPI/diagramas.
- Entregables: métricas de maintainability index mejoradas, ADRs publicados, pre-commit obligatorio.

## Métricas de salida (SLOs)

- Seguridad: 0 vuln high/critical; secrets expuestos=0.
- Calidad: cobertura statements ≥85% (objetivo 90%); mutation score opcional ≥60%.
- Rendimiento: LCP <2.5s desktop / <3s mobile; CLS <0.1; INP <200ms; API P95 <300ms; error rate <0.5%.
- Fiabilidad: tiempo de restauración probado ≤2h; éxito de rollback canary <5 min; downtime deploy=0.
- Observabilidad: 100% rutas con trazas; logs con traceId; dashboards y alertas verdes.
- Mantenibilidad: maintainability index en verde; deuda técnica reducida (cc promedio <7); licencias aprobadas 100%.

## Matriz de trazabilidad (hallazgos → tareas)

- SEC-SECRET-001 → F0 T0.2, F1 T1.4; Métrica: gitleaks=0, secrets rotados.
- SEC-AI-002 → F1 T1.5; Métrica: sin logs de claves, timeout 10s, rate-limit activo.
- SEC-CSP-003 → F1 T1.1; Métrica: CSP enforce sin bloqueos GA/FB/Maps.
- PERF-BUNDLE-005 → F2 T2.3 + F3 T3.2; Métrica: bundle <600kB, LCP mejora.
- A11Y-MODAL-004 → F3 T3.1/T3.4; Métrica: axe sin serious, focus trap OK.
- REL-ANALYTICS-006 → F2 T2.5 + T2.6; Métrica: 200/202 en /analytics/events, contract tests verdes.

## RACI (resumen)

- BE: rutas, Prisma, auth/analytics, observabilidad backend.
- FE: UX/A11y/perf, stores, modales, lazy/catalog.
- SRE: CI/CD, IaC, monitoreo, backups, canary/blue-green.
- Sec: secretos, CSP/CORS, SAST/DAST, SBOM/licencias.
- QA: tests, contract, e2e, perf, a11y, smoke/rollout checks.
