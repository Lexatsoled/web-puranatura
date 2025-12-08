# Docker Setup (Futuro - Borrador No Implementado)

**Fecha de Creación**: 08 de diciembre de 2025  
**Estado**: 📋 Borrador para Fase 5+ | Solo Referencia  
**Nota**: ⚠️ Este documento NO debe implementarse ahora. Solo es un borrador para futura migración a contenedores.

---

## Introducción

PuraNatura actualmente se despliega como aplicación Node.js tradicional. Este documento proporciona un borrador de configuración Docker para **futura** migración a contenedores (post-MVP).

**Por Qué Docker Later**:

- MVP actual en deployment simple (SQLite, monolito)
- Docker añade complejidad (orchestration, networking, volumes)
- Upgrade a PostgreSQL/MySQL + Redis recomendado **antes** de containerizar
- Revisitar cuando: usuarios > 1000 o queramos escalado automático

---

## Arquitectura Propuesta (Multi-Contenedor)

```
┌─────────────────────────────────────────────────┐
│                   Nginx/Traefik                  │
│              (Reverse Proxy + Load Balancer)     │
└────────────┬─────────────────────────────────────┘
             │
    ┌────────┴──────────┬───────────────┐
    │                   │               │
┌───▼─────────┐  ┌──────▼──────┐  ┌─────▼──────┐
│   App (x2)  │  │  PostgreSQL │  │   Redis    │
│ Port 3001   │  │ Port 5432   │  │ Port 6379  │
└─────────────┘  └─────────────┘  └────────────┘
```

**Servicios**:

- **app**: Node.js (2+ réplicas para load balancing)
- **db**: PostgreSQL 15 (upgrade de SQLite)
- **cache**: Redis 7 (session/rate limit store)
- **nginx**: Reverse proxy (HTTPS termination)

---

## Dockerfiles

### Dockerfile (App)

```dockerfile
# Multi-stage build para optimizar tamaño imagen

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /build

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./
COPY vite.config.ts ./
COPY vitest.config.ts ./
COPY postcss.config.js ./
COPY tailwind.config.js ./
COPY eslint.config.cjs ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build frontend + backend
RUN npm run build

# Stage 2: Runtime
FROM node:20-alpine

WORKDIR /app

# Install dumb-init (PID 1 safety)
RUN apk add --no-cache dumb-init

# Copy only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy built artifacts from builder
COPY --from=builder /build/dist ./dist
COPY --from=builder /build/backend/dist ./backend/dist
COPY --from=builder /build/public ./public

# Copy prisma schema + migrations
COPY --from=builder /build/backend/prisma ./backend/prisma

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

USER nodejs

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Expose port
EXPOSE 3001

# Use dumb-init to handle signals properly
ENTRYPOINT ["/sbin/dumb-init", "--"]

# Start app
CMD ["node", "backend/dist/index.js"]
```

**Explicación**:

- **Multi-stage**: Imagen runtime pequeña (solo prod dependencies)
- **dumb-init**: Maneja signals SIGTERM correctamente (graceful shutdown)
- **Non-root user**: Seguridad (nodejs user)
- **Health check**: Docker sabe si app está healthy
- **EXPOSE 3001**: Documentación (no expone puerto automáticamente)

### Dockerfile (Migration)

Para ejecutar migraciones Prisma antes de iniciar app:

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY backend/prisma ./backend/prisma

RUN npm ci --omit=dev

COPY backend/dist ./backend/dist

ENV DATABASE_URL=postgresql://user:pass@db:5432/puranatura

CMD ["npx", "prisma", "migrate", "deploy", "--schema=backend/prisma/schema.prisma"]
```

---

## docker-compose.yml (Desarrollo)

```yaml
version: '3.9'

