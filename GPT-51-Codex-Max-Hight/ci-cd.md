# CI/CD Pipeline (enterprise)

## Stages propuestos (GitHub Actions)
1) **Checkout + Setup**: node 20, cache npm.
2) **Lint/Type**: `npm run lint`, `npm run type-check`, `npm run format:check`.
3) **Unit/Integration**: `npm run test:ci` (vitest).
4) **Contract**: `npm run test:contract` (Prism/Dredd vs OpenAPI).
5) **Security**: `npm run scan:security` (gitleaks + trivy); `npm audit --production --audit-level=high`.
6) **Build**: `npm run build` (frontend) + `npm --prefix backend run build`.
7) **E2E**: `npm run test:e2e` (Playwright), opcional `npm run a11y`.
8) **Performance**: `npm run perf:api` (k6 smoke), `npm run perf:web` (LHCI autorun) en main/canary.
9) **Artifacts**: coverage, LHCI reports, k6 outputs, SBOM (CycloneDX), OpenAPI, attestation/firma (cosign opcional).
10) **Deploy**: canary 5%-25%-50%-100%; smoke post-deploy; rollback automático si alertas.

## Políticas
- No merge si gates rojos; branches fix/*, feat/*.
- En PR desde forks: saltar secretos (seguridad) y usar report-only steps.
- Versionado semver; changelog por release; etiquetas de riesgo (security/perf/schema).
- Supply-chain: validar licencias (allowlist) y SBOM; rechazar PR si audit high>0 o licencias prohibidas.

## Entornos
- Dev: CI rápido, sampling 100% trazas, seeds automáticos.
- Stage: datos sintéticos, FF activadas para pruebas, LHCI y k6 completos.
- Pre-prod (opcional): dress rehearsal con datos anonimizados.
- Prod: canary/blue-green, alertas activas, backups antes de migrar.

## Recomendación de workflows adicionales
- `ci.yml`: principal (ya similar en repo).
- `nightly-security.yml`: npm audit, trivy fs, dependabot sync, sbom.
- `nightly-perf.yml`: k6 stress ligero + LHCI en main build.
- `release.yml`: build artefactos, generar openapi, adjuntar SBOM y coverage.
- `supply-chain.yml`: cosign/attest artefactos, check licencias, publicar SBOM.
