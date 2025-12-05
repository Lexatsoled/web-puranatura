# Suite de Regresión

Esta matriz define las pruebas necesarias para asegurar que los cambios no rompan funcionalidad existente.

## 1. Comandos de Prueba

| Tipo            | Comando                 | Descripción                                      |
| --------------- | ----------------------- | ------------------------------------------------ |
| **Unitarios**   | `npm run test:unit`     | Tests rápidos de lógica de negocio y utilidades. |
| **Integración** | `npm run test`          | Tests que involucran DB (SQLite) y API.          |
| **E2E**         | `npm run test:e2e`      | Flujos completos de usuario con Playwright.      |
| **Seguridad**   | `npm run scan:security` | Escaneo estático (SAST) y de secretos.           |
| **Linting**     | `npm run lint`          | Verificación de estilo y errores estáticos.      |
| **Tipos**       | `npm run type-check`    | Verificación estricta de TypeScript.             |

## 2. Matriz de Cobertura Crítica

| Módulo       | Funcionalidad       | Nivel de Prueba    | Archivos Clave                     |
| ------------ | ------------------- | ------------------ | ---------------------------------- |
| **Auth**     | Login / Registro    | Integration + E2E  | `backend.auth.test.ts`             |
| **Auth**     | Protección de Rutas | Integration        | `backend/src/middleware/auth.ts`   |
| **Tienda**   | Listar Productos    | Unit + Integration | `backend.products.test.ts`         |
| **Tienda**   | Carrito de Compras  | Unit (Frontend)    | `src/store/cartStore.ts`           |
| **Checkout** | Crear Pedido        | E2E                | `e2e/checkout.spec.ts` (Pendiente) |

## 3. Smoke Test Manual (Post-Despliegue)

1.  Cargar Home Page (verificar no error 500).
2.  Iniciar sesión con usuario de prueba.
3.  Navegar a "Tienda".
4.  Agregar producto al carrito.
5.  Verificar que el carrito persiste al recargar.