services:
  # Node.js app
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: puranatura-app
    ports:
      - '3001:3001'
    environment:
      NODE_ENV: development
      DATABASE_URL: postgresql://puranatura:password@db:5432/puranatura
      REDIS_URL: redis://cache:6379
      JWT_SECRET: dev-secret-do-not-use-in-prod
      JWT_REFRESH: dev-refresh-secret
      ALLOWED_ORIGINS: http://localhost:5173,http://localhost:3000
      LOG_LEVEL: debug
      METRICS_ENABLED: false
    depends_on:
      db:
        condition: service_healthy
      cache:
        condition: service_healthy
    volumes:
      - ./src:/app/src # Dev hot reload (optional)
      - ./backend/src:/app/backend/src
    networks:
      - puranatura-net
    restart: unless-stopped
    healthcheck:
      test: ['CMD', 'curl', '-f', 'http://localhost:3001/health']
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 5s

  # PostgreSQL database
  db:
    image: postgres:15-alpine
    container_name: puranatura-db
    environment:
      POSTGRES_USER: puranatura
      POSTGRES_PASSWORD: password # Cambiar en prod!
      POSTGRES_DB: puranatura
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backend/prisma/migrations:/docker-entrypoint-initdb.d
    networks:
      - puranatura-net
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U puranatura -d puranatura']
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

  # Redis cache
  cache:
    image: redis:7-alpine
    container_name: puranatura-cache
    ports:
      - '6379:6379'
    volumes:
      - redis_data:/data
    networks:
      - puranatura-net
    healthcheck:
      test: ['CMD', 'redis-cli', 'ping']
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped
    command: redis-server --appendonly yes --requirepass redis_password

  # Prisma migrations
  migrate:
    build:
      context: .
      dockerfile: Dockerfile.migrate
    environment:
      DATABASE_URL: postgresql://puranatura:password@db:5432/puranatura
    depends_on:
      db:
        condition: service_healthy
    networks:
      - puranatura-net
    profiles: ['migrate'] # Run only when needed: docker-compose --profile migrate up

volumes:
  postgres_data:
  redis_data:

networks:
  puranatura-net:
    driver: bridge
```

**Uso**:

```bash
# Start all services
docker-compose up -d

# Run migrations
docker-compose --profile migrate up

# View logs
docker-compose logs -f app

# Stop services
docker-compose down

# Cleanup volumes (CAREFUL!)
docker-compose down -v
```

---

## docker-compose.yml (Producción)

```yaml
version: '3.9'

services:
  # App (múltiples réplicas)
  app:
    build:
      context: .
      dockerfile: Dockerfile.prod
    image: puranatura-app:latest
    deploy:
      replicas: 2 # Load balancing
      restart_policy:
        condition: on-failure
        delay: 5s
        max_attempts: 3
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://${DB_USER}:${DB_PASSWORD}@db:5432/puranatura
      REDIS_URL: redis://:${REDIS_PASSWORD}@cache:6379
      JWT_SECRET: ${JWT_SECRET}
      JWT_REFRESH: ${JWT_REFRESH}
      ALLOWED_ORIGINS: https://puranatura.com,https://www.puranatura.com
      SECURE_COOKIES: 'true'
      CSP_REPORT_ONLY: 'false'
      HSTS_ENABLED: 'true'
      RATE_LIMIT_ENABLED: 'true'
      LOG_LEVEL: info
      METRICS_ENABLED: 'true'
    depends_on:
      db:
        condition: service_healthy
      cache:
        condition: service_healthy
    networks:
      - puranatura-net
    restart: always

  # Nginx reverse proxy
  nginx:
    image: nginx:alpine
    ports:
      - '80:80'
      - '443:443'
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./certs:/etc/nginx/certs:ro
      - ./logs/nginx:/var/log/nginx
    depends_on:
      - app
    networks:
      - puranatura-net
    restart: always

  # PostgreSQL
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: puranatura
      POSTGRES_INITDB_ARGS: '--encoding=UTF8 --locale=C'
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups:/var/backups
    networks:
      - puranatura-net
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U ${DB_USER} -d puranatura']
      interval: 10s
      timeout: 5s
      retries: 5
    restart: always

  # Redis
  cache:
    image: redis:7-alpine
    command: redis-server --requirepass ${REDIS_PASSWORD} --appendonly yes
    volumes:
      - redis_data:/data
    networks:
      - puranatura-net
    restart: always

volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local

networks:
  puranatura-net:
    driver: bridge
