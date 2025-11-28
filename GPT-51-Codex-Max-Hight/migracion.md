# Guía de Migración y Rollback

## Principios

- Compatibilidad backward/forward; versión semver; feature flags para cambios de contrato.
- Backup antes de migrar; plan de rollback probado.

## Pasos generales

1. Generar/validar OpenAPI actual (baseline).
2. Crear migración Prisma (db push en dev, migrate deploy en stage/prod).
3. Backup DB cifrado (RPO 24h, preferible inmediato pre-migración).
4. Deploy en stage → correr contract, e2e, k6, LHCI.
5. Canary en prod (5%-25%-50%-100%); monitorear métricas/alertas.
6. Completar rollout; marcar deprecation window si cambia contrato.

## Rollback

- DB: restaurar backup + revert migración (`migrate resolve --rolled-back`).
- App: revert release/tag; desactivar feature flags.
- Datos: si hay scripts de data-migration, incluir script de revert cuando sea posible.

## Deprecation policy

- Anunciar endpoints a deprecar; mantener compat 1 release; ofrecer headers `X-API-Version`.
- Añadir pruebas para rutas antiguas hasta su retiro.

## Casos específicos

- Cambio de SQLite a Postgres: dual-run en stage; migrar con `prisma migrate deploy` + script copy; validar integridad (counts/hash).
- Endpoint nuevo (analytics): deploy en report-only (no-op) + flag; luego persistencia.
