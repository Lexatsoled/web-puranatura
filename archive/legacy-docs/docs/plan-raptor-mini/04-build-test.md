# Fase 3 — Build, unit tests y smoke tests

Objetivo:

- Verificar que la build del proyecto y los tests unitarios y smoke pasen luego de los cambios.

Pasos:

1. Instalar dependencias de forma determinista:
   ```powershell
   npm ci
   ```
2. Ejecutar build:
   ```powershell
   npm run build
   ```
3. Ejecutar tests unitarios (Vitest / Jest):
   ```powershell
   npm test
   ```
4. Ejecutar smoke tests (scripts de `scripts/smoke.ps1` o `scripts/smoke-tests.sh`):
   ```powershell
   node scripts/smoke-tests.sh
   ```
5. Ejecutar subset de E2E: Checkout y Cart:
   ```powershell
   npx playwright test e2e/checkout.spec.ts --grep "Checkout Flow" --retries=1 --workers=2
   npx playwright test e2e/addToCart.spec.ts --retries=1 --workers=2
   ```

Validación:

- Build sin errores y `dist/` generado.
- Tests unitarios pasan (0 fails).
- Smoke tests y subset E2E pasan o son estables (pocos reintentos).
