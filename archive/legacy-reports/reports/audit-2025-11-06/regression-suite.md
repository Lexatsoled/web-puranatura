# regression-suite

| Tipo                     | Objetivo                                               | Cobertura actual                         | Acción / Gap                                                                                         | Comando / Herramienta                                                                   |
| ------------------------ | ------------------------------------------------------ | ---------------------------------------- | ---------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Unit (Vitest)            | Validar stores, hooks y utilidades (`src/**`)          | 64 suites, 312 tests (Vitest CI)         | Añadir casos para `useCheckoutStore`, `SecurityService` y nuevos endpoints                           | `npm run test:ci`                                                                       |
| Integration (MSW)        | Simular API `/api/products`, `/api/orders`             | Inexistente                              | Crear harness con MSW + Vitest para `OrderService`/`AddressService`                                  | `npm run test:ci -- --runInBand msw`                                                    |
| E2E (Playwright)         | Cobertura de flujos críticos (auth, carrito, búsqueda) | 7 specs (`e2e/*.spec.ts`) ejecutan en CI | Añadir `checkout.spec.ts` real y smoke de `/api/orders`                                              | `npm run test:e2e` / `npx playwright test --project chromium`                           |
| Security smoke           | Detectar secretos, headers y CSRF                      | Manual / scripts aislados                | Integrar `gitleaks` + `npm run audit:components` en pipeline y ejecutar `zap-baseline` contra `/api` | `gitleaks detect`, `npm run audit:components`, `docker run owasp/zap2docker-stable ...` |
| Performance / Web Vitals | Medir LCP/TTFB/INP                                     | Lighthouse falla por interstitial        | Rehabilitar `npm run audit:all` + `lighthouse-ci` apuntando a preview y subir JSON                   | `npm run audit:all`, `npx lhci autorun`                                                 |
| Accesibilidad            | Validar WCAG 2.1 AA                                    | Playwright `e2e/a11y.spec.ts` (limitado) | Complementar con `@axe-core/playwright` y revisión manual de componentes                             | `npx playwright test e2e/a11y.spec.ts`, `npx axe-playwright`                            |
| Smoke backend            | Garantizar `/health`, `/api/products` responden        | No automatizado                          | Añadir etapa `curl` + `npm run test:ci --backend` en deploy                                          | `curl -f http://localhost:3001/health`, `npm run test:ci --backend`                     |

## Comandos agrupados sugeridos

```
npm run test:ci                # unit + msw
npm run test:e2e               # playwright chromium
npm run audit:all              # textos, links, componentes
npm run test:coverage          # vitest + v8 coverage
npx lhci autorun --upload.target=filesystem
```
