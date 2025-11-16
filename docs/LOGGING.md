# Logging

Este proyecto centraliza el logging en `backend/src/config/logger.ts` para garantizar registros estructurados, trazables y seguros.

## Niveles de log disponibles
- `trace` / `debug`: detalles ricos para desarrollo o análisis post-mortem.
- `info`: eventos esperados (requests, jobs, acciones de usuario).
- `warn`: anomalías que no rompen la app (validaciones fallidas, respuestas 4xx).
- `error`: fallos que requieren atención (5xx, excepciones no controladas).
- `fatal`: errores críticos que detienen la app o requieren reinicio.
Pino respeta `LOG_LEVEL` y no intentará emitir niveles inferiores al configurado.

## Correlation IDs
Cada request Fastify ahora atraviesa el middleware `correlationId`, que reutiliza `X-Request-ID` si viene en el header o genera uno nuevo con `cuid2`. Ese ID se inyecta en `request.log` y se devuelve en la respuesta, lo que permite rastrear una sesión completa entre Fastify, Redis, bases externas y pipelines de observabilidad.

## Redacción automática de PII
La utilidad `backend/src/utils/piiRedactor.ts` detecta emails, teléfonos, SSN, tarjetas de crédito y direcciones en cualquier objeto y los reemplaza con máscaras seguras. El logger utiliza `redactPII` en headers, query params y payloads, y los consumidores pueden reutilizarla (ej. `logSecurityEvent`, `userContext`). Los campos sensibles (`password`, `token`, `secret`, etc.) se censuran completamente con `[REDACTED]`.

## Contextos estructurados
- `userContext(user)` construye `{ userId, email (redacted), role }`.
- `dbContext(query, duration)` agrega `{ query, durationMs, slow, thresholdMs }` para consultas largas.
- `apiContext(endpoint, method, statusCode, durationMs?)` describe llamadas a APIs externas.
Úsalos antes de `logger.info({ context: dbContext(query, duration) }, '...')` para que Elasticsearch o Datadog puedan indexar campos consistentes.

## Rotación y retención
El archivo `backend/src/config/logRotation.ts` crea `logs/app-{date}.log` y `logs/error-{date}.log`. Cada rotación diaria:

- limita el tamaño a 10 MB por archivo.
- comprime automáticamente los archivos rotados (`.gz`).
- conserva 30 días por defecto (`LOG_ROTATION_DAYS`).
- se activa solo si `LOG_FILE_ENABLED=true`.

## Integraciones (Elasticsearch / Datadog)
Los destinos de log están preparados para enviar JSON estructurado a collectors como Filebeat, Fluent Bit o Datadog. Cada entrada incluye:

- `timestamp`, `level`, `msg`.
- `event`, `context`, `correlationId`.
- `user`, `db`, `api` (cuando se enriquece manualmente).

Para Datadog, configura un agente que lea `logs/app-*.log` y `logs/error-*.log` y habilita `ddservice` y `ddsource` en el pipeline de ingestión.

## Sampling y rendimiento
`LOG_SAMPLING_RATE` (0.0–1.0) controla la tasa de logs capturados. Para endpoints de mucho tráfico, basta con bajar ese valor en producción para evitar saturación de disco y red sin perder trazabilidad (por ejemplo `0.3`).

## Consultas lentas
`dbContext` marca `slow: true` cuando la duración supera 1000 ms. Úsalo en conjunto con `performanceLogger` (hook `onRequest`) para detectar requests pesados y exportarlos a Datadog/Elasticsearch rápidamente.

## Variables de entorno relevantes
- `LOG_LEVEL`: nivel mínimo a emitir (`debug` por defecto en dev, `info` en prod).
- `LOG_SAMPLING_RATE`: [0.0,1.0] – fracción de logs retenidos.
- `LOG_FILE_ENABLED`: habilita rotación de archivos (`true` por defecto).
- `LOG_ROTATION_DAYS`: días de retención para archivos rotados.

Ver `backend/.env.example` para los valores recomendados.
