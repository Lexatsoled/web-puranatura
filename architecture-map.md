
# Mapa de Arquitectura - Web Puranatura

## 1. Diagrama de Alto Nivel

```mermaid
graph TD
    User[Usuario (Navegador/PWA)]
    CDN[CDN / Edge (Vercel/Netlify - Opcional)]
    LB[Load Balancer / Proxy (Nginx/Docker)]
    
    subgraph "Frontend (Cliente)"
        SPA[React SPA (Vite)]
        Store[Estado Global (Zustand)]
        Router[React Router]
    end

    subgraph "Backend (Container Cluster)"
        API[Node.js / Express Server]
        Auth[Auth Middleware (JWT/Redis)]
        Jobs[Background Jobs (Opcional)]
    end

    subgraph "Data Persistence"
        Redis[(Redis Cache & RateLimit)]
        DB[(PostgreSQL 15)]
    end

    User -->|HTTPS| CDN
    CDN -->|Request| LB
    LB -->|Proxy Pass| API
    
    SPA -->|API Calls (Axios)| API
    
    API -->|Auth/RateLimit| Redis
    API -->|Query/ORM| DB
```

## 2. Inventario de Componentes y Límites de Confianza

### Frontend (Untrusted)
*   **Módulo**: `frontend-core` (`src/`)
*   **Tecnologías**: React 19, Vite, TailwindCSS, Zustand.
*   **Seguridad**: `index.html` (CSP Meta/Headers), Sanitizers (`dompurify`), Validadores (`zod`).
*   **Entradas**: Inputs de usuario (Formularios, URL Params).
*   **Salidas**: DOM Rendering (React), LocalStorage (Persistencia temporal).

### Backend (Trusted-ish)
*   **Módulo**: `backend-core` (`backend/src/`)
*   **Tecnologías**: Node.js, Express, Prisma, Helmet.
*   **Entradas**: Peticiones JSON/REST, Headers (Auth, Trace).
*   **Límites de Confianza**:
    *   **Input Validation**: `zod` middleware en rutas.
    *   **Auth**: JWT (Signed cookies), CSRF (Double Submit).
    *   **Rate Limiting**: Redis-backed para Auth, Memory para Global.

### Data Layer (Trusted)
*   **PostgreSQL**: Datos persistentes (Usuarios, Productos, Pedidos). No expuesto a internet.
*   **Redis**: Sesiones volátiles, caché, rate-limit counters. No expuesto a internet.

## 3. Entrypoints y Data Flow

### Puntos de Entrada Públicos
*   `GET /`: SPA Assets.
*   `POST /api/auth/login`: Autenticación y emisión de cookies.
*   `POST /api/auth/register`: Creación de cuentas.
*   `GET /api/products`: Catálogo público.

### Flujos de Datos Sensibles
1.  **Autenticación**: `User Creds` -> `POST /login` -> `Bcrypt Verify` -> `JWT Sign` -> `Set-Cookie (HttpOnly)`.
2.  **Información Personal (PII)**: `User Profile` -> `DB (User table)` -> `API (Scoped per User ID)`.
3.  **Newsletter/Contacto**: Emails de usuario.

## 4. Dependencias Clave & Riesgos
*   `prisma`: ORM crítico. Vulnerabilidad en Prisma Engine afectaría todo el acceso a datos.
*   `express`: Framework web. Mantenimiento activo requerido.
*   `bcryptjs`: Hashing de contraseñas. Estándar.
*   `jsonwebtoken`: Manejo de sesiones. Clave secreta (`JWT_SECRET`) es el "Reino".

## 5. Infraestructura
*   **Docker Compose**: Orquestación local/dev.
    *   `db`: Postgres 15.
    *   `redis`: Redis 7.
*   **CI/CD**: Scripts en `scripts/`, GitHub Actions (inferido por `.github/workflows`).
