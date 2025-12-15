# Suite de Regresión - Web Puranatura

## Matriz de Pruebas

### 1. Pruebas Unitarias (`npm run test:unit`)
*   **Scope**: Hooks, utilidades, componentes aislados.
*   **Críticos**:
    *   `src/store/authStore.ts`: Verificar login/logout y persistencia.
    *   `src/utils/sanitizer.ts`: Verificar limpieza de XSS.
    *   `backend/src/middleware/auth.ts`: Verificar rechazo de tokens inválidos.

### 2. Pruebas de Integración (`npm run test:integration` - TBD)
*   **Scope**: API Endpoints + DB.
*   **Críticos**:
    *   `GET /api/products`: Verificar filtros y paginación.
    *   `POST /api/auth/login`: Verificar emisión de cookie/token.

### 3. Pruebas E2E (`npm run test:e2e`)
*   **Scope**: Flujos completos de usuario (Playwright).
*   **Escenarios**:
    1.  **Checkout Flow**: Agregar producto -> carrito -> (mock) checkout.
    2.  **Auth Flow**: Registro -> Login -> Perfil -> Logout.
    3.  **Search**: Buscar "manzanilla" -> Ver resultados -> Click detalle.

### 4. Pruebas de Seguridad (`npm run scan:security`)
*   **Herramientas**: Trivy, Gitleaks.
*   **Regla**: Fallar pipeline si hay High/Critical CVEs.

### 5. Pruebas de Accesibilidad (`npm run a11y`)
*   **Herramientas**: Axe CLI.
*   **Scope**: Home, Product Detail, Modal de Auth.

## Comandos de Ejecución

```bash
# Ejecutar toda la suite
npm run regression

# Solo tests de backend
npm run test:ci --filter=backend

# Solo validación de tipos
npm run type-check
```
