# Resiliencia y Caos

## Circuit Breaker y Retry
- Cliente `useApi`: retry exponencial con jitter para 429/5xx transitivos; límite 3 intentos; timeout por request.
- Cliente IA (Gemini): timeout 10s, retry máx 1 con jitter; abrir breaker si error_rate>20% o timeout sostenido.
- Backend externo: usar AbortController y timeouts; no colgar request.

## Fallbacks
- Catálogo: si API falla, usar fallback lazy (data/products) sanitizado; marcar en UI que es provisional.
- Analytics: si falla ingest, almacenar en cola in-memory (bounded) o descartar con métrica.
- Auth: si refresh falla, logout forzado y notificación.

## Caos / Fault Injection (stage)
- Inyectar latencia/errores en /api/products y /api/orders para validar retry/circuit breaker.
- Simular caída de DB (read-only) para validar mensajes y degradación controlada.
- Simular timeouts de IA.

## Métricas de resiliencia
- breaker_open_count, retries_total, fallback_used_total.
- Error budget burn-rate para error_rate y P95.

## Procedimientos
- Activar caos sólo en stage.
- Monitorear alertas y revertir inyección si supera budget.
- Documentar hallazgos y ajustes de umbrales.
