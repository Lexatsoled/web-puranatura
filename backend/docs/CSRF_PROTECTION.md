# CSRF Protection

## Overview

El backend ahora usa `@fastify/csrf-protection` junto con `@fastify/cookie` para proteger todas las rutas mutantes (`POST/PUT/PATCH/DELETE`).  
Se implementó el patr��n **double-submit cookie**: Fastify emite un token CSRF, lo firma en una cookie httpOnly y el frontend lo reenvía en el header `X-CSRF-Token`.

## Backend

- **Plugin**: `src/plugins/csrf.ts` registra cookies seguras (SameSite Strict + `secure` en prod) y habilita `fastify.csrfProtection`.
- **Hook global**: aplica CSRF automáticamente en cada request mutante, por lo que no es necesario añadir `preHandler` en cada ruta.
- **Endpoint**: `GET /api/csrf-token` (ver `src/routes/csrf.ts`) genera un token nuevo y actualiza la cookie firmada.
- **Errores**: peticiones sin token, con token ausente en la cookie o token inválido responden `403` con los códigos `FST_CSRF_*`.

## Frontend

- `src/utils/api.ts` usa `axios` con `withCredentials: true`.
- Un interceptor de requests obtiene automáticamente un token vía `/api/csrf-token` cuando se prepara la primera petición mutante y lo reusa hasta que el servidor lo invalida.
- Si el servidor devuelve `403 FST_CSRF_*`, el interceptor vuelve a pedir un token y reintenta la petición original una única vez.
- Todo el código del store/servicios sigue usando la instancia centralizada de `api`, por lo que no hay `fetch` directos sin CSRF.

## Configuración

- Añadir `COOKIE_SECRET` (32+ caracteres) en `.env` / `.env.example`.  
- En producción debe combinarse con `NODE_ENV=production` para forzar cookies `secure`.
- `ALLOWED_ORIGINS` se respeta para CORS y se añadieron los headers/métodos necesarios (`X-CSRF-Token`, `credentials: true`).

## Testing

Archivo `src/routes/__tests__/csrf.test.ts` (Vitest) cubre:

1. Generación de token mediante `/api/csrf-token`.
2. Bloqueo de POST sin token.
3. POST exitoso con token válido.
4. Rechazo cuando el token no coincide con la cookie firmada.

Ejecutar:

```bash
cd backend
npm run test -- src/routes/__tests__/csrf.test.ts
```
