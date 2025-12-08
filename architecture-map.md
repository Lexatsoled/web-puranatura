# Mapa de Arquitectura - Web Puranatura

## Diagrama Conceptual

```mermaid
graph TD
    User[Usuario / Navegador] -->|HTTPS| CDN[CDN / Edge (Vercel/Netlify?)]
    CDN -->|Static Assets| Frontend[Frontend SPA (React 19)]

    User -->|API Requests| LB[Load Balancer / Reverse Proxy]
    LB -->|Express| Backend[Backend API (Node.js)]

    subgraph Frontend Layer
        Frontend -->|State| Zustand[Zustand Store]
        Frontend -->|Routing| Router[React Router]
        Frontend -->|UI| Components[Component Library (Tailwind)]
    end

    subgraph Backend Layer
        Backend -->|Middleware| Sec[Helmet/CSP/RateLimit]
        Backend -->|Auth| AuthMod[Auth Module]
        Backend -->|ORM| Prisma[Prisma Client]
    end

    subgraph Data Layer
        Prisma -->|SQL| DB[(SQLite / PostgreSQL)]
    end
```

## Flujos de Datos Sensibles

1.  **Autenticación**:
    - **Input**: Email/Password en `AuthModal`.
    - **Transit**: POST `/api/auth/login` (HTTPS).
    - **Processing**: Backend valida y compara hash (`bcrypt`).
    - **Storage**: Password hash en DB (Tabla `User`). Token JWT en Cookie (`HttpOnly`, `Secure`).
    - **Risk**: Logging accidental de credenciales (Check requestLogger).

2.  **Analytics**:
    - **Input**: Interacciones de usuario.
    - **Transit**: POST `/api/analytics`.
    - **Storage**: Tabla `AnalyticsEvent`.
    - **Risk**: `userIp` sin anonimizar explícitamente en el código revisado.

## Entrypoints & Sinks

### Entrypoints (Attack Surface)

- **Public Web**: `index.html` (DOM Based XSS vectors).
- **API Endpoints**:
  - `/api/auth/*` (Login, Register)
  - `/api/products/*` (Read operations + Search)
  - `/api/orders/*` (Transactional)
  - `/api/analytics/*` (Write heavy)

### Security Boundaries

- **Trust Boundary 1**: Navegador del cliente vs Backend API. (Validación requerida).
- **Trust Boundary 2**: Backend vs Base de Datos. (Sanitización paramétrica via Prisma - OK).

## Dependencias Críticas

- **Runtime**: Node.js >= 20.
- **Database**: SQLite (Dev) -> TBD (Prod).
- **External**: Google Analytics / Tag Manager (vistos en CSP).
