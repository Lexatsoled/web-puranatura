# Scripts y Automatización (a implementar/verificar)

## Seguridad
- `scripts/run-gitleaks.cjs`: escaneo de secretos (usar en pre-commit y CI).
- `scripts/run-trivy.cjs`: trivy fs para vulnerabilidades.

## Calidad
- `scripts/run-ci-smoke.ps1`: lint + type + test subset para PR rápidos.
- `scripts/run-openapi.sh` (sugerido): valida/genera openapi.yaml y ejecuta contract tests.

## Rendimiento
- `scripts/run-k6.cjs`: ejecuta smoke/stress; export JSON a reports/.
- `scripts/run-lhci.sh` (sugerido): corre LHCI desktop/mobile con budgets.

## A11y
- `scripts/axe-playwright.cjs`: barrido de páginas clave.

## Imágenes
- `scripts/optimizeImages.ts`: optimiza assets en build (usar en pipeline).

## Cómo integrarlos
- Añadir a package.json scripts si faltan, referenciando estos comandos.
- Incluir en husky (pre-commit: lint-staged; pre-push: test:ci opcional).
