# 🎯 Referencia Rápida para Desarrolladores

**Pureza Naturalis V3 - Auditoría 2025-11-11**

---

## 🔍 Verificación Rápida

### ¿Dónde buscar información?
- 📄 **Documentación general**: `INDICE_MAESTRO_AUDITORIA.md`
- 📄 **Tareas Fase 2**: `CHECKLIST_FASE_2.md`
- 📄 **Plan detallado**: `FASE_2_PLAN.md`
- 📄 **Verificación Fase 1**: `FASE_1_VERIFICATION.md`

### ¿Qué se implementó en Fase 1?
1. ✅ Contraseña aleatoria en seed.ts
2. ✅ CSP en index.html
3. ✅ Validación de query length (2 capas)
4. ✅ Rate limiting (100-200 req/min)

### ¿Qué hacer en Fase 2?
Elegir tarea:
- Frontend: PERF-IMG-001, PERF-BUNDLE-001, UX-ERROR-001
- Backend: PERF-CACHE-001, PERF-N+1-001

---

## 💻 Comandos Útiles

### Desarrollo
```bash
# Frontend
cd src && npm run dev

# Backend
cd backend && npm run dev

# Ambos (si hay script)
npm run dev:all
```

### Testing
```bash
# Tests unitarios
npm run test:unit

# Tests E2E
npm run test:e2e

# Performance
npm run test:performance

# O manual con Lighthouse
lighthouse http://localhost:5173
```

### Build
```bash
# Frontend
npm run build

# Análisis de bundle
npm run analyze

# Backend (si aplica)
cd backend && npm run build
```

### Verificación de seguridad
```bash
# CSP headers
curl -I http://localhost:3001/api/v1/products

# Rate limit
curl http://localhost:3001/api/v1/products -H "X-Forwarded-For: 192.168.1.1"
```

---

## 📋 Checklist Previo a Comenzar Tarea

Antes de empezar cualquier tarea:

- [ ] Leo el plan de la tarea en `FASE_2_PLAN.md`
- [ ] Leo el checklist específico en `CHECKLIST_FASE_2.md`
- [ ] Me asigno la tarea en el tracking
- [ ] Creo rama: `git checkout -b <task-id>`
- [ ] Implemento cambios
- [ ] Ejecuto tests: `npm run test`
- [ ] Verifico performance con Lighthouse
- [ ] Commit: `git commit -m "feat(...): <task-id>"`

---

## 🎯 Métricas a Monitorear

### Fase 2 Targets

| Métrica | Target | Actual | Status |
|---------|--------|--------|--------|
| LCP | < 2.5s | ~3.5s | 🔴 |
| FID | < 100ms | ~120ms | 🟡 |
| CLS | < 0.1 | ~0.15 | 🟡 |
| Bundle | < 350KB | ~450KB | 🔴 |
| API P95 | < 300ms | ~450ms | 🔴 |

Objetivo: Todas en 🟢 (verde)

---

## 🔐 Security Best Practices (Fase 1)

Lo que **SÍ** hacer:
- ✅ Validar inputs en frontend Y backend
- ✅ Usar CSP headers
- ✅ Implementar rate limiting
- ✅ Usar contraseñas seguras (crypto.randomBytes)
- ✅ Sanitizar salidas con DOMPurify

Lo que **NO** hacer:
- ❌ Hardcodear secretos en código
- ❌ Usar dangerouslySetInnerHTML sin sanitizar
- ❌ Confiar solo en validación frontend
- ❌ Exponer contraseñas en logs o git
- ❌ Ignorar warnings de seguridad

---

## 📊 Estructura de Archivos Importantes

```
Pureza-Naturalis-V3/
├── src/
│   ├── components/
│   │   └── ImageZoom.tsx (cache-busting, lazy load)
│   ├── services/
│   │   └── productApi.ts (SEC-INPUT-001: query validation)
│   └── utils/
│       └── security/ (sanitización)
├── backend/
│   ├── src/
│   │   ├── db/
│   │   │   └── seed.ts (SEC-SEED-001: random password)
│   │   ├── plugins/
│   │   │   ├── rateLimit.ts (SEC-RATE-LIMIT-001)
│   │   │   └── securityHeaders.ts (headers CSP)
│   │   ├── services/
│   │   │   ├── productService.ts (N+1 queries)
│   │   │   └── authService.ts
│   │   └── routes/
│   │       ├── v1/products.ts (SEC-INPUT-001: backend validation)
│   │       └── v1/search.ts
│   └── config/
│       └── redis.ts (caché)
├── index.html (SEC-CSP-001: CSP headers)
├── INDICE_MAESTRO_AUDITORIA.md
├── FASE_1_VERIFICATION.md
├── FASE_2_PLAN.md
└── CHECKLIST_FASE_2.md
```

