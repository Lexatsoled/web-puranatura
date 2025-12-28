# Runbook: Rollback de Deploy
1) Detectar fallo (alerta error_rate/P95/LHCI/seguridad).
2) Pausar tráfico nuevo (si aplica) y activar flag de kill-switch para la funcionalidad afectada.
3) Revertir a versión estable:
   - Code: `git checkout <tag-estable>` o revert en pipeline.
   - Infra: revertir release canary/blue-green a versión anterior.
4) Base de datos:
   - Si hubo migración: ejecutar `prisma migrate resolve --rolled-back` y restaurar backup previo.
5) Validar smoke: /api/health, login, lista productos, crear orden demo (sandbox).
6) Monitorear 30 min; si estable, reabrir despliegue planificado.
7) Documentar causa y follow-ups.
