# Politica de Logging

## Principios

1. Nunca loggear PII sin redaccion previa.
2. Usar niveles apropiados (`error` > `warn` > `info` > `debug`).
3. Rotar logs automaticamente para evitar crecimiento infinito.
4. Emitir logs estructurados en formato JSON.
5. Reportar errores criticos a Sentry cuando haya DSN configurado.

## Que no loggear

- Passwords o hashes.
- Tokens de sesion completos.
- Numeros de tarjeta de credito o CVV.
- SSN, DNI, pasaportes.
- Direcciones completas o telefonos sin mascara.
- Emails sin redaccion.

## Que si loggear

- IDs de usuario y pedidos.
- Emails parciales (`us***@example.com`).
- IPs parcializadas (`192.168.***.***`).
- Timestamps, duraciones, codigos de error.
- Eventos de seguridad o auditoria.

## Niveles

- **ERROR (50):** interrupciones criticas (database caida, pagos fallidos).
- **WARN (40):** condiciones inesperadas (rate limit, intentos fallidos).
- **INFO (30):** eventos de negocio normales (login exitoso, orden creada).
- **DEBUG (20):** diagnostico detallado (consultas, cache hit/miss).

## Redaccion

```ts
logger.info({ email: 'us***@example.com' });
logger.info({ phone: '***1234' });
logger.info({ ip: '192.168.***.***' });
```

Campos sensibles definidos en `SENSITIVE_FIELDS` se reemplazan automaticamente por `[REDACTED]`.

## Rotacion

- Logs se rotan diariamente.
- Archivos comprimidos (`.gz`) tras rotacion.
- Retencion maxima: 30 dias.
- `logs:clean` elimina archivos antiguos comprimidos.

## Monitoreo

- `logCriticalError` envia excepciones a Sentry si `SENTRY_DSN` esta presente.
- `scripts/analyze-logs.js` genera estadisticas (errores, warns, endpoints).
- `logs:view` y `logs:errors` permiten seguir el stream local en tiempo real.

## Ejemplos de uso

```ts
logAuthAttempt('user@example.com', true, req.ip);
logOrderCreated(order.id, req.user?.userId ?? 'anon', order.total);
logCriticalError(err, { userId: req.user?.userId });
logSecurityEvent('brute_force_detected', { ip: req.ip });
```

## Checklist antes de merge

- [ ] No queda PII sin redactar en cambios nuevos.
- [ ] Los logs usan `logger`, `log*` helpers o `logRequest`.
- [ ] Los hooks de Fastify siguen activos (`onResponse`, `onError`, middleware de performance).
- [ ] Documentacion y scripts actualizados.
