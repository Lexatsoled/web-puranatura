# Feature Flags y Estrategias de Rollout

## Tipos

- Booleanas: activar/desactivar funcionalidad (ej. analytics endpoint, CSP enforce).
- Graduales: porcentaje de tráfico (canary) o por usuario (cohort/email).
- Entorno: habilitar solo en dev/stage.

## Implementación sugerida

- Cliente: wrapper simple que lea de `/config/flags.json` o env; fallback por defecto seguro.
- Servidor: middleware que consulte bandera (env/remote) y anote en logs/trace.
- No incrustar flags en build si deben ser mutables en runtime (cargar desde config remota).

## Rollout seguro

- Paso 1: behind-flag en dev/stage.
- Paso 2: canary 5%-25%-50%-100% monitoreando error_rate y P95.
- Paso 3: remover flag o migrar a “kill switch” si es crítico.

## Uso propuesto

- `flag.cspEnforce`: activar CSP enforce cuando los terceros estén listados.
- `flag.analyticsIngest`: activar nuevo endpoint /api/analytics/events.
- `flag.lazyLegacyCatalog`: habilitar lazy import del catálogo.
- `flag.aiEnabled`: cortar /api/ai si falla proveedor.
