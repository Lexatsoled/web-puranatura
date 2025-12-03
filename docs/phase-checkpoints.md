# Estado de fases – índice y punto de entrada canonical

Este archivo es un índice de compatibilidad en `docs/` que redirige a la fuente de verdad del plan maestro.

Fuente canonical:

- `GPT-51-Codex-Max-Hight/CheckList.md` (checklist maestro, evidencias y pasos por fase)

Última actualización: 2025-12-03 — sincronizado con CheckList (lint/test:ci/complexity verdes; fallback de tienda apuntando a `data/products.ts`; CC máxima 15 en `reports/complexity-report.json`).

Estado actual (resumen):

- Fase 4 COMPLETADA: trazas/metrics (T4.1/T4.2), pipeline/canary + SBOM (T4.3/T4.4) y backup/DR + sintéticos (T4.5/T4.6). Artefactos: `docs/runbooks/observability.md`, `docs/runbooks/ci-canary.md`, `GPT-51-Codex-Max-Hight/runbooks/backup-dr.md`, `reports/observability/`, `reports/synthetic/synthetic-report.json`, `sbom.json`.
- Fase 5 COMPLETADA: T5.1/T5.2/T5.3/T5.4 en marcha. Evidencia requerida: `reports/complexity-report.json`, ADR `docs/adr/0003-phase5-maintainability.md`, `docs/runbooks/fase5-maintainability.md`, gates (`npm run lint`, `npm run test:ci`, `npm run check:complexity`) verdes por cambio.

Nota: Para cualquier actualización operativa, edita solo `GPT-51-Codex-Max-Hight/CheckList.md` y refleja allí las evidencias; este archivo resume el estado para referencias externas.
