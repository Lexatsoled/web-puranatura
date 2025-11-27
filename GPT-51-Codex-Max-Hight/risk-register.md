# Risk Register

| ID  | Riesgo                          | Prob | Impacto | Mitigación                                                                       | Trigger/Seguimiento                    |
| --- | ------------------------------- | ---- | ------- | -------------------------------------------------------------------------------- | -------------------------------------- |
| R1  | CSP rompe terceros (GA/FB/Maps) | M    | H       | Activar report-only, listar dominios, canary UI, monitorear errores consola/LHCI | Error rate de recursos bloqueados >1%  |
| R2  | Secretos/SQLite filtrados       | H    | H       | Eliminar artefactos, rotar claves, gitleaks en CI/pre-commit                     | gitleaks finding, .env en repo         |
| R3  | Migraciones rompen prod         | M    | H       | Backup previo, migrate en stage, contract + e2e antes de prod, rollback plan     | Errores en migrate deploy, smoke falla |
| R4  | Bundle > budget degrada LCP     | M    | M       | Lazy catálogo/modales, optimizar imágenes, perf budgets en CI                    | LHCI LCP >3s o bundle >600kB           |
| R5  | Endpoint AI abusado             | L    | M       | Rate-limit, timeout 10s, validar prompt, flag `aiEnabled`                        | 429/5xx spikes o costos IA altos       |
| R6  | Analytics 404/pérdida datos     | M    | M       | Implementar /analytics/events con zod + rate-limit; flag; tests contrato         | 404 en logs, dashboards vacíos         |
| R7  | A11y incumplida                 | M    | M       | Checklist a11y, axe-playwright en CI, focus trap modales                         | Violaciones “serious” en axe           |
| R8  | Observabilidad insuficiente     | M    | M       | OpenTelemetry + prom-client p95/p99 + dashboards + alertas burn-rate             | Falta traceId o sin métricas en rutas  |
