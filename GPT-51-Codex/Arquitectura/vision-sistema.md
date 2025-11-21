# Arquitectura y Flujos de Datos

---

version: 1.1  
updated: 2025-11-19  
owner: Arquitectura & SRE

## 1. Diagrama textual (estado actual)

```
┌─────────────────────────────┐
| Navegador (React 19 + Vite) |
└──────────────┬──────────────┘
               │ BrowserRouter
               ▼
      [frontend-core / App.tsx]
               │
   ┌───────────┴───────────┐
   │                       │
State & Context        UI Components
(Cart/Auth/Zustand)    (pages, modales)
   │                       │
   ├─────► LocalStorage ◄──┤  (tokens, carritos, usuarios simulados)
   │                       │
   └────► Hooks/Utils ◄────┘  (`useApi`, `useAnalytics`, DOMPurify)
               │
               ▼
        “API” simulada (datos TS/CSV)
```

## 2. Capas y módulos (actual vs objetivo)

| Capa         | Directorios                                         | Estado actual                              | Estado objetivo                                                        |
| ------------ | --------------------------------------------------- | ------------------------------------------ | ---------------------------------------------------------------------- |
| Presentación | `src/pages`, `components`, `SimpleLayout`           | SPA Vite/Tailwind, layout duplicado        | SPA con layout único y consumo de API real                             |
| Estado       | `contexts`, `src/store`, `hooks/useLocalStorage.ts` | Auth/carrito simulados                     | Contextos conectados a BFF mediante `useApi`                           |
| **BFF/API**  | `backend/`                                          | Sólo BD SQLite sin `package.json`          | Servidor Express/Fastify con endpoints `/auth`, `/products`, `/orders` |
| Datos        | `data/*.ts`, `backend/database.sqlite`              | Catálogo estático + SQLite sin migraciones | SQLite gestionado por ORM (Prisma/Drizzle) + seeds                     |
| Utilidades   | `src/utils`, `scripts/`, `src/hooks`                | `useApi`, sanitizadores, optimizer roto    | `useApi` con contratos TS compartidos, optimizer funcional             |
| Tests & CI   | `test`, `e2e`, workflows                            | Vitest/Playwright fallando                 | Pipelines verdes, con mocks/bff consistentes                           |

## 3. Límites de confianza

- **Cliente**: toda la lógica de negocio y datos sensibles viven en el navegador.
- **Storage**: `localStorage` contiene usuarios, tokens y direcciones.
- **Backend placeholder**: `backend/` sólo incluye `.env` y `database.sqlite`, pero no existe `package.json` ni scripts (`npm run dev` falla con ENOENT).

## 4. Datos sensibles

| Flujo               | Fuente                        | Destino                                 | Protección actual                   |
| ------------------- | ----------------------------- | --------------------------------------- | ----------------------------------- |
| Credenciales        | `AuthModal` → `AuthContext`   | `localStorage`                          | Ninguna (plain text)                |
| Tokens              | Axios interceptor             | `localStorage` / header `Authorization` | Vulnerable a XSS                    |
| Direcciones/Pedidos | `AddressesPage`, `OrdersPage` | Estado en memoria                       | Sin cifrado ni validación           |
| Analytics           | `useAnalytics`                | `/api/analytics/events`                 | Sin anonimización ni consentimiento |

## 5. Decisiones arquitectónicas

1. Construir un BFF mínimo en `backend/` para exponer endpoints REST sobre SQLite (ver tareas `T1.5` y `T1.6`).
2. Usar un ORM ligero (Prisma/Drizzle) con migraciones versionadas.
3. Configurar Vite para proxyear `/api` al puerto 3001 y, cuando sea necesario, servir el frontend en `http://localhost:3000`.
4. Desacoplar datos estáticos: los `.ts` actuales serán reemplazados por respuestas del BFF o seeds que alimenten SQLite.

## 6. Diagramas de flujo

### Registro actual (problemático)

```
User submits form
  └─> AuthContext.register/login
        ├─ delay artificial
        ├─ leer localStorage('puranatura-users')
        ├─ buscar email/password
        └─ guardar usuario plano en localStorage
```

### Registro deseado

```pseudo
function login(email, password):
  response = POST http://localhost:3001/auth/login { email, password }
  assert response.status == 200
  setUser(response.body.profile)
  // tokens regresan en cookies HttpOnly
```

## 7. Integración propuesta

```
React SPA (dev: 5173 → opcional 3000)
        |
        | axios (useApi) /proxy(/api)
        v
Express/Fastify BFF (puerto 3001)
        |
        | ORM (Prisma/Drizzle)
        v
SQLite (database.sqlite)
```

1. **Servidor**: `backend/` necesita `package.json`, scripts (`dev`, `start`, `migrate`) y dependencias (Express, Prisma, etc.).
2. **ORM**: definir esquemas de productos, usuarios, pedidos; generar seeds y fixtures para pruebas.
3. **Proxy**: ajustar `vite.config.ts` para redirigir `/api` a `http://localhost:3001` y documentar cómo exponer el frontend en `http://localhost:3000` si se desea emular producción.
4. **Tests**: usar la misma base (o in-memory) en suites unitarias/integración para validar la capa de datos real.

## 8. Observaciones sobre los puertos

- **Backend**: el error `npm ERR! enoent package.json` confirma que todavía no existe un proyecto Node en `backend/`. Urge crear este paquete antes de intentar `npm run dev`.
- **Frontend**: Vite sirve por defecto en `5173`. Si se requiere `3000`, basta con `npm run dev -- --port 3000` o ajustando `vite.config.ts`. Mantener 5173 en dev no es un problema siempre que haya un proxy claro hacia `3001`.

---

### Historial de cambios

- **2025-11-19 · v1.1** – Se añadió el objetivo BFF/SQLite y observaciones de puertos.
- **2025-11-19 · v1.0** – Mapa inicial y ADRs.
