# Playbook: Contrato OpenAPI en CI

Objetivo: evitar drift entre frontend y backend asegurando que el contrato OpenAPI se valida en cada PR sin depender de SaaS.

## Alcance

- Archivos: `api/openapi.yaml` (y copia en `GPT-51-Codex-Max/api/openapi.yaml`).
- Validaciones: lint (spectral), mock/contract tests (prism), generación opcional de clientes/mocks.

## Pasos recomendados

1. **Lint del contrato**
   - Comando: `npm run lint:openapi` (usa spectral).
   - Falla si hay errores de severidad `error`.
2. **Tests de contrato (mock)**
   - Comando existente: `npm run test:contract` (usa prism/mock runner).
   - Verifica que las respuestas cumplen el spec.
3. **Drift check (opcional)**
   - Comparar `api/openapi.yaml` con `GPT-51-Codex-Max/api/openapi.yaml` para detectar divergencias:
     - Script sugerido: `scripts/check-openapi-drift.cjs` que haga diff semántico y falle si hay cambios sin sincronizar.
4. **Generación de clientes/mocks (opcional)**
   - Solo si se requiere: usar `@openapitools/openapi-generator-cli` para stub de cliente o MSW mocks; no necesario en esta fase.

## Integración en CI

- Pipeline sugerido (fase 4):
  1. `npm run type-check`
  2. `npm run lint`
  3. `npm run test`
  4. `npm run lint:openapi`
  5. `npm run test:contract`
  6. Seguridad/auditoría (gitleaks/trivy) si aplica al cambio
- Gate: bloquear PR si lint o contract fallan.

## Notas de mantenimiento

- Si se modifica una ruta en backend, actualizar el spec y los tests de contrato en el mismo PR.
- Mantener examples actualizados para que prism responda con payload realista.
- Versionar el spec con un `info.version` y `servers` que reflejen los entornos (dev/staging).

## Rollback

- Si el gate rompe por falsos positivos del mock, permitir `--allow-fail` temporal documentado en el PR, pero corregir el spec en la siguiente iteración.