```

**Notas Producción**:

- `deploy.replicas: 2` para carga distribuida
- Nginx como reverse proxy (HTTPS termination)
- Credenciales en `.env.prod` (nunca en git)
- Logs persistidos en volumes

---

## nginx.conf (Reverse Proxy)

```nginx
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
  worker_connections 1024;
}

http {
  include /etc/nginx/mime.types;
  default_type application/octet-stream;

  log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                  '$status $body_bytes_sent "$http_referer" '
                  '"$http_user_agent" "$http_x_forwarded_for"';

  access_log /var/log/nginx/access.log main;

  sendfile on;
  tcp_nopush on;
  tcp_nodelay on;
  keepalive_timeout 65;
  types_hash_max_size 2048;
  client_max_body_size 20M;

  gzip on;
  gzip_vary on;
  gzip_proxied any;
  gzip_comp_level 6;
  gzip_types text/plain text/css text/xml text/javascript
             application/json application/javascript application/xml+rss
             application/rss+xml font/truetype font/opentype
             application/vnd.ms-fontobject image/svg+xml;

  upstream app_backend {
    least_conn;  # Load balancing strategy
    server app:3001 max_fails=3 fail_timeout=30s;
    server app:3001 max_fails=3 fail_timeout=30s;
  }

  # HTTP redirect to HTTPS
  server {
    listen 80;
    server_name _;
    return 301 https://$host$request_uri;
  }

  # HTTPS server
  server {
    listen 443 ssl http2;
    server_name puranatura.com www.puranatura.com;

    # SSL certificates
    ssl_certificate /etc/nginx/certs/certificate.crt;
    ssl_certificate_key /etc/nginx/certs/private.key;

    # SSL security
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=100r/m;
    limit_req zone=api_limit burst=20 nodelay;

    # Proxy settings
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header Connection "";
    proxy_http_version 1.1;
    proxy_read_timeout 30s;
    proxy_connect_timeout 10s;

    # Backend proxy
    location / {
      proxy_pass http://app_backend;

      # Health check endpoint (no limit)
      location = /health {
        access_log off;
        proxy_pass http://app_backend;
      }

      # Metrics endpoint (protected)
      location = /metrics {
        satisfy any;
        allow 10.0.0.0/8;      # Internal only
        allow 172.16.0.0/12;
        deny all;
        proxy_pass http://app_backend;
        access_log off;
      }
    }

    # Static files caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
      proxy_pass http://app_backend;
      expires 1y;
      add_header Cache-Control "public, immutable";
    }

    # API endpoints
    location /api/ {
      limit_req zone=api_limit burst=20 nodelay;
      proxy_pass http://app_backend;
    }

    # Logs
    access_log /var/log/nginx/access.log main;
    error_log /var/log/nginx/error.log warn;
  }
}
```

---

## Kubernetes (Futuro, si aplica)

Cuando escales a Kubernetes:

### Deployment YAML

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: puranatura-app
  labels:
    app: puranatura
spec:
  replicas: 3
  selector:
    matchLabels:
      app: puranatura
  template:
    metadata:
      labels:
        app: puranatura
    spec:
      containers:
        - name: app
          image: puranatura-app:latest
          ports:
            - containerPort: 3001
          env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: app-secrets
                  key: database-url
            - name: JWT_SECRET
              valueFrom:
                secretKeyRef:
                  name: app-secrets
                  key: jwt-secret
          resources:
            requests:
              memory: '256Mi'
              cpu: '250m'
            limits:
              memory: '512Mi'
              cpu: '500m'
          livenessProbe:
            httpGet:
              path: /health
              port: 3001
            initialDelaySeconds: 30
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /ready
              port: 3001
            initialDelaySeconds: 5
            periodSeconds: 5
      affinity:
        podAntiAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
            - weight: 100
              podAffinityTerm:
                labelSelector:
                  matchExpressions:
                    - key: app
                      operator: In
                      values:
                        - puranatura
                topologyKey: kubernetes.io/hostname
---
apiVersion: v1
kind: Service
metadata:
  name: puranatura-service
spec:
  selector:
    app: puranatura
  ports:
    - protocol: TCP
      port: 3001
      targetPort: 3001
  type: ClusterIP
```

