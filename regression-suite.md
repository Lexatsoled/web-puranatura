# Suite de Regresión

Esta suite define las pruebas críticas que deben pasar antes de cualquier despliegue a producción.

## 1. Unit Tests (Frontend & Backend)

> Ejecución rápida, sin I/O real.

```bash
# Backend
cd backend && npm run test:unit
# Frontend
npm run test:unit
```

**Cobertura clave:**

- Validación de `registerRoutes` en backend.
- Utilidades de formateo y cálculo de precios.
- Reducers de Zustand/Context.

## 2. Integration Tests (API Contract)

> Verifica que la API responde según lo esperado (conectado a DB prueba).

```bash
npm run test:contract
```

**Escenarios:**

- **Auth Flow**: Login exitoso devuelve cookie/JWT. Login fallido devuelve 401.
- **Product List**: GET /products devuelve array y paginación correcta.
- **Order Creation**: POST /orders descuenta stock (si aplica simulacion).

## 3. End-to-End (E2E) - Critical Paths

> Simula usuario real. Usa Playwright/Cypress.

```bash
npm run test:e2e
```

**Flujos Críticos:**

1.  **Guest Checkout**: Usuario anónimo añade al carrito -> Checkout -> Login Modal -> Compra.
2.  **User Registration**: Abrir modal -> Rellenar form -> Submit -> Verificar redirección/estado logged in.
3.  **Search & Filter**: Buscar "aceite" -> Aplicar filtros -> Verificar resultados.

## 4. Security Regression

> Escaneos automáticos.

```bash
npm run scan:security
```

- Verificar que no reintroducimos secretos en código.
- Verificar dependencias vulnerables (npm audit).

## 5. Accessibility Check

```bash
npm run a11y
```

- Verificar que no hay violaciones "critical" o "serious" de WCAG 2.1 AA.
