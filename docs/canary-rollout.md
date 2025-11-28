# Automatización del rollout canary

Este documento describe el flujo de despliegue canary propuesto para Fase 4 y cómo automatizarlo usando los scripts disponibles.

## Objetivo

- Subir una funcionalidad crítica (ej. `flag.analyticsIngest`) de manera progresiva: 5% → 25% → 50% → 100%.
- Monitorear métricas de observabilidad (error_rate, p95, queue duration) antes de avanzar y habilitar rollback si hay degradaciones.

## Scripts disponibles

- `scripts/update-flag.cjs --flag <flag> --rollout <0-100> [--enabled true|false]`: actualiza `config/flags.json`.
- `scripts/rollout-canary.cjs`: ejecuta `update-flag` para `flag.analyticsIngest` con pasos 5,25,50,100 (variable `CANARY_FLAG` para cambiar el flag objetivo).

## Uso sugerido en pipeline

1. Preparar la rama/canary con la versión candidata.
2. Ejecutar `npm run rollout:canary` (o `node scripts/update-flag.cjs ...`) en entorno de staging/QA tras validar tests.
3. Esperar 10–15 minutos entre pasos para recoger métricas y logs, usar `reports/observability/metrics-snapshot.txt` y dashboards para validar.
4. Si se detecta degradación, ejecutar el runbook `GPT-51-Codex-Max-Hight/runbooks/rollback.md` y revertir el flag/versión.
5. Una vez el rollout llega a 100% y los dashboards están verdes, promover el release a producción y dejar documentado el resultado.

## Integración continua

Agregar un paso en `.github/workflows/ci.yml` o en el pipeline de despliegue que invoque `npm run rollout:canary` tras la fase QA y antes del promote; los artefactos de observabilidad sirven como verificación.

## Documentación viva

Actualizar `docs/phase-checkpoints.md` para reflejar el estado del rollout y la evidencia de rollback. Guardar instrucciones de QA/alertas en `reports/observability/` y registrar cada canary step.
