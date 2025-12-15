# 🚀 Guía de Arranque (PuraNatura v2)

Esta guía describe cómo iniciar el proyecto completo utilizando la nueva infraestructura robusta con Docker.

## Prerrequisitos

- **Node.js 20+** instalado.
- **Docker Desktop** instalado y corriendo.

## Pasos de Inicio

### 1. Iniciar Infraestructura (Docker)

Levanta la base de datos (PostgreSQL) y el sistema de caché (Redis).

```powershell
docker-compose up -d
```

> _Verifica que estén corriendo con `docker ps`._

### Opcional: Detener Infraestructura

Cuando termines de trabajar y quieras liberar recursos:

```powershell
docker-compose down
```

> _Esto detiene y elimina los contenedores, pero tus datos persisten en el disco._

### 2. Iniciar la Aplicación (Backend + Frontend)

En la raíz del proyecto, ejecuta el comando que inicia ambos servicios en paralelo:

```powershell
npm run dev
```

Esto iniciará:

- **Frontend**: `http://localhost:5173` (Vite)
- **Backend**: `http://localhost:3001` (Node/Express)
- **Generador Prisma**: Se ejecutarán automáticamente las migraciones si es necesario.

## Solución de Problemas Comunes

- **Error: NOAUTH Authentication required**: Significa que tu entorno tiene Redis con contraseña (Docker) pero el backend no la tiene configurada. _Solución: Verifica que `backend/src/config/env.ts` tenga el fallback o define `REDIS_PASSWORD` en tu `.env`._
- **Error: EPERM / Archivo bloqueado**: Windows bloqueó la librería de Prisma. _Solución: Cierra la terminal completamente y abre una nueva._
- **Error: Database incompatible**: _Solución: Asegúrate de usar la imagen `postgres:15-alpine` en `docker-compose.yml`._
