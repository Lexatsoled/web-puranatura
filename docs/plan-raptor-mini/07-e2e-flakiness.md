# Fase 6 — Estabilización de E2E y resolución de flakiness

Objetivo:

- Reducir la tasa de falsos fallos en los tests Playwright, especialmente en WebKit / Mobile Safari, implementando reintentos controlados, verificaciones explícitas y mejores prácticas de seed/teardown.

Acciones recomendadas:

1. Aumentar `retries` y `timeout` para los proyectos móviles en `playwright.config.ts`. Ya hemos añadido `retries: 3` para WebKit y Mobile Safari en CI y aumentado `timeout` a 180s global.

2. Mejorar las semillas (seed) para escritura en `localStorage`:
   - Usar `context.addInitScript` para garantizar la persistencia del estado mientras la app arranca.
   - Crear una `probe` page en el mismo origen y verificar `localStorage` con algunos `retries` y backoff. Si no existe, intentar escribirlo desde el probe y re-evaluar.

3. En las pruebas, comprobar explícitamente que el item existe después de `goto` y si no, re-seed varias veces con `cartPage.goto({ expectItems: true })` y esperas incrementales.

4. Usar `expect.poll(...)` para confirmar que la orden aparece en `localStorage` (ya implementado en los tests), con mayor `timeout` para los entornos más lentos.

5. Captura y adjunta artefactos:
   - Trazas, screenshots y vídeo en fallos.
   - Scripts `smoke-tests.sh` y `run-lighthouse` en CI para validar artefactos.

6. Debugging tips:
   - Si la semilla no persiste, intentar `context.addInitScript` y luego abrir una `probe` página para confirmar; si falla, revisar CSP/Cookies/Third-party blockers que puedan bloquear writes.
   - Reproducir fallos en GitHub Actions con 'runs-on: ubuntu-latest' y habilitar `debug: true` para la infraestructura.

7. Considera ejecutar suites críticas (checkout) en un job separado con retries y parallelism controlado, y marcar pruebas no-criticas como `test.skip` o `test.fixme` hasta que se estabilicen.

## StorageState y `preseededPage` (estrategia recomendada)

- Para casos donde el backend no provea datos consistentes, usar una estrategia `storageState` para crear contexts preseeded. Esto reduce el uso de UI clicks y el flake asociado a escrituras asíncronas de `localStorage`.

- Herramientas y helpers:
  - `seedCartAndSaveStorageState(browserType)` — helper que crea un estado de `localStorage` con el carrito pre-cargado.
  - `seedCartAndCreatePreseededPage` — helper que crea un contexto y page con `storageState` pre-cargado.

- Estrategia CI:
  1.  Añadir una job `seed-playwright` en el pipeline que genera `storageState` para `dist/` y lo publica como artefacto.
  2.  Job de testing crea contextos usando el `storageState` artifact para replicar el estado exacto.
  3.  No conviertas el `storageState` en commit; marcar `tmp/e2e-storage/` en `.gitignore`.

## Diagnósticos y artefactos

- Anexar `trace`, `video`, `screenshot` y logs con `E2E-DIAG` cuando la prueba falla. Esto permite inspeccionar el `seededCartRaw` y determinar si la semilla no fue escrita o si hubo un conflicto de origen/CSP.
- En los fallos, priorizar: (1) confirmar `storageState` escrito, (2) confirmar el origen del contexto (dominio correcto), (3) validar si policies CSP/Cookie impiden escritura.

## Pasos de migración de tests frágiles

1. Identificar tests que fallan recurrentemente (search/filter, performance, security, etc.).
2. Para los tests dependientes de datos, convertirlos a `preseededPage` o implementar endpoint de seed backend.
3. Añadir `expect.poll` donde el test espera a que `localStorage` cambie, y usar `toHaveCount` para elementos visibles, con un `timeout` aumentado para entornos lentos.
