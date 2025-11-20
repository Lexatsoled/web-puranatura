# Health checks y monitoreo

Este backend expone tres endpoints orientados a orquestadores y plataformas observables para conocer el estado global del sistema:

| Endpoint            | Descripción                                                                                                                           |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `GET /health`       | Probe de **liveness + readiness combinados**. Responde `200` cuando todas las comprobaciones internas pasan, `503` en caso contrario. |
| `GET /health/ready` | Readiness probe que valida sólo dependencias críticas (base de datos y Redis). Devuelve `503` cuando una de ellas no está disponible. |
| `GET /health/live`  | Liveness básica para Kubernetes/Docker. Siempre responde `200` con `status: "alive"` y el uptime actual.                              |

## Formato de respuesta (`/health`, `/health/ready`)

```jsonc
{
  "status": "healthy" | "degraded" | "ready" | "not ready",
  "checks": [
    {
      "name": "database",
      "healthy": true,
      "durationMs": 12,
      "details": { ... }
    },
    ...
  ],
  "timestamp": "2025-11-08T19:00:00.000Z",
  "uptime": 123.45
}
```

Las rutas `/health` y `/health/ready` comparten la misma estructura pero difieren en el criterio de éxito: `/health` requiere que **todos** los checks se completen correctamente para devolver `200`, mientras que `/health/ready` se centra únicamente en las dependencias críticas listadas más abajo.

## Chequeos internos

- **database**: Ejecuta `SELECT 1` contra el pool de SQLite y falla si el timeout excede `5 segundos`.
- **redis**: Hace `PING` al cliente Redis (si está habilitado en la configuración). Timeout de `3 segundos`.
- **filesystem**: Escribe y lee un archivo temporal en `os.tmpdir()` con timeout de `2 segundos`.
- **memory**: Verifica que el uso de heap no supere el `90%` del heap total permitido.

Cada check aporta un objeto con `healthy`, `durationMs`, y `error` cuando algo salió mal. Redis suele marcarse como `healthy` de forma inmediata cuando está deshabilitado para evitar falsos positivos en entornos de prueba.

## Configuración

- `HEALTH_CHECK_ENABLED` (bool, default `true`): permite habilitar/deshabilitar las comprobaciones agrupadas.
- `HEALTH_CHECK_INTERVAL` (ms, default `15000`): frecuencia con la que se realiza un nuevo barrido de checks en segundo plano.

Las constantes de timeout (`5s` para DB, `3s` para Redis y `2s` para filesystem) están documentadas en `backend/src/config/health.ts`.

## Kubernetes / Docker

Ejemplo de probes recomendadas:

```yaml
livenessProbe:
  httpGet:
    path: /health
    port: 3000
  initialDelaySeconds: 30
  periodSeconds: 10
  timeoutSeconds: 5
readinessProbe:
  httpGet:
    path: /health/ready
    port: 3000
  initialDelaySeconds: 5
  periodSeconds: 10
  timeoutSeconds: 3
```

`/health/live` puede exponerse como una verificación más ligera si se quiere mantener un endpoint específico sólo para liveness.

## Monitoreo y alertas

- Promete usar `/health` para alertas de disponibilidad (cuando responde `503` o `degraded`).
- Integrar con Prometheus/Datadog mediante `curl http://localhost:3000/health` y métricas personalizadas enviadas por `pino`.
- Programar alertas en Datadog/Prometheus cuando `status` sea distinto de `healthy` más de `3` veces consecutivas para evitar false positives.

Ver también `docs/COMPRESSION.md` y `docs/CSRF_PROTECTION.md` para comprender la telemetría y seguridad conjunta del backend.
