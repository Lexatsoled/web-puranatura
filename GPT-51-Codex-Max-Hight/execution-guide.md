# Guía de Ejecución Paso a Paso

1. **Preparar entorno**
   - Instalar deps: `npm ci` (root) y `npm --prefix backend ci`.
   - Exportar variables .env (no incluidas) tomando `.env.example`.
   - Confirmar `npm run lint`, `npm run type-check` pasan.

2. **Aplicar Fase 0**
   - Borrar secretos/DB del repo; rotar claves; reforzar .gitignore.
   - Activar CSP report-only y recopilar reportes.
   - Ejecutar `npm run scan:security`.

3. **Fase 1**
   - Ajustar helmet/CSP, CORS, rate-limit, cookies; validar en dev.
   - Añadir zod en rutas faltantes; sanitizer en cliente.
   - Ejecutar SAST/DAST: `npm run scan:security` + zap-baseline (manual).

4. **Fase 2**
   - Generar/actualizar OpenAPI; implementar /api/analytics/events.
   - Migraciones Prisma + seeds; backup previo en stage.
   - Contratos: `npm run test:contract`; `npm run test:e2e`.

5. **Fase 3**
   - Lazy catálogo y modales; optimizar imágenes; a11y en modales y formularios.
   - `npm run build -- --report`, `npm run perf:web`, `npm run a11y`.

6. **Fase 4**
   - Integrar pino + OpenTelemetry; ampliar métricas; dashboards/alertas.
   - Pipeline CI/CD con canary y artefactos (SBOM, LHCI, k6).

7. **Fase 5**
   - Refactors SOLID/Clean; reducción de complejidad; pre-commit obligatorio.
   - ADRs para decisiones; checklist de code review en uso.

8. **Deploy**
   - Stage: contract + e2e + perf smoke + a11y.
   - Prod: canary 5%-25%-50%-100%; smoke y monitoreo; rollback runbook listo.
