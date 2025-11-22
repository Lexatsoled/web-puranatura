# Arquitectura, Especificaciones y Diagramas

version: 1.0  
owner: Arquitectura  
alcance: frontend SPA (Vite/React 19), BFF Express/Prisma/SQLite, CI/CD GitHub Actions, observabilidad integral.

## 1. Requerimientos funcionales

- Catálogo de productos: listar, buscar, paginar, filtrar por categoría.
- Auth JWT cookie HttpOnly: registro/login/logout/refresh/me; rol admin para gestión de productos.
- Pedidos: crear pedido autenticado, listar pedidos del usuario.
- Métricas/dashboards: página `/metricas` consume datos (mock o API) con autorización.

## 2. Requerimientos no funcionales

- Rendimiento: TTFB API P95 <300 ms; LCP <2.5 s; INP <200 ms; bundle <650 kB.
- Disponibilidad: 99.5% mínimo; deploy sin downtime (blue/green/canary).
- Seguridad: CSP, CSRF protegido, rate limiting, zero secrets en repo; OWASP A01-A10 mitigado.
- Mantenibilidad: cobertura ≥80%; complejidad ciclomática <10 por función; MI > 80.
- Observabilidad: logs estructurados, trazas distribuidas, métricas/alertas con SLIs/SLOs definidos.

## 3. Diagrama de arquitectura (texto)

```text
Browser (React 19 + Vite)
  | axios (useApi) w/ sanitization, retry, circuit-breaker
  | cookies HttpOnly (token/refresh) + CSRF header
  v
API Gateway/Proxy (CORS restrictivo, CSP, rate-limit)
  v
Backend BFF (Express 4/5)
  - Routes: /api/auth, /api/products, /api/orders, /api/health
  - Middlewares: helmet, csrf, rate-limit, zod validation, error envelope {code,message,traceId}
  - Prisma ORM -> SQLite (dev) / Postgres (staging/prod)
  - Logging pino + OpenTelemetry tracing
  - Feature flags (env/remote)
```

## 4. Diagramas UML (texto)

### 4.1 Diagrama de clases (simplificado)

```text
User {id, email, passwordHash, firstName, lastName, phone, createdAt}
Product {id, slug, name, description, price, imageUrl, stock, createdAt}
Order {id, userId, total, status, createdAt}
OrderItem {id, orderId, productId, quantity, unitPrice}
Review {id, productId, userId, rating, comment, createdAt}

AuthService
  +register(email, password, firstName, lastName, phone)
  +login(email, password)
  +refresh(refreshToken)
  +logout()

ProductService
  +list(pagination, filters)
  +get(id)
  +create(dto) [admin]

OrderService
  +create(userId, items)
  +listByUser(userId)
```

### 4.2 Diagrama de secuencia (checkout)

```text
User -> Frontend: addToCart(product)
User -> Frontend: POST /api/orders {items}
Frontend -> API: Cookie(token) + CSRF header
API -> AuthMiddleware: validate JWT
API -> ZodValidator: validate payload
API -> Prisma: fetch products (ids)
API -> Prisma: create order + items (tx)
API -> Observability: log + trace span
API -> Frontend: 201 {order}
Frontend -> Notifications: success toast
```

## 5. Contratos API (resumen; ver `api/openapi-guide.md`)

- GET `/api/health` → 200 `{status,timestamp,productCount}`
- POST `/api/auth/register|login` → 201/200 `{user}` + cookies (`token`,`refreshToken`)
- POST `/api/auth/refresh|logout` → 200 `{ok:true}`
- GET `/api/auth/me` → 200 `{user}`
- GET `/api/products` → 200 `{items, page, pageSize, total}`
- POST `/api/products` (admin) → 201 `{product}`
- GET `/api/products/:id` → 200 `{product}`
- POST `/api/orders` (auth) → 201 `{order}`
- GET `/api/orders` (auth) → 200 `[order]`

## 6. Modelos y DB

- ORM: Prisma. Migraciones versionadas en `backend/prisma/migrations`.
- Índices recomendados: `Product.slug`, `Product.createdAt`, `Order.userId+createdAt DESC`.
- FKs y ON DELETE RESTRICT para integridad.

## 7. Políticas de error y resiliencia

- Envelope: `{ code, message, traceId, details? }`
- Retries: cliente (axios) solo en GET/429/503 con backoff exponencial; circuit breaker tras N fallos.
- Timeouts: axios 10s; API body limit 1MB.

## 8. Rendimiento y caching

- HTTP caching: ETag + `Cache-Control: public, max-age=300` en `/api/products`.
- App-level caching opcional (Redis) para listado de productos.
- Lazy-load dataset legacy; paginación server-side.

## 9. Aseguramiento de calidad

- Métricas: LCP/CLS/INP (Lighthouse CI), TTFB/API P95 (k6), coverage, complexity, lint.
- Gates: PR debe pasar lint+typecheck+unit+e2e+security scan.
