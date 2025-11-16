# Fase 1 — Reparación y normalización de encoding (mojibake)

Objetivo:

- Corregir las cadenas con mojibake (caracteres rotos como `ñ`, `ó`) de manera conservadora y con control humano.

Por qué:

- Los cambios automáticos en texto pueden alterar contenido signficativo (p. ej. nombres de productos, reivindicaciones legales o textos con tildes).

Pasos detallados:

1. Asegúrate de tener un checkpoint (Fase 0 completada).
2. Revisar el script `scripts/fix-encoding.js` y su `.bak` y comprobar que implementa:
   - heurística de `latin1 -> utf8` con doble pasada.
   - no reescribe binarios ni imágenes.
   - revisa config de extensiones (`exts`) a procesar.
3. Hacer dry-run del script con logging y sin reescribir (modificar temporalmente el script para mostrar cambios sugeridos y contar instancias):
   ```powershell
   node scripts/fix-encoding.js --dry-run
   ```
   (si el script no soporta `--dry-run`, crear una copia `scripts/fix-encoding.dry.js` y comentar la `fs.writeFileSync` para que no escriba)
4. Revisar diffs (selectivo):
   ```powershell
   git diff --name-only | Out-String -Width 200
   git diff -- path/to/file1 path/to/file2 # revisar mano a mano
   ```
5. Validar los strings críticos (ej.: `ProductPage`, `Checkout`, `ContactPage`) manualmente y re-hacer reemplazos si se detectan errores (manualmente).
6. Aplicar cambios definitivos: ejecutar `node scripts/fix-encoding.js` sin `--dry-run` y revisar nuevamente `git diff` .

Recomendaciones de seguridad y rollback:

- Mantener `.bak` para todos los archivos cambiados y no borrar hasta confirmar build y pruebas.
- Si algo falla, revertir archivo(s) afectados con `git checkout -- path/to/file`.

Validaciones recomendadas tras aplicar encoding fixes:

- Ejecutar `npm run lint:ci` para validar que no hay `no-empty`, `no-unused-vars` ni errores de tipado que puedan bloquear el PR.
- Ejecutar `npm test` y `npm run build` para verificar que la aplicación compila.
- Ejecutar subset E2E (checkout/addToCart) para validar que el flujo principal no se rompió como consecuencia de cambios en cadenas:

  ```powershell
  npx playwright test e2e/checkout.spec.ts e2e/addToCart.spec.ts --project=chromium --trace on-first-retry
  ```

Validación post-change:

- `npm run build` — asegurarse que `dist/` genera sin errores.
- `npm test` — pasar unit tests.
- Playwright `e2e/checkout.spec.ts` — pasar o estabilizar con reintentos (Fase 2).
