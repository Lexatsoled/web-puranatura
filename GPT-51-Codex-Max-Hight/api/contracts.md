# Contratos y Esquemas Clave

## Auth
- register/login: body `{email (email), password (min6), firstName, lastName, phone?}`.
- Respuesta: `{user:{id,email,firstName,lastName,phone?,isAdmin}, traceId?}` + cookies `token`, `refreshToken`.
- Errores: 400 USER_EXISTS, 401 INVALID_CREDENTIALS, 429 LOCKED_OUT.

## Products
- GET `/api/products`: query `page>=1`, `pageSize<=50`, `category?`, `search?`; headers: ETag/If-None-Match soportado.
- Respuesta 200: lista productos; headers `X-Total-Count`, `X-Page`, `X-Page-Size`, `ETag`, `Cache-Control`.
- 304 si ETag coincide.
- POST `/api/products` (admin): body `{name, slug, description?, price>0, imageUrl?, stock>=0}`.

## Orders
- POST `/api/orders`: body `{items:[{productId, quantity>=1}]}`; requiere auth.
- Respuesta 201: `{id,total,status,items[]}`.
- Errores: 400 INVALID_PRODUCTS/INSUFFICIENT_STOCK, 401 UNAUTHORIZED.
- GET `/api/orders`: auth; lista por user.

## Analytics (nuevo)
- POST `/api/analytics/events`: body `{category, action, label?, value?, metadata?, timestamp?, sessionId?}`; rate-limit 20/5m.
- Respuesta 202: `{ok:true}`; 400 inválido; 429 rate-limit.

## AI
- POST `/api/ai/generate-text`: body `{prompt}`; valida longitud; timeout 10s; rate-limit 20/5m.
- Respuesta 200: `{generatedText}`; 400 prompt vacío; 500 fallback sin filtrar secretos.

## Health / Metrics
- `/api/health`: `{status:'ok', version, db:true}`.
- `/metrics`: prom-client text; solo GET.
