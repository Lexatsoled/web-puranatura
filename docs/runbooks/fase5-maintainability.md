# Runbook Fase 5 – Refactor, deuda técnica y prevención

Este runbook describe los pasos que estamos ejecutando para cerrar **T5.1–T5.4** del Plan Maestro y dejar la base lista para futuras iteraciones (mantenimiento X0, ADRs actualizados, pre-commit obligatorio).

## T5.1 – Reducir complejidad (CC<10 / CI mantenible)

1. Analiza `reports/complexity-report.json` (generado por `npm run check:complexity`). Identifica los _top 5_ módulos con mayor complejidad (por ejemplo `src/hooks/useProfile.ts`, `src/components/ProductCard.tsx`) y prioriza dividirlos en hooks/functions más pequeños con responsabilidades claras.
2. Aplica refactor objetivo en un módulo a la vez, midiendo el impacto en el `complexity-report`. Documenta cada refactor como un paso en este runbook (`docs/runbooks/fase5-maintainability.md`) y referencia el archivo modificado.
3. Siempre corre `npm run lint` y `npm run test:ci` tras cada refactor para asegurar que el cambio no rompe; el gate de Fase 5 exige que la complejidad promedio baje (ideal <7) y que los tests/lint sigan verdes.

## T5.2 – Clean Architecture y separación

1. Revisa los límites entre capas en el backend (rutas → servicios → prisma). Define carpetas `backend/src/controllers`, `backend/src/services`, `backend/src/repositories` si no existen y mueve la lógica allí; cada servicio debe recibir una interfaz clara (DTO).
2. En el frontend, separa UI, estado y datos: props de los componentes solo deben derivar de store/hooks, los effects/extracts se centralizan en `src/hooks`.
3. Registra cada decisión arquitectónica en una ADR (ej. `docs/adr/0003-phase5-maintainability.md`) y enlaza al plan de sprint. Esto alimentará T5.4.

## T5.3 – Pre-commit y normas de revisión

1. Mantén `husky` + `lint-staged` activados (`package.json`). Añade un script `npm run precommit:phase5` (si no existe) que combine `npm run lint` y `npm run test:ci` si el cambio toca backend.
2. Actualiza `docs/runbooks/ci-canary.md` y `docs/runbooks/observability.md` con el checklist de revisión (linters, tests, artefactos).
3. Define en este runbook la lista de verificaciones obligatorias para reviewers (ej. “¿Se actualizó ADR?”, “¿Sintéticos pasaron?”).

## T5.4 – ADRs / documentación viva

1. Crea o actualiza ADRs para decisiones críticas que surgieron durante Fase 4 (traza-metrics, canary, backup). Añade `docs/adr/0003-phase5-maintainability.md`.
2. Publica diagramas/resumen en `GPT-51-Codex-Max-Hight/architecture` si alguna decisión modifica la topología (por ejemplo, separación de servicios).
3. Cada sprint documenta qué ADR se actualizó y cuál es la evidencia (`docs/phase-checkpoints.md` y `CheckList.md` referencian el ADR).

## Evidencia mínima para cerrar Fase 5

- `reports/complexity-report.json` mostrando caída en CC.
- `docs/runbooks/fase5-maintainability.md` + ADR confirmando la estrategia.
- Hooks/pre-commit documentados y ejecutados.
- Al menos un módulo refactorizado (evidence en git history) y tests/lint verdes.

Fin del runbook – cuando la evidencia esté recopilada, actualiza `CheckList.md` y `docs/phase-checkpoints.md` para marcar Fase 5 como completada.
