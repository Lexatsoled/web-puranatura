# GPT-51-Codex-Max-Hight

Plan maestro enterprise-grade para depurar, fortalecer y escalar la plataforma PuraNatura. Consolida las mejores prácticas de **GPT-51-Codex** y **GPT-51-Codex-Max** y las amplía con guías accionables para que cualquier persona (junior, senior o IA) ejecute las mejoras sin ambigüedad.

## Estructura

- `plan-maestro.md`: roadmap fase a fase con gates, owners y métricas.
- `arquitectura.md`: vistas de sistema, datos, secuencia y decisiones.
- `testing-strategy.md`: matriz de pruebas 100% cobertura objetivo.
- `security-playbook.md` / `security-threat-model.md`: defensa en profundidad y modelo de amenazas.
- `performance-playbook.md`: presupuestos y recetas de optimización.
- `refactor-roadmap.md`: guía SOLID/Clean + patrones y límites de módulos.
- `observabilidad.md`: métricas, trazas, logs, dashboards y alertas.
- `ci-cd.md`: pipeline completo build → test → sec → perf → deploy.
- `entornos.md`: paridad dev/stage/pre/prod con IaC.
- `migracion.md`: upgrades con compatibilidad backward/forward y rollback.
- `data-governance.md`: contratos, datos, backup/DR, retención.
- `feature-flags.md`: estrategias de rollout seguro (FF, canary, blue/green).
- `package-scripts.md`: comandos unificados y verificaciones locales.
- `raci.md` y `calendar.md`: owners y agenda semanal.
- `slo-sla.md` y `quality-metrics.md`: objetivos medibles (SLO/SLA, CC, MI).
- `resilience.md`: circuit breakers, retries, caos y fallback.
- `smoke-suite.md`: batería rápida post-deploy.
- `checklists/`: revisiones de código, seguridad, pre-commit, a11y, perf, rollout.
- `runbooks/`: respuesta a incidentes, DR, rollback, hotfix perf, oncall.
- `api/`: guía OpenAPI, contratos y tests de contrato.
- `perf/`: planes k6 y Lighthouse CI.
- `infra/`: blueprint IaC, matriz de configuraciones y gestión de secretos.
- `scripts/`: recetas para automatizar lint, fix, scan y verificación.

## Credenciales de smoke (solo dev/stage)

- Usuario: `smoke@puranatura.test`
- Password: `SmokeP@ss123`
- Uso: exporta `SMOKE_USER` y `SMOKE_PASS` antes de `npm run smoke` para probar login/orden demo.

## Cómo usar

1. Lee `plan-maestro.md` para secuencia, gates y métricas.
2. Sigue los checklists antes de abrir PR; ejecuta los scripts indicados.
3. Usa `testing-strategy.md` para diseñar/actualizar pruebas con cobertura total.
4. Consulta los runbooks ante incidentes, regresiones o restores.
5. Mantén los artefactos OpenAPI, migraciones y monitoreo sincronizados en cada cambio.
