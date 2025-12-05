# Mapa Arquitectónico - PuraNatura

## 1. Diagrama de Alto Nivel

```mermaid
graph TD
    User[Usuario / Navegador] -->|HTTPS| CDN[Vite Frontend Assets]
    User -->|API Requests /api/*| Proxy[Vite Proxy (Dev) / Nginx (Prod)]

    subgraph "Frontend (React + Vite)"
        App[App.tsx]
        Router[React Router]
        Store[Zustand Store]
        AuthContext[Auth Context]

        App --> Router
        Router --> Pages[Pages (Lazy Loaded)]
        Pages --> Components
        Components --> Hooks
        Hooks --> ApiClient[Axios Client]
    end

    subgraph "Backend (Node.js + Express)"
        Server[server.ts]
        ExpressApp[Express App]
        Middleware[Helmet, CORS, RateLimit]
        AuthMiddleware[JWT Auth]
        Prisma[Prisma Client]

        Proxy --> Server
        Server --> ExpressApp
        ExpressApp --> Middleware
        Middleware --> Routes
        Routes --> AuthMiddleware
        AuthMiddleware --> Controllers
        Controllers --> Prisma
    end

    subgraph "Data Layer"
        SQLite[(SQLite Dev DB)]
        PrismaSchema[Schema.prisma]

        Prisma --> SQLite
    end

    ApiClient -.->|JSON| Proxy
```

## 2. Flujos de Datos Críticos

### Autenticación (AuthN/AuthZ)

1.  **Login:** `POST /api/auth/login` -> `AuthController` -> `Prisma (User)` -> Retorna JWT.
2.  **Protección:** Middleware valida `Authorization: Bearer <token>`.
3.  **Frontend:** `AuthProvider` almacena estado, `axios` interceptor maneja errores 401.

### Catálogo de Productos

1.  **Lectura:** `GET /api/products` -> Cache (si existe) -> DB.
2.  **Imágenes:** `src/utils/imageProcessor.ts` maneja optimización.

## 3. Límites de Confianza (Trust Boundaries)

- **Boundary 1 (Browser <-> Server):** Todo input del cliente es no confiable. Validación estricta con `Zod` en backend requerida.
- **Boundary 2 (Server <-> DB):** Uso de Prisma ORM mitiga SQLi, pero se debe cuidar raw queries (no detectadas aún).
- **Boundary 3 (Dev Tools):** Scripts en `scripts/` tienen acceso a FS y env vars.

## 4. Entrypoints & Sinks

- **Entrypoints:**
  - HTTP: `backend/src/server.ts` (puerto dinámico en dev).
  - CLI: `npm run dev`, `npm run build`.
- **Sinks (Destinos de datos):**
  - Logs: `console.log` (stdout), archivos en `tmp-artifacts/`.
  - DB: Archivo SQLite local `backend/prisma/dev.db`.
  - Browser DOM: React render (riesgo XSS si se usa `dangerouslySetInnerHTML`).
