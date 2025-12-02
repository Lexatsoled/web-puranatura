# Runbook: Backup y Disaster Recovery

Este runbook recoge los pasos mínimos para garantizar que el backend respalda, restaura y valida la integridad de la base de datos antes de cualquier migración (T4.5). Incluye además la integración con los monitores sintéticos que alimentan las alertas del canary (T4.6).

## 1. Backup diario

1. Verifica que la carpeta `backend/backups/` contiene dumps firmados (p. ej. `*.sqlite.gz`). Usa `sha256sum` o `certUtil -hashfile` para comprobar el hash contra el metadata asociado (`backend/backups/*.meta.json` o el log del job). Registra el hash en el inventario del día (`docs/inventory.json` o un `reports/backups` si existe).
2. Comprueba que el script de backup no quedó en ejecución: `ps | grep backup` o revisa `backend/logs/*.log`.
3. Almacena la copia tanto en almacenamiento seguro (S3/GCS cifrado) como en el backup local; sincroniza con `aws s3 sync backend/backups s3://<bucket>/backups --delete` (o el equivalente de tu proveedor) y documenta el `etag`.
4. Si necesitas una validación adicional, descomprime el archivo en un workspace temporal y ejecuta `sqlite3 backend/backups/latest.sqlite 'PRAGMA integrity_check;'` (o la variante de Postgres/MySQL) para asegurar integridad.

## 2. Restore y prueba

1. Declara el incidente y congela escrituras. Usa `BACKEND_ENV_PATH` para ejecutar el backend apuntando al backup restaurado (por ejemplo, `BACKEND_ENV_PATH=./backend/.env.local node dist/server.js` apuntando a la copia restaurada).
2. Ejecuta `npm run seed -- --force` si el backup es un snapshot parcial para reponer usuarios mínimos (`smoke@puranatura.test`).
3. Corre las comprobaciones críticas: `npm run test:ci`, `npm run test:contract` y `npm run synthetic:checks` para validar login/catálogo/checkout sobre la copia restaurada.
4. Si todo funciona, actualiza DNS/ingress para apuntar a la nueva instancia y registra el tiempo de RTO (objetivo < 2 h).

## 3. DR drill (trimestral)

1. Levanta infraestructura alternativa mediante IaC (Terraform/ARM). Aplica `BACKUP_ENV` al entorno de staging y restaura el backup más reciente.
2. Restaura el backup en un host aislado (puede ser `backend/tmp/db-restore.sqlite`) y valida `PRAGMA integrity_check`.
3. Ejecuciones rápidas: `npm run test:ci`, `npm run test:contract`, `npm run synthetic:checks`.
4. Mide RTO y documenta en el ticket del drill; registra si se cumplió el objetivo de 2h y si la integridad fue del 100%.

## 4. Sintéticos y alertas (T4.6)

1. Ejecuta `npm run synthetic:checks` para disparar el monitoreo login → catálogo → checkout. El script arranca el backend en `PORT=4004`, usa el usuario `smoke@puranatura.test` y genera `reports/synthetic/synthetic-report.json`.
2. Utiliza ese JSON como referencia para las alertas: toma los valores `durationMs` de `catalog`, `orders-list` y `checkout` y vincúlalos con las métricas de Grafana (`http_request_duration_seconds_summary` para p95/p99). Un aumento sostenido superior a 0.3 s o un `http_request_error_rate_percentage > 1` debe disparar un alerta de canary.
3. Registra los logs en `reports/observability/observability-artifacts.zip` junto con los dumps `trace-sample.md` y `metrics-snapshot.txt` para que los SRE puedan adjuntar la traza y las métricas al ticket de rollback.
4. Para cada release o incidente documentado empaca `reports/synthetic/synthetic-report.json`, `reports/observability/observability-artifacts.zip` y `sbom.json` en el backlog asociado (ticket/PR) para tener la traza, los percentiles y la cadena de suministro listos antes de cerrar el despliegue.
5. Después de cada canary (T4.4), vuelve a correr los sintéticos y compara los resultados con el último `reports/synthetic/synthetic-report.json`; si las latencias p95/p99 suben > 25 % o el error rate se dispara, revertir el rollout incrementando `config/flags.json` con `scripts/update-flag.cjs --flag flag.analyticsIngest --rollout <valor>` (habitualmente al último paso exitoso).

Fin del runbook – documenta cada ejecución en el backlog (ticket/PR) y adjunta `reports/synthetic/synthetic-report.json`, las métricas en `reports/observability/dashboard-summary.md` y cualquier nota sobre el backup restaurado.
