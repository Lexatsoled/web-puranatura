# Regression Suite

| Área                                                                | Cobertura                             | Escenarios críticos                                                                                 | Comando                                                         |
| ------------------------------------------------------------------- | ------------------------------------- | --------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| Unit (`frontend-hooks`, `frontend-contexts`, `frontend-components`) | Hooks, stores, sanitizadores          | `useLocalStorage`, `AuthContext`, `CartModal` currency helper, `useAnalytics` mock                  | `npm run test:unit`                                             |
| Integration (`frontend-pages`, `frontend-core`)                     | Rutas + providers + servicios         | Auth flow, StorePage filtros/paginación, Blog modal con DOMPurify, Wishlist + Cart                  | `vitest run --runInBand src/pages/**/*.test.tsx`                |
| E2E (`e2e-tests`)                                                   | Flujos usuario extremos               | Buscar→filtrar→añadir al carrito, checkout simulado, consentimiento analytics, accesibilidad básica | `npx playwright test --project=chromium`                        |
| Seguridad                                                           | Escaneo secretos + dependencias + XSS | `gitleaks`, `npm audit`, payload XSS en blog/contacto                                               | `gitleaks detect && npm audit --production`                     |
| Performance                                                         | Build + métricas web                  | Bundle size, `npm run optimize-images`, Lighthouse PWA                                              | `npm run build && npx lighthouse http://localhost:4173 --quiet` |
| Accesibilidad                                                       | Axe + snapshots                       | Focus visible en AuthModal, contraste en botones, navegación por teclado en menús                   | `npx axe http://localhost:4173 --tags wcag2a,wcag2aa`           |

## Scripts complementarios

- `npm run test:coverage`: garantiza cobertura ≥80 % tras refactors.
- `npm run lint`: ESLint + Tailwind plugin para detectar clases inválidas.
- `npm run validate`: encadena type-check + lint + format.
