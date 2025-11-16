# Notas breves: Testing y Encoding

- Mock de animaciones (framer-motion): los tests usan un mock global en `vitest.setup.tsx` que expone `AnimatePresence` y `motion.<tag>` (conserva la etiqueta semántica y elimina props de animación). Mantener este mock evita flakiness y problemas de accesibilidad.

- UTF‑8 sin BOM: asegúrate de que los archivos se guarden en UTF‑8 (sin BOM). Si copias texto desde otras fuentes y aparecen caracteres extraños ("�", acentos rotos):
  - Ejecuta `node scripts/strip-bom.cjs` para limpiar BOM/caracteres de reemplazo.
  - Ejecuta `npm run fix-encoding` para reparar mojibake evidente.
  - El hook `.husky/pre-commit` corre estos pasos y bloqueará commits con encoding sospechoso (`tools/check_encoding.cjs`).

- Aserciones robustas: prefiere `getByRole` con `name` o regex (`/…/i`) y normalizadores para evitar falsos negativos por espacios/diacríticos; por ejemplo:

```ts
expect(screen.getByRole('heading', { name: /información personal/i })).toBeInTheDocument();
```

