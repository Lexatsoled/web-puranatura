# Guía de Despliegue

## Prerequisites

Antes de desplegar la aplicación, asegúrate de tener las siguientes cuentas y herramientas:

### Cuentas Requeridas
- **GitHub**: Repositorio para el código fuente
- **Netlify**: Para el despliegue del frontend
- **Railway**: Para el backend y base de datos
- **BunnyCDN**: Para distribución de assets estáticos
- **Sentry**: Para monitoreo de errores (opcional pero recomendado)

### Herramientas Locales
- **Node.js** >= 18.0.0
- **npm** >= 8.0.0
- **Git** para control de versiones
- **Railway CLI** (opcional, para despliegue via CLI)

## Environment Variables

### Frontend (.env)
```env
# API Configuration
VITE_API_BASE_URL=https://api.purezanaturalis.com

# Authentication
VITE_JWT_SECRET=your_jwt_secret_here

# External Services
VITE_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
VITE_GEMINI_API_KEY=your_gemini_api_key

# CDN
VITE_CDN_BASE_URL=https://cdn.bunny.net/your-pull-zone

# Analytics (optional)
VITE_GA_TRACKING_ID=GA_MEASUREMENT_ID
```

### Backend (.env)
```env
# Environment
NODE_ENV=production
PORT=3001

# Database
DATABASE_URL=file:./database.sqlite

# Redis (for caching)
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=24h

# Security
CORS_ORIGIN=https://purezanaturalis.com
CSRF_SECRET=your_csrf_secret_here

# External Services
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Monitoring
PROMETHEUS_METRICS_ENABLED=true
LOKI_URL=http://loki:3100
```

## Netlify Deployment

### Via GitHub Integration (Recomendado)

