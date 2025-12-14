# Backend — PuraNatura

Pequeña guía para desarrollo y pruebas locales del backend.

- Variables de entorno importantes (ejemplo en `backend/.env.example`):

- DATABASE_URL — URL de la DB (ej. `postgresql://user:password@localhost:5432/puranatura` para Postgres).
- JWT_SECRET — secreto para firmar access tokens (no versionar valores reales).
- JWT_REFRESH_SECRET — secreto para refresh tokens (diferente del anterior).
- PORT — puerto del servidor (por defecto 3001).

Cómo ejecutar localmente (Postgres + Redis):

1. Copia `backend/.env.example` → `backend/.env` y reemplaza secrets.
2. Levanta Postgres y Redis con Docker: `docker compose up -d db redis` (también existe `docker-compose.yml`).
3. Instala deps y genera Prisma client: `npm --prefix backend ci` (o `npm --prefix backend install`).
4. Ejecuta migraciones locales apuntando a Postgres: `npx --prefix backend prisma migrate dev --schema=./prisma/schema.prisma`.
5. Inicia el servidor: `npm --prefix backend run dev`.

Notas sobre pruebas unitarias e integración:

- Las pruebas unitarias en la raíz usan `vitest` y el backend se importa directamente desde `backend/src`.
- En entorno CI el flujo de E2E inicia la app y ejecuta Playwright contra el frontend; la app espera migraciones y seed en CI.

Seguridad:

- Nunca subas `backend/.env` con secretos reales. Para producción usa variables de entorno del hosting / secret manager.
