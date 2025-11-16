# Fase 2 — Estabilización y robustez E2E (Playwright)

Objetivo:

- Evitar flakiness en los tests Playwright, especialmente en los flujos críticos (Checkout/Carrito).

Por qué:

- Las pruebas E2E deben ser deterministas y reflejar el comportamiento real del usuario; al mismo tiempo no deben fallar por temporizaciones o condiciones de entorno.

Pasos detallados:

1. Verificar `e2e/helpers/cart-helper.ts`:
   - Confirmar el uso de `page.context().addInitScript` para sembrar el carrito antes de la carga.
   - Añadir fallback `page.evaluate` y pagina probe (newPage probe) — ya se implementó.
2. Mejora del test `e2e/checkout.spec.ts`:
   - Polling robusto para buscar `pureza-naturalis-orders` en `localStorage` (usando `expect().poll()` con timeout mayor que el default) — ya está incluido.
   - Reintentos locales: si el `cartPage.getItemCount()` es 0 se debe re-seed y recargar.
   - Añadir diagnósticos con mensajes `[E2E-DIAG]` para ver `seededCartRaw` y otros estados.
3. Evitar acciones frágiles de UI:
   - Preferir `page.addInitScript` para llenar `localStorage` sobre clicks UI cuando sea posible.
   - Evitar `click()`s en elementos superpuestos cuando sea posible; usar `page.getByRole` con `force` solo si es absolutamente necesario.
4. Aumentar timeouts en casos críticos (solicitudes de redes / confirmación final / LCP):
   - En tests donde la confirmación depende de la escritura en `localStorage` aumentar a `30000` o `60000`.
5. Ejecutar cross-browser y en CI:
   - Ejecutar en Chrome/Firefox/WebKit (Playwright projects) y en CI Linux para estabilidad.
   - Activar reintentos en CI si fallan por flakiness: `npx playwright test --retries=2`.
6. Persistir logs y artefactos en `test-results`:
   - Archivos relevantes: video, screenshot, trace y logs con `E2E-DIAG`.

   ## StorageState preseed strategy (nuevo - recomendado)
   - Para pruebas que dependen de `localStorage` y estado de la app (p. ej. carrito), generar un `storageState` de Playwright pre-seed con `seedCart` y exportarlo:
     1. Ejecutar `seedCartAndSaveStorageState(browserType)` (o `seedCartAndSaveStorageState` helper) localmente para crear `tmp/e2e-storage/<origin>.json`.
     2. Usar `storageState` al crear el `context` en `preseededPage` fixture para garantizar un `context` determinista:
        - `const context = await browser.newContext({ storageState: 'tmp/e2e-storage/http://localhost:3000.json' })`
     3. Reusar `storageState` en CI como artefacto si es reproducible; considera recrearlo en CI con un job de seed si el dataset usado por el backend es diferente.

   - Recomendaciones para `storageState`:
     - No almacenar `storageState` bajo control de versiones salvo para tests reproducibles en demo; en su lugar, anotar el comando que genera el `storageState` en `tmp/e2e-storage/`.
     - Añade `tmp/e2e-storage/` a `.gitignore` para evitar commits accidentales.

   ## `preseededPage` fixture (nueva práctica)
   - Implementar una fixture `preseededPage` en `e2e/test-fixtures.ts` que:
     1. Lanza un contexto con `storageState` generado por `seedCartAndSaveStorageState`.
     2. Retorna `activePage` para tests que dependen del estado ya cargado.
     3. Limpia y exporta el `storageState` si una prueba necesita reproducir el caso en otro job.

   ## Integración en tests existentes
   - Convierte tests frágiles a `preseededPage` donde sea práctico (checkout, addToCart, orders). Usa `CartPage` helpers y rutas re-mockeadas para aislar la validación funcional.

Validación:

- Ejecutar test `e2e/checkout.spec.ts` varias veces y observar la proporción de éxito: meta > 95% en runs locales y 99% en CI.