---

## 🚀 Workflow de PR

1. **Crear rama**: `git checkout -b <task-id>`
2. **Implementar**: Hacer cambios
3. **Tests**: `npm run test && npm run test:e2e`
4. **Commit**: `git commit -m "feat(...): <task-id> - Descripción"`
5. **Push**: `git push origin <task-id>`
6. **PR**: Crear PR con checklist
7. **Review**: Esperar aprobación Tech Lead
8. **Merge**: `git merge` cuando esté aprobado
9. **Deploy**: Tag y deployment a main

---

## 🐛 Debugging

### Problema: CSP blocking scripts
```bash
# Revisar console para CSP violations
# Solución: Añadir origin a CSP directiva en index.html
```

### Problema: Rate limit bloqueando requests
```bash
# Headers de rate limit:
# X-RateLimit-Limit: 100
# X-RateLimit-Remaining: 99
# X-RateLimit-Reset: <timestamp>
```

### Problema: N+1 queries
```bash
# En desarrollo, usar query logging:
# backend/src/config/database.ts - enable query logs
```

### Problema: Images no loading
```bash
# Verificar:
# 1. Archivo existe en public/Jpeg/
# 2. Ruta en BD coincide con archivo
# 3. Cache-busting con timestamp activo
# 4. Network tab sin 404 errors
```

---

## 📞 Escalaciones

### Si algo se bloquea:
1. **Tech Lead**: Para decisiones arquitectónicas
2. **DevOps**: Para problemas de performance/infra
3. **Security**: Para dudas de seguridad
4. **Product**: Para cambios de scope

### Contacto rápido:
- Slack: `#pureza-dev`
- Email: `dev-team@purezanaturalis.com`

---

## 📚 Lectura Recomendada

### Para Fase 2:
- [ ] `FASE_2_PLAN.md` - Entender el scope
- [ ] `CHECKLIST_FASE_2.md` - Tu tarea específica
- [ ] [Web Vitals Guide](https://web.dev/vitals/) - Performance basics
- [ ] [CSP Best Practices](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) - Si tocas seguridad

### Para DevOps:
- [ ] `FASE_2_PLAN.md` sección 2.3 (Caché)
- [ ] [HTTP Caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching)
- [ ] [Redis Caching](https://redis.io/docs/)

### Para QA:
- [ ] `FASE_2_PLAN.md` sección Testing
- [ ] `CHECKLIST_FASE_2.md` matriz de testing
- [ ] Lighthouse audit manual

---

## ✅ Quick Validation

### Antes de hacer PR:
```bash
# 1. Tests pasan?
npm run test ✅

# 2. No hay console errors?
npm run build (sin warnings) ✅

# 3. Performance mejoró?
lighthouse http://localhost:5173 ✅

# 4. Código limpio?
npm run lint ✅

# 5. Documentación actualizada?
README.md o doc comentario ✅
```

---

## 🎁 Bonificaciones (Nice to Have)

- [ ] Agregar tests unitarios para tu cambio
- [ ] Documentar en comentarios de código
- [ ] Actualizar README si es necesario
- [ ] Crear screenshot/video de mejora
- [ ] Agregr métrica antes/después

---

## 🏁 Final Checklist

Cuando termines tu tarea:

- [ ] Tests verdes
- [ ] Code review aprobado
- [ ] Performance validada
- [ ] Documentación completa
- [ ] Merge a `main`
- [ ] Tag creado: `<task-id>`
- [ ] Deployment completado
- [ ] Monitoreo activo

---

**Éxito en tu tarea. Recuerda: la calidad de tu trabajo aspira al 0.1% superior global. 🌟**
