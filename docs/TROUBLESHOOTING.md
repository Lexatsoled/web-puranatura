# Guía de Troubleshooting

## Build Errors

### Module not found
**Issue**: Error `Cannot resolve module` durante el build
**Solution**:
```bash
# Verificar dependencias instaladas
npm list --depth=0

# Reinstalar node_modules
rm -rf node_modules package-lock.json
npm install

# Verificar imports en el archivo problemático
grep -r "import.*from" src/ | grep "module-name"
```

### Out of memory
**Issue**: Build falla con `JavaScript heap out of memory`
**Solution**:
```bash
# Aumentar límite de memoria de Node
NODE_OPTIONS="--max-old-space-size=4096" npm run build

# O configurar en package.json scripts
"build": "NODE_OPTIONS=--max-old-space-size=4096 vite build"
```

### TypeScript errors
**Issue**: Errores de tipos TypeScript impiden el build
**Solution**:
```bash
# Verificar tipos
npm run type-check

# Auto-fix algunos errores
npm run lint:fix

# Revisar archivos con errores
npx tsc --noEmit --listFiles | head -20
```

### Vite build fails
**Issue**: Error durante la fase de build de Vite
**Solution**:
```bash
# Limpiar cache de Vite
rm -rf node_modules/.vite dist

# Verificar configuración de Vite
cat vite.config.ts

# Build con debug info
DEBUG=vite:* npm run build
```

## Runtime Errors

### CORS errors
**Issue**: Error `Access-Control-Allow-Origin` en requests
**Solution**:
```bash
# Verificar configuración CORS en backend
grep -r "CORS" backend/src/

# Check environment variables
echo $CORS_ORIGIN

# Test CORS con curl
curl -H "Origin: http://localhost:5173" -v http://localhost:3001/api/products
```

### JWT expired
**Issue**: Tokens JWT expiran prematuramente
**Solution**:
```bash
# Verificar configuración JWT
echo $JWT_EXPIRES_IN

# Check token generation
node -e "console.log(new Date(Date.now() + 24*60*60*1000))"

# Refresh token endpoint
curl -X POST http://localhost:3001/auth/refresh \
  -H "Authorization: Bearer <refresh-token>"
```

### 500 Internal Server Error
**Issue**: Errores 500 en endpoints de API
**Solution**:
```bash
# Verificar logs del backend
tail -f backend/logs/app-$(date +%Y-%m-%d).log

# Health check
curl http://localhost:3001/health

# Test endpoint específico
curl -v http://localhost:3001/api/products
```

### Service Worker errors
**Issue**: PWA service worker no registra correctamente
**Solution**:
```bash
# Verificar registration en browser dev tools
# Application > Service Workers

# Clear cache y recargar
# Hard refresh: Ctrl+Shift+R

# Verificar archivos del SW
ls -la public/sw.js dist/sw.js
```

## Database Issues

### Database locked
**Issue**: Error `SQLITE_BUSY` o database locked
**Solution**:
```bash
# Verificar conexiones activas
lsof backend/database.sqlite

# Kill procesos bloqueando
kill -9 <pid>

# Backup y restore
cp backend/database.sqlite backend/database.sqlite.backup
sqlite3 backend/database.sqlite ".recover" > recovered.db
```

### Migration failed
**Issue**: Error durante ejecución de migraciones
**Solution**:
```bash
# Verificar estado de migraciones
cd backend
npm run db:studio

# Rollback última migración
npm run db:rollback

# Re-run migrations
npm run db:migrate

# Check migration files
ls backend/src/db/migrations/
```

### Connection timeout
**Issue**: Database connection timeout
**Solution**:
```bash
# Test connection
sqlite3 backend/database.sqlite "SELECT 1;"

# Check file permissions
ls -la backend/database.sqlite

# Verify database integrity
sqlite3 backend/database.sqlite "PRAGMA integrity_check;"

# Restart backend
cd backend && npm restart
```

### Data corruption
**Issue**: Datos corruptos en la base de datos
**Solution**:
```bash
# Backup actual
cp backend/database.sqlite backend/database.sqlite.corrupt

# Restore from backup
npm run backup:restore -- --id <latest-backup>

# Verify data integrity
npm run db:seed:check

# Re-seed if necessary
npm run db:seed
```

## Performance Issues

### Slow page load
**Issue**: Páginas cargan lentamente
**Solution**:
```bash
# Check Lighthouse score
npx lighthouse http://localhost:5173 --view

# Analyze bundle size
npm run build && npx vite-bundle-analyzer dist

# Check network tab in dev tools
# Look for large assets or slow requests

# Verify caching headers
curl -I http://localhost:5173
```

