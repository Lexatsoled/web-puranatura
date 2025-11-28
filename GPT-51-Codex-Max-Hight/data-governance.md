# Gobierno de Datos

## Contratos

- OpenAPI como fuente de verdad para requests/responses; versionado semver.
- Schemas Zod alineados con OpenAPI (generar tipos).
- ETag + Cache-Control en catálogos; trazabilidad con traceId.

## Calidad y consistencia

- Seeds idempotentes y sin PII en stage/dev.
- Validar integridad tras migraciones (counts, checksums).
- Campos obligatorios: email normalizado, slug único, stock >=0.
- Clasificación de datos: P0 (credenciales/tokens), P1 (datos de usuario), P2 (catálogo público). P0/P1 nunca en logs; P0 en vault.

## Backup y retención

- Backups diarios cifrados (RPO 24h); retención 30-90 días.
- Restore probado trimestral (RTO 2h); documentar en runbook.
- Retención por tipo: logs (30-90 días sin PII), métricas (90-180 días agregadas), backups DB (30-90 días).

## Seguridad de datos

- DB y backups fuera del repo; acceso mínimo.
- Sanitización de logs (sin PII); observabilidad sin payloads sensibles.
- Políticas de eliminación: borrar PII si se solicita (si aplica).

## SBOM y dependencias

- Generar SBOM (CycloneDX) por release; revisar licencias.
- `npm audit --production --audit-level=high`; dependabot/renovate opcional.
- Política de licencias: allowlist definida; bloquear PR con licencias no permitidas.
- Allowlist actual: `MIT`, `Apache-2.0`, `0BSD`, `BSD`, `BSD-2-Clause`, `BSD-3-Clause`, `BlueOak-1.0.0`, `CC-BY-4.0`, `CC0-1.0`, `ISC`, `MIT-0`, `Python-2.0`, `Unlicense` y `W3C-20150513`. `sbom.json` se regenera con CycloneDX y `npm run check:licenses` valida que ningún componente incluye una licencia fuera de esta lista.
