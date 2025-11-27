# Scripts recomendados (unificación)

## Front/Back comunes

- `npm run lint`
- `npm run format:check`
- `npm run type-check`
- `npm run build`
- `npm run test:ci` (unit/integration)
- `npm run test:e2e`
- `npm run test:contract`
- `npm run test:coverage`
- `npm run a11y` (axe-playwright)
- `npm run perf:web` (LHCI)
- `npm run perf:api` (k6 smoke)
- `npm run scan:security` (gitleaks + trivy)
- `npm run optimize-images`
- `npm run smoke` (sugerido): flujo rápido login + productos + orden demo + /metrics.
- `npm run test:fuzz` (sugerido): fuzz en payloads críticos con fast-check/zod-fuzz.

## Hooks/Pre-commit sugerido (husky + lint-staged)

- `lint-staged`: `*.{js,ts,tsx,md,json,css,html}` → prettier; luego eslint para ts/tsx; tests selectivos opcional.
- Pre-push: `npm run test:ci` mínimo.

## Scripts backend adicionales (sugeridos)

- `npm --prefix backend run lint`
- `npm --prefix backend run test`
- `npm --prefix backend run migrate:dev` / `migrate:deploy`
- `npm --prefix backend run prisma:studio` (solo dev)
- `npm --prefix backend run seed`

## Automatizaciones útiles (a crear si faltan)

- `scripts/fix-csp.sh`: inserta CSP segura en Express/NGINX.
- `scripts/run-openapi.sh`: genera/valida openapi.yaml y contract tests.
- `scripts/check-bundle.sh`: produce reporte de bundle y budgets.
