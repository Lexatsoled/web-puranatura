---
title: Fase 5 – Estandarizar mantenimiento y ADR viva
status: draft
---

# ADR 0003 – Fase 5: reduce complexity y prioriza documentación viva

## Context

Con las fases 0-4 superadas, el próximo gate exige reducir deuda técnica, asegurar la arquitectura y documentar las decisiones. El reporte de complejidad actual muestra módulos con CC >30, y no todos los cambios están reflejados en la documentación viva o en una política clara de pre-commit.

## Decision

1. Ejecutar `scripts/check-complexity.cjs` como parte del gate de fase 5 y reducir los módulos con CC elevado mediante refactors que separen UI/ lógica en hooks y servicios.
2. Crear el runbook `docs/runbooks/fase5-maintainability.md` que articule pasos para T5.1-T5.4 (refactor, clean architecture, pre-commit, ADRs).
3. Mantener `lint-staged`/`husky` y añadir `npm run synthetic:checks` + `npm run test:ci` como pasos obligatorios cuando el cambio toca backend+observabilidad.
4. Publicar esta ADR en `docs/phase-checkpoints.md` y `CheckList.md` para que revisores sepan qué pruebas/documentos deben validarse antes de cerrar la fase.

## Consequences

- Mantenimiento más predecible y gate basado en métricas (CC, tests, ADR).
- Dependencia explícita de `reports/complexity-report.json`, `reports/synthetic/` y `reports/observability/` como evidencia para cada release.
- Se refuerza la necesidad de actualizar ADRs y runbooks cada sprint, evitando drift documental.
