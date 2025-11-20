# Matriz de Pruebas y Scripts

---

version: 1.0  
updated: 2025-11-19  
owner: QA Automation

## Cobertura global

| Tipo        | Herramienta                | Escenarios                                                  | Comando                                                         | Criterio de aceptación       |
| ----------- | -------------------------- | ----------------------------------------------------------- | --------------------------------------------------------------- | ---------------------------- |
| Unit        | Vitest + RTL               | Hooks (`useLocalStorage`, `useAnalytics`), contextos, utils | `npm run test:unit`                                             | ≥80 % coverage, sin warnings |
| Integration | Vitest (component testing) | Pages + Providers (`StorePage`, `CartModal`)                | `vitest run src/pages/**/*.test.tsx`                            | Tests pasan en <2 min        |
| E2E         | Playwright                 | Búsqueda→Carrito, Auth, Checkout Smoke                      | `npx playwright test --project=chromium`                        | 0 fallos; retries <1         |
| Smoke CI    | Playwright smoke suite     | Home render, SEO tags, basic nav                            | `npx playwright test --grep @smoke`                             | <3 min por run               |
| Seguridad   | Trivy + CodeQL upload      | `security-scan` workflow                                    | `gh workflow run ci --job security-scan`                        | SARIF subido, 0 críticos     |
| Secret Scan | GitHub Secret Scanning     | push/PR                                                     | `gh workflow run secret-scan`                                   | 0 hallazgos                  |
| Performance | Lighthouse CI + Web Vitals | Home/Store                                                  | `npx lighthouse http://localhost:4173 --quiet --preset=desktop` | LCP ≤2.5s, CLS ≤0.1          |
| A11y        | axe-core CLI               | AuthModal, Checkout                                         | `npx axe http://localhost:4173/contacto --tags wcag2aa`         | 0 errores críticos           |

## Scripts auxiliares

```bash
# Ejecutar suite completa (local)
npm run validate && npm run test:unit && npm run build && npx playwright test

# Obtener logs detallados de un test e2e
npx playwright test tests/e2e/search-filter-cart.spec.ts --debug --project=chromium

# Ejecutar seguridad en local
docker run --rm -v $PWD:/repo aquasec/trivy fs --format sarif --output trivy-results.sarif .
```

## Gestión de resultados

- Subir reportes `playwright-report/` a `docs/` sólo con datos anonimizados.
- Adjuntar archivos `.sarif` y `.json` relevantes en `GPT-51-Codex/Tests/Resultados/<fecha>/`.

---

### Historial de cambios

- **2025-11-19 · v1.0** – Definición inicial de la matriz y comandos.