---

## Consideraciones de Seguridad

### Image Scanning

```bash
# Scan image para vulnerabilidades
trivy image puranatura-app:latest

# Usar minimal base image
FROM node:20-alpine  # 170MB vs 1GB con ubuntu

# Remove unnecessary files
RUN rm -rf /var/cache/apt /var/lib/apt/lists
```

### Network Isolation

```yaml
# Docker network (dev)
networks:
  puranatura-net:
    driver: bridge

# Kubernetes NetworkPolicy (prod)
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: deny-all
spec:
  podSelector: {}
  policyTypes:
    - Ingress
    - Egress
```

### Secrets Management

```bash
# Docker (dev)
docker run --env-file .env.local puranatura-app

# Kubernetes (prod)
kubectl create secret generic app-secrets \
  --from-literal=jwt-secret=<random> \
  --from-literal=database-url=postgresql://...
```

---

## Performance Considerations

### Multi-stage Builds

```dockerfile
# Reduce image size: ~250MB → ~150MB
FROM node:20-alpine AS builder
# Build stage (dependencies, compile)

FROM node:20-alpine
# Runtime stage (only prod deps)
```

### Layer Caching

```dockerfile
# Optimize build cache:
# 1. Copy package.json (change less often)
# 2. Install dependencies
# 3. Copy source code (change often)
COPY package*.json ./
RUN npm ci
COPY . .
```

### Health Checks

```dockerfile
HEALTHCHECK --interval=30s --timeout=10s \
  CMD curl -f http://localhost:3001/health || exit 1
```

---

## Monitoring in Containers

### Logs

```bash
# View logs
docker-compose logs -f app

# Structured logging (JSON)
echo '{"level":"error","msg":"DB error","timestamp":"2025-01-08T..."}' | json_pp
```

### Metrics

```bash
# Prometheus endpoint
curl http://localhost:3001/metrics
```

### Container Stats

```bash
docker stats puranatura-app
```

---

## Deployment Strategy (Blue-Green)

```bash
# Deploy new version as "green"
docker-compose -f docker-compose.green.yml up -d

# Run smoke tests
npm run test:e2e

# Switch traffic to green
# Update load balancer/DNS

# Keep blue for rollback
# docker-compose -f docker-compose.blue.yml down
```

---

## Checklists

### Pre-Containerization

- [ ] PostgreSQL upgrade completado (de SQLite)
- [ ] Redis setup validado (sessions, cache)
- [ ] Logs centralizados (CloudWatch, ELK, etc.)
- [ ] Secrets en manager (AWS Secrets, HashiCorp Vault)
- [ ] Health check endpoint implementado (/health)
- [ ] Graceful shutdown implementado (SIGTERM handler)

### Container Build

- [ ] Dockerfile optimizado (multi-stage)
- [ ] Base image minimal (alpine)
- [ ] Security scanning (Trivy)
- [ ] Image tagging strategy (semver)
- [ ] Registry setup (Docker Hub, ECR, GCR)

### Deployment

- [ ] docker-compose.yml validado (dev + prod)
- [ ] Environment variables configuradas
- [ ] Volume mounts documentados
- [ ] Network policies definidas
- [ ] Monitoring/alerting configurado
- [ ] Rollback plan documentado

---

## Referencia Rápida

```bash
# Build image
docker build -t puranatura-app:1.0.0 .

# Run container
docker run -p 3001:3001 -e DATABASE_URL=... puranatura-app:1.0.0

# Docker Compose
docker-compose up -d
docker-compose down
docker-compose logs -f

# Kubernetes
kubectl apply -f deployment.yaml
kubectl logs -f deployment/puranatura-app
kubectl rollout undo deployment/puranatura-app
```

---

**Última Actualización**: 08 de diciembre de 2025  
**Estado**: 📋 Borrador | No implementar hasta decisión de equipo

⚠️ **Aviso**: Este documento es solo referencia. No ejecutar en producción sin:

1. Upgrade de SQLite → PostgreSQL
2. Validación de Redis en producción
3. Audit de seguridad Docker
4. Pruebas extensivas en staging
