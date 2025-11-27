# Runbook: Respuesta a Incidentes
1) Declarar incidente: severidad (SEV1/2/3), hora, responsables.
2) Congelar despliegues; activar canal de guerra.
3) Recolectar: métricas /metrics, logs con traceId, LHCI/k6 si perf, estado de DB.
4) Mitigar:
   - Seguridad: revocar tokens, rotar claves, bloquear endpoints via flag.
   - Disponibilidad: activar canary rollback o blue/green revert.
   - Datos: cambiar a modo read-only si hay riesgo de corrupción.
5) Comunicar: ETA, alcance, clientes impactados.
6) Resolver: parche, validación (smoke + e2e crítico), monitoreo 30-60 min.
7) Postmortem en 48h: causa raíz, acciones correctivas, follow-ups con due date.
