# ISSUE T5.1-001 – Validar y documentar los tests iniciales de `useAnalytics`

## Contexto

- `useAnalytics` concentra la lógica de consentimiento, cola de eventos y envío a GA/FB + backend, es el archivo más complejo según `reports/complexity-report.json`.
- Fase 5 prioriza reducir la complejidad y demostrar que los hooks críticos están cubiertos por tests (plan maestro T5.1/T5.2).
- QA/SRE necesita un ticket claro con pasos y criterios para cerrar el gate T5.1 antes de atacar otros refactors.

## Pasos propuestos

1. Asegurar que el entorno de pruebas expone las variables `VITE_ENABLE_ANALYTICS`, `VITE_GA_ID` y `VITE_FB_PIXEL_ID` (lo hicimos en `vitest.setup.ts` para evitar tests frágiles).
2. Crear el hook test `test/hooks/useAnalytics.test.ts` que:
   - Valida que `setConsent` guarda la preferencia en `localStorage` y actualiza el estado del hook.
   - Confirma que `trackEvent` llama a `logEventToProviders`, `logEventToBackend` y `getSessionId` cuando hay consentimiento.
   - Verifica que el `trackPageView` inicial dispara el evento de categoría `page_view` con `page_title`, `page_location` y `page_referrer` correctos.
3. Ejecutar `npm run test:ci` y revisar el resultado para certificar que los tests del hook pasan en la suite completa.
4. Documentar la evidencia (capture de `npm run test:ci`, mención en `docs/phase-checkpoints.md` y en este ticket) y comunicar a QA/SRE que el nuevo artefacto está listo para revisión.

## Criterios de cierre

- `test/hooks/useAnalytics.test.ts` está versionado y cubre los tres escenarios clave descritos arriba.
- `vitest.setup.ts` garantiza que el flag de analytics está habilitado sin interferir con otros tests.
- `npm run test:ci` (y por extensión cualquier corrida de `vitest`) pasa y se puede rerun en CI sin fallos.
- El ticket referenciado en `docs/phase-checkpoints.md` y esta descripción proveen la traza para QA/SRE.

## Notas para QA/SRE

- Antes de validar, pueden wipear `localStorage` y ejecutar `node --test test/hooks/useAnalytics.test.ts` o directamente `npm run test:ci`.
- El mock de `fetch` y los spies en `analyticsProviders` evitan llamadas reales a GA/FB, así que bastan las verificaciones unitarias.
- Si se añaden nuevos proveedores o se cambia la forma de consentir, hay que extender este test o añadir nuevos escenarios siguiendo la misma receta.
