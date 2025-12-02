---
title: Plan Fase 4 – Observabilidad, CI/CD y Resiliencia
status: draft
---

# Plan detallado Fase 4

Objetivo: avanzar de forma trazada en observabilidad, pipelines y resiliencia siguiendo T4.1..T4.6 del plan maestro.

## Sprint 1 – Trazas y métricas (T4.1/T4.2)

- Instrumentar backend con OpenTelemetry y traceId en logs/respuestas.
- Extender `prom-client` con métricas clave (p95/p99, error rate, counters por ruta) y exportarlas en `/metrics`.
- Probar `verify:observability` (o script similar) y documentar el dashboard/datos.
- Artefactos: middleware OTel, dashboard JSON/captura, ejemplo de trace/log.

## Sprint 2 – CI/CD y canary (T4.3/T4.4)

- Pipeline (GitHub Actions) que ejecute lint, type-check, test, contract, a11y, perf (api/web), security.
- Job de artefactos (SBOM, coverage, LHCI, k6 logs) y smoke post-deploy (`npm run smoke`).
- Documentar runbook canary (5%-25%-50%-100%) y rollback.
- Artefactos: workflow YAML, runbook, script smoke.

## Sprint 3 – Resiliencia/Synthetic monitoring (T4.5/T4.6)

- Definir política de backups y prueba de restore (documentada en runbook).
- Crear synthetic checks para login/catalog/checkout y alertas básicas (error rate, perf, smoke).
- Registro de prueba de restore + logs de synthetic check.

## Seguimiento

- Cada sprint actualiza `GPT-51-Codex-Max-Hight/CheckList.md` y `docs/phase-checkpoints.md` con evidencia y artefactos.
- Mantener los artefactos en `reports/` o en los workflows para facilitar la revisión.

¿Comienzo por Sprint 1 (trazas/métricas) y actualizo las plantillas de runbook/documentos listados?
