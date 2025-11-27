# Runbook: Backup y Disaster Recovery
## Backup
- Frecuencia: diaria (RPO 24h); retención 30-90 días.
- Procedimiento: `pg_dump`/`sqlite-backup` a almacenamiento cifrado; registrar hash y tamaño.
- Verificación: restaurar muestra semanal en entorno aislado; validar counts y checksums.

## Restore
1) Declarar incidente de datos; congelar escrituras.
2) Seleccionar backup más reciente válido (hash verificado).
3) Restaurar en entorno temporal; correr integridad (counts, constraints).
4) Redirigir app a DB restaurada (o promover a prod si es seguro).
5) Validar con smoke (auth, productos, órdenes) y métricas.
6) Comunicar finalización; registrar tiempos (RTO objetivo ≤2h).

## DR (desastre mayor)
- Objetivo: RPO 24h, RTO 2h.
- Pasos: levantar infra alternativa (IaC), restaurar backup, actualizar DNS/ingress, smoke, monitoreo.

## Drills
- Frecuencia: trimestral.
- Pasos: restaurar backup en entorno aislado, correr suite smoke + contract, validar integridad (counts/hash), medir RTO.
- Criterio de éxito: RTO ≤2h, integridad 100%, sin PII expuesta.
