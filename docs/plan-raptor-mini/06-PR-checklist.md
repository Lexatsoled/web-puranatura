# Fase 5 — Pull Request (PR) Checklist y Rollout

Objetivo:

- Asegurar que todas las correcciones (E2E, encoding, lighthouse, documentación) pasan por revisión, pruebas y CI antes de integrarlas en main.

Checklist mínima para PRs que afectan a E2E o encoding:

1. ✅ Cambios en `scripts/fix-encoding.js` deben incluir `--dry-run` por defecto y documentar casos conocidos donde `force_repair_encoding.cjs` sería recomendado.
2. ✅ Tests Playwright actualizados y estables (`e2e/checkout.spec.ts`, `e2e/helpers/*`) y con `retries` configurados para CI en `playwright.config.ts` si necesario.
3. ✅ Lighthouse CI job configurado y job de `build` y `lhci` en la pipeline de PR.
4. ✅ `dist/` build asegurado, y si corresponde, ejecutar smoke tests contra `dist/` servido con http-server.
5. ✅ Revisiones de encoding: los archivos `.tsx` `.md` y datasets convertidos deben tener revisiones manuales para evitar corrupción accidental.
6. ✅ Artefactos y logs adjuntos: `reports/*`, `test-results/*` y screenshots/videos **deben** estar adjuntos si los tests fallan.
7. ✅ `tmp/e2e-storage/` incluido en `.gitignore` para evitar commits accidentales de `storageState`.
8. ✅ PRs que cambian E2E deben demostrar estabilización: añadir `preseededPage` fixtures o pruebas equivalentes, y capturar `E2E-DIAG` logs y `storageState` en artefactos si son necesarios para reproducir fallos.

Notas:

- Si un PR afecta a `src/` y genera un cambio masivo en `dist/`, revisar que los assets optimizados y `srcset` sean correctos.
- Para cambios de contenido, solicitar al equipo de producto una revisión adicional sobre la integridad del copy y el idioma.

Recomendación adicional (opcional):

- Para tests que afectan al `checkout` y `carrito`, asegurar `seedCartAndSaveStorageState` y `preseededPage` están referenciados en la PR con un paso de reproducción.