1. **Conectar Repositorio**
   - Ve a [Netlify](https://app.netlify.com) y haz login
   - Click en "Add new site" → "Import an existing project"
   - Selecciona "Deploy with GitHub" y autoriza el acceso
   - Busca y selecciona tu repositorio `yourusername/pureza-naturalis-v3`

2. **Configurar Build Settings**
   - **Branch to deploy**: `main` o `production`
   - **Build command**: `npm run build:prod`
   - **Publish directory**: `dist`
   - **Node version**: `18.x` o superior

3. **Configurar Environment Variables**
   - Ve a "Site settings" → "Environment variables"
   - Agrega todas las variables VITE_* listadas arriba
   - Asegúrate de que empiecen con `VITE_` para exponerlas al frontend

4. **Deploy Automático**
   - Netlify detectará pushes a la rama configurada
   - El build se ejecutará automáticamente
   - El sitio estará disponible en `https://your-site-name.netlify.app`

### Via Netlify CLI

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Inicializar sitio
netlify init

# Configurar variables de entorno
netlify env:set VITE_API_BASE_URL https://api.purezanaturalis.com

# Deploy
netlify deploy --prod --dir=dist
```

## Railway Deployment

### Via GitHub Integration (Recomendado)

1. **Conectar Repositorio**
   - Ve a [Railway](https://railway.app) y haz login
   - Click en "New Project" → "Deploy from GitHub repo"
   - Autoriza Railway para acceder a tus repositorios
   - Selecciona `yourusername/pureza-naturalis-v3`

2. **Configurar Servicio Backend**
   - Railway detectará automáticamente el `package.json` en `backend/`
   - Configura el comando de start: `npm start` o `node dist/index.js`
   - Establece la variable `NODE_ENV=production`

3. **Configurar Base de Datos**
   - Railway creará automáticamente una base de datos SQLite
   - La URL se expondrá como variable `DATABASE_URL`
   - Para PostgreSQL/MySQL, cambia en el dashboard

4. **Configurar Variables de Entorno**
   - Ve al servicio backend → "Variables"
   - Agrega todas las variables de entorno del backend listadas arriba
   - Railway expondrá automáticamente la URL del servicio como variable

### Via Railway CLI

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Crear proyecto
railway init pureza-naturalis-backend

# Conectar a GitHub
railway connect

# Configurar variables
railway variables set NODE_ENV=production
railway variables set DATABASE_URL=file:./database.sqlite

# Deploy
railway up
```

## Docker Deployment

### Docker Compose Setup

Crea un archivo `docker-compose.yml` en la raíz:

```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=file:./database.sqlite
      - REDIS_URL=redis://redis:6379
    depends_on:
      - redis
    volumes:
      - ./backend/database.sqlite:/app/database.sqlite

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml

  grafana:
    image: grafana/grafana
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana_data:/var/lib/grafana

volumes:
  redis_data:
  grafana_data:
```

### Dockerfile para Backend

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar código fuente
COPY . .

# Build TypeScript
RUN npm run build

# Exponer puerto
EXPOSE 3001

# Comando de inicio
CMD ["npm", "start"]
```

### Ejecutar Docker Deployment

```bash
# Construir y ejecutar
docker-compose up -d

# Ver logs
docker-compose logs -f backend

# Escalar servicios
docker-compose up -d --scale backend=3
```

## Database Migration

### Migraciones Automáticas

```bash
# En el directorio backend
cd backend

# Generar migraciones desde schema
npm run db:generate

# Ejecutar migraciones
npm run db:migrate

# Sembrar datos iniciales
npm run db:seed
```

### Backup y Restore

```bash
# Crear backup
npm run backup:create

# Listar backups
npm run backup:list

# Restaurar backup
npm run backup:restore -- --id <backup-id>

# Verificar integridad
npm run backup:check
```

## Rollback Procedure

### Netlify Rollback

1. Ve al dashboard de Netlify
2. Click en "Deploys"
3. Selecciona el deploy anterior exitoso
4. Click en "Rollback to this deploy"

### Railway Rollback

1. Ve al dashboard de Railway
2. Selecciona el servicio backend
3. Ve a "Deployments"
4. Click en el deployment anterior
5. Click en "Rollback"

### Git Rollback

```bash
# Revertir último commit
git revert HEAD

# Push cambios
git push origin main

# Si es emergencia, reset a commit anterior
git reset --hard <commit-hash>
git push --force origin main
```

## Health Checks

### API Health Checks

```bash
# Health check básico
curl -f https://api.purezanaturalis.com/health

# Health check detallado
curl -f https://api.purezanaturalis.com/health/ready

# Health check de liveness
curl -f https://api.purezanaturalis.com/health/live
```

### Frontend Health Check

```bash
# Verificar que el sitio responde
curl -f -I https://purezanaturalis.com

# Verificar assets críticos
curl -f https://cdn.bunny.net/your-zone/images/logo.png
```

### Database Health Check

```bash
# Verificar conexión a DB (desde el servidor)
curl -f https://api.purezanaturalis.com/api/db-health
```

## Monitoring Setup

### Sentry Configuration

1. **Crear proyecto en Sentry**
   - Ve a [sentry.io](https://sentry.io) y crea cuenta
   - Crea proyecto "Pureza Naturalis V3"
   - Obtén el DSN

2. **Configurar en Frontend**
   ```javascript
   import * as Sentry from "@sentry/react";

   Sentry.init({
     dsn: "your-dsn-here",
     environment: "production",
     tracesSampleRate: 1.0,
   });
   ```

3. **Configurar en Backend**
   ```javascript
   import * as Sentry from "@sentry/node";

   Sentry.init({
     dsn: "your-dsn-here",
     environment: "production",
     tracesSampleRate: 1.0,
   });
   ```

### Prometheus + Grafana

1. **Instalar Prometheus**
   ```yaml
   # prometheus.yml
   global:
     scrape_interval: 15s

   scrape_configs:
     - job_name: 'pureza-backend'
       static_configs:
         - targets: ['backend:3001']
   ```

2. **Configurar Grafana**
   - Importar dashboard de Node.js
   - Agregar datasource de Prometheus
   - Crear panels para métricas clave

### Uptime Monitoring

1. **Configurar en Netlify**
   - Ve a "Site settings" → "Monitoring"
   - Activar uptime monitoring
   - Configurar alertas

2. **External Monitoring Services**
   - Usar servicios como UptimeRobot o Pingdom
   - Configurar checks cada 5 minutos
   - Alertas por email/SMS

### Log Aggregation con Loki

```yaml
# Configurar Loki datasource en Grafana
# Crear dashboard para visualizar logs
# Configurar alertas basadas en patrones de log
```

## Troubleshooting Deployment

### Problemas Comunes

**Build falla en Netlify:**
- Verificar que todas las variables VITE_* estén configuradas
- Revisar logs de build en Netlify dashboard

**Backend no inicia en Railway:**
- Verificar variables de entorno
- Revisar logs: `railway logs`

**Database connection falla:**
- Verificar DATABASE_URL
- Asegurarse de que las migraciones se ejecutaron

**CDN assets no cargan:**
- Verificar configuración de BunnyCDN
- Revisar CORS settings

## Performance Optimization

### Frontend Optimization
- **Image optimization**: Configurado automáticamente en build
- **Code splitting**: Vite maneja automáticamente
- **Caching**: Service worker para assets estáticos

### Backend Optimization
- **Compression**: Gzip automático con Fastify
- **Caching**: Redis para sesiones y datos frecuentes
- **Rate limiting**: Protección contra abuso

### Database Optimization
- **Indexes**: Configurados en schema
- **Connection pooling**: Drizzle ORM maneja automáticamente
- **Query optimization**: Usar EXPLAIN para queries lentas