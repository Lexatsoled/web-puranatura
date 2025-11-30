# Plan OpenAPI / Contratos

## Alcance

- Documentar: /api/auth (register/login/logout/refresh/me), /api/products (GET list/paginado, GET detail, POST admin), /api/orders (POST, GET user), /api/analytics/events (nuevo), /api/health, /metrics (solo referencia).

## Pasos

1. Generar openapi.yaml 3.1 (puede ser manual + scripts).
2. Añadir schemas zod ↔ OpenAPI (zod-to-openapi opcional).
3. Incluir seguridad: cookies JWT, rate-limit headers, errores estándar `{code,message,traceId}`.
4. Versionar: `info.version` semver; header `X-API-Version` recomendado.
5. Publicar artefacto en CI (artefactos y docs) + attestation opcional.
6. Drift check: comparar implementaciones vs OpenAPI con Prism/Dredd en CI; generar tipos desde OpenAPI y usarlos en cliente/servidor.

## Pruebas de contrato

- Herramienta: Prism/Dredd apuntando al backend local/stage.
- Script sugerido: `npm run test:contract` para validar respuestas vs OpenAPI.
- Casos: 200/400/401/403/404/429 para rutas mutantes; 304 en /products con ETag.
- Rechazar PR si drift >0 (contrato no cumple) o si falta artefacto openapi.

## Ejemplo de snippet

```yaml
paths:
  /api/analytics/events:
    post:
      summary: Ingesta de eventos de analytics
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/AnalyticsEvent'
      responses:
        '202': { description: Aceptado }
        '400': { description: Payload inválido }
        '429': { description: Rate limit excedido }
```