### High memory usage
**Issue**: Aplicación consume mucha memoria
**Solution**:
```bash
# Monitor memory usage
ps aux | grep node

# Check for memory leaks
node --inspect --expose-gc backend/dist/index.js

# In browser dev tools: Memory tab
# Take heap snapshot and analyze

# Restart services
docker-compose restart backend
```

### Slow API responses
**Issue**: Endpoints de API responden lentamente
**Solution**:
```bash
# Time API calls
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:3001/api/products

# Check database query performance
sqlite3 backend/database.sqlite ".timer on" "SELECT * FROM products LIMIT 10;"

# Verify Redis cache
redis-cli ping
redis-cli keys "*"

# Check backend logs for slow queries
grep "slow" backend/logs/app-$(date +%Y-%m-%d).log
```

### Bundle size too large
**Issue**: Bundle de JavaScript muy grande
**Solution**:
```bash
# Analyze bundle
npm run build && npx vite-bundle-analyzer dist

# Check imports
npx vite-bundle-analyzer dist --reporter json > bundle-analysis.json

# Implement code splitting
# Add dynamic imports for routes
const Home = lazy(() => import('./pages/Home'));
```

## Deployment Issues

### Netlify build fails
**Issue**: Build falla en Netlify
**Solution**:
```bash
# Check build logs in Netlify dashboard
# Common issues:
# - Missing environment variables
# - Node version mismatch
# - Build command incorrect

# Test build locally
npm run build:prod

# Verify all dependencies
npm ls --depth=0
```

### Railway deployment fails
**Issue**: Despliegue falla en Railway
**Solution**:
```bash
# Check Railway logs
railway logs

# Verify environment variables
railway variables

# Test build locally
cd backend && npm run build

# Check database connection
railway run npm run db:migrate
```

### CDN assets not loading
**Issue**: Assets no cargan desde CDN
**Solution**:
```bash
# Test CDN URLs
curl -I https://cdn.bunny.net/your-zone/image.jpg

# Check CORS configuration
curl -H "Origin: https://yoursite.com" -v https://cdn.bunny.net/your-zone/image.jpg

# Verify pull zone settings
# BunnyCDN dashboard > Pull Zones

# Clear CDN cache
# BunnyCDN dashboard > Purge
```

### SSL certificate issues
**Issue**: Problemas con certificado SSL
**Solution**:
```bash
# Check certificate
openssl s_client -connect yoursite.com:443 -servername yoursite.com

# Verify in browser dev tools
# Security tab > View certificate

# Force HTTPS redirect
# Netlify: _redirects file
# Railway: Environment variable FORCE_HTTPS=true
```

## Debug Commands

### Health Checks
```bash
# API health
curl -f https://api.purezanaturalis.com/health

# Frontend health
curl -f -I https://purezanaturalis.com

# Database health
curl -f https://api.purezanaturalis.com/api/db-health
```

### Logs
```bash
# Backend logs
tail -f backend/logs/app-$(date +%Y-%m-%d).log

# Error logs
tail -f backend/logs/error-$(date +%Y-%m-%d).log

# Railway logs
railway logs -f

# Netlify logs (via dashboard)
```

### Database
```bash
# SQLite shell
sqlite3 backend/database.sqlite

# Check tables
.schema

# Analyze queries
EXPLAIN QUERY PLAN SELECT * FROM products;

# Database stats
.stats on
```

### Redis
```bash
# Connect to Redis
redis-cli

# Check connection
ping

# View keys
keys *

# Memory usage
info memory
```

### System
```bash
# Process list
ps aux | grep node

# Memory usage
free -h

# Disk usage
df -h

# Network connections
netstat -tlnp | grep :3001
```

### Performance
```bash
# CPU usage
top -p $(pgrep node)

# Network I/O
iftop

# Disk I/O
iotop

# System load
uptime
```

## Common Solutions

### Clear all caches
```bash
# Frontend
rm -rf node_modules/.vite dist
npm run build

# Backend
rm -rf backend/node_modules/.cache
cd backend && npm run build

# Browser
# Hard refresh: Ctrl+Shift+R
# Clear storage: Dev tools > Application > Clear storage
```

### Reset environment
```bash
# Stop all services
docker-compose down

# Clean databases
rm backend/database.sqlite
rm -rf backend/logs/*

# Re-seed
cd backend && npm run db:migrate && npm run db:seed

# Restart
docker-compose up -d
```

### Emergency rollback
```bash
# Git rollback
git reset --hard HEAD~1
git push --force origin main

# Database rollback
cd backend && npm run db:rollback

# Service restart
docker-compose restart
```