# Plan Maestro – Fase 5 (Refactor, deuda y prevención)

## Objetivos y métricas

- Reducir complejidad: top 5 módulos con CC>25 bajar a <15; objetivo global CC promedio <7 (`reports/complexity-report.json`).
- Gates: `npm run lint && npm run test:ci && npm run check:complexity`; si el cambio toca backend/observabilidad, añadir `npm run synthetic:checks`. Artefactos por PR: `reports/complexity-report.json`, `reports/synthetic/synthetic-report.json`, `reports/observability/observability-artifacts.zip`, `sbom.json`.
- Documentación viva: runbook `docs/runbooks/fase5-maintainability.md` y ADR `docs/adr/0003-phase5-maintainability.md` actualizados.

## T5.1 – Reducir CC y deuda técnica

1. Analizar `reports/complexity-report.json` y priorizar los módulos con mayor CC:
   - FE: `src/hooks/useProfile.ts` (35), `src/components/OptimizedImage.tsx` (32), `src/utils/sanitizer.ts` (32), `src/components/ProductCard.tsx` (31), `pages/AddressesPage.tsx` (31).
   - BE: revisar rutas con lógica mezclada (auth/orders/products) y extraer a servicios/repos.
2. Refactor por módulo: separar UI y lógica en hooks/subcomponentes; extraer efectos/cálculos pesados; en backend mover lógica de dominio a servicios/repositorios.
3. Tras cada refactor: `npm run lint`, `npm run test:ci`, `npm run check:complexity`. Registrar antes/después en el runbook y enlazar en la ADR.

## T5.2 – Clean Architecture / separación

1. Backend: rutas delgadas → servicios → repositorios (Prisma). Interfaz clara para cada servicio/DTO; validaciones fuera de controladores.
2. Frontend: capas UI/estado/datos bien separadas; evitar acoplamientos cruzados en imports.
3. Documentar límites y decisiones en ADR 0003 y en el runbook.

## T5.3 – Pre-commit y normas de revisión

1. Mantener `husky` + `lint-staged`; agregar, si aplica, un script `precommit:phase5` (lint + test:ci cuando el cambio toque backend/observabilidad).
2. Checklist para reviewers (añadir al runbook):
   - ¿ADR/plan actualizado?
   - ¿Artefactos adjuntos (complexity, synthetic, observability, SBOM)?
   - ¿Pasaron lint/test/complexity?
   - ¿Se redujo CC en el módulo tocado?
3. Ajustar plantilla de PR si hace falta para exigir evidencia/artefactos.

## T5.4 – ADRs y documentación viva

1. Completar ADR 0003 con cada refactor/decisión arquitectónica.
2. Actualizar `docs/phase-checkpoints.md` y `GPT-51-Codex-Max-Hight/CheckList.md` al cerrar cada T5.x.
3. Si se modifican rutas/dominio, añadir nota/diagrama en `GPT-51-Codex-Max-Hight/arquitectura.md`.

## Plan de ejecución (sprint 2–3 días)

- Día 1: Refactor 2 módulos FE (useProfile, OptimizedImage) + gates + actualizar runbook/ADR.
- Día 2: Refactor 1 módulo FE (ProductCard o AddressesPage) + 1 BE (mover lógica a servicios/repos) + gates + doc.
- Día 3: Ajustar pre-commit/checklist, completar ADR, recopilar artefactos, actualizar checkpoints y lanzar PR final con evidencia.

## Artefactos obligatorios por PR

- `reports/complexity-report.json`
- `reports/synthetic/synthetic-report.json` y `reports/observability/observability-artifacts.zip` (si toca backend)
- `sbom.json`
- ADR 0003 y runbook actualizados con notas de refactor (CC antes/después)

## Gate de cierre Fase 5

- T5.1–T5.4 marcados ✓ en `CheckList.md` y `docs/phase-checkpoints.md`.
- CC promedio <7; ningún módulo crítico >15.
- Husky/pre-commit activos y checklist de revisión en el runbook.
- ADR 0003 en estado “accepted”; docs vivos actualizados; artefactos adjuntos en el PR final.
