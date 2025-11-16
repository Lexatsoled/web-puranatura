# 🌿 PUREZA NATURALIS V3 - MASTER INSTRUCTIONS

## 📋 CONTEXTO DEL PROYECTO

**Nombre**: Pureza Naturalis V3  
**Tipo**: E-commerce Platform (Productos Naturales y Terapias)  
**Estado**: Implementación desde cero  
**Fecha inicio**: 07/11/2025  
**Ubicación**: `c:\Users\Usuario\Desktop\Web Puranatura\Pureza-Naturalis-V3`

## 🎯 OBJETIVO PRINCIPAL

Desarrollar una plataforma e-commerce moderna, segura y de alto rendimiento para la venta de productos naturales, siguiendo las mejores prácticas de la industria en:

- **Seguridad**: Protección contra vulnerabilidades comunes (OWASP Top 10)
- **Performance**: Tiempos de carga < 2s, bundle optimizado, caching estratégico
- **Accesibilidad**: WCAG 2.1 AA compliance
- **SEO**: Optimización para motores de búsqueda
- **Escalabilidad**: Arquitectura preparada para crecer
- **Calidad**: Cobertura de tests > 80%, CI/CD automatizado

## 🏗️ ARQUITECTURA TÉCNICA

### Frontend
- **Framework**: React 18.3 + TypeScript 5.3
- **Build Tool**: Vite 5.0
- **State Management**: Zustand
- **Routing**: React Router 6
- **Styling**: TailwindCSS 3
- **PWA**: Workbox + Service Worker
- **i18n**: react-i18next (ES/EN)

### Backend
- **Framework**: Fastify 4.25
- **Database**: SQLite + Drizzle ORM
- **Cache**: Redis (con fallback in-memory)
- **Auth**: JWT + CSRF protection
- **Logging**: Pino
- **Validation**: Zod

### DevOps
- **CI/CD**: GitHub Actions
- **Frontend Hosting**: Netlify
- **Backend Hosting**: Railway
- **CDN**: BunnyCDN / Cloudflare
- **Monitoring**: Sentry + Prometheus + Grafana
- **Testing**: Vitest + Playwright + k6

## 📊 ESTRUCTURA DEL PROYECTO

```
Pureza-Naturalis-V3/
├── frontend/
│   ├── src/
│   │   ├── components/       # Componentes React
│   │   ├── pages/            # Páginas/rutas
│   │   ├── store/            # Zustand stores
│   │   ├── hooks/            # Custom hooks
│   │   ├── utils/            # Utilidades
│   │   ├── types/            # TypeScript types
│   │   └── styles/           # CSS/TailwindCSS
│   ├── public/               # Assets estáticos
│   └── vite.config.ts
│
├── backend/
│   ├── src/
│   │   ├── routes/           # API endpoints
│   │   ├── services/         # Lógica de negocio
│   │   ├── db/               # Database schema/migrations
│   │   ├── plugins/          # Fastify plugins
│   │   ├── middleware/       # Middlewares
│   │   └── utils/            # Utilidades
│   └── drizzle.config.ts
│
├── .github/
│   ├── workflows/            # GitHub Actions
│   └── execution-plan/       # INSTRUCCIONES DE IMPLEMENTACIÓN
│       └── instructions/     # 35 tareas detalladas
│
├── k6/                       # Load tests
├── monitoring/               # Prometheus/Grafana configs
├── scripts/                  # Utility scripts
└── docs/                     # Documentación
```

## 🎯 OBJETIVOS POR FASE

### FASE 1: Seguridad Crítica (TASK-001 a TASK-012)
**Objetivo**: Establecer base de seguridad sólida antes de cualquier funcionalidad

**Logros esperados**:
- ✅ Zero secretos en código fuente (git-secrets)
- ✅ Protección CSRF completa
- ✅ Rotación automática de tokens
- ✅ Auditoría de dependencias automatizada
- ✅ Sanitización de inputs (XSS prevention)
- ✅ Rate limiting configurado
- ✅ Logging seguro (sin PII)
- ✅ Security headers (CSP, HSTS, etc.)
- ✅ Backups automáticos encriptados (AES-256)

**Criterio de éxito**: Pasar security audit completo sin vulnerabilidades críticas/altas

### FASE 2: Backend Robusto (TASK-013 a TASK-024)
**Objetivo**: API completa, performante y bien documentada

**Logros esperados**:
- ✅ API REST completa (Products, Orders, Search, Users)
- ✅ Full-text search con SQLite FTS5
- ✅ Paginación cursor-based eficiente
- ✅ Sistema de cache con Redis
- ✅ Queries optimizados (índices, EXPLAIN QUERY PLAN)
- ✅ Connection pooling (WAL mode)
- ✅ Integración CDN para assets
- ✅ Compresión HTTP (Brotli/Gzip)
- ✅ Health checks (/health, /ready, /metrics)
- ✅ Error handling global consistente
- ✅ Schema validation centralizado (Zod)
- ✅ OpenAPI/Swagger documentation

**Criterio de éxito**: 
- API response time P95 < 200ms
- Throughput > 1000 req/s
- Documentation completa en /docs

### FASE 3: Optimización Frontend (TASK-025 a TASK-035)
**Objetivo**: UX excepcional, PWA completa, production-ready

**Logros esperados**:
- ✅ Code splitting (bundle inicial < 200KB)
- ✅ PWA installable con offline support
- ✅ Web Vitals monitoreados (LCP < 2.5s, FID < 100ms, CLS < 0.1)
- ✅ SEO optimizado (meta tags, sitemap, structured data)
- ✅ WCAG 2.1 AA compliance (Lighthouse > 95)
- ✅ Soporte multi-idioma ES/EN
- ✅ E2E tests completos (Playwright)
- ✅ CI/CD pipeline automatizado
- ✅ Monitoring completo (Sentry, Prometheus, Grafana)
- ✅ Load testing (k6) con benchmarks
- ✅ Documentación exhaustiva

**Criterio de éxito**:
- Lighthouse Score: Performance > 90, Accessibility > 95, Best Practices > 95, SEO > 95
- Bundle size < 300KB total
- Tests coverage > 80%
- Zero deployment manual steps

## 📝 SISTEMA DE INSTRUCCIONES

### Ubicación
```
.github/execution-plan/instructions/TASK-XXX-*.md
```

### Formato de cada instrucción
Cada archivo `.md` contiene:

1. **📋 INFORMACIÓN**: ID, Fase, Prioridad, Estimación
2. **🎯 OBJETIVO**: Qué se debe lograr
3. **🛠️ IMPLEMENTACIÓN**: Código completo paso a paso
4. **✅ CRITERIOS DE ACEPTACIÓN**: Checklist de completado
5. **🧪 VALIDACIÓN**: Comandos para verificar implementación

### Total de tareas: 35
- **TASK-001 a TASK-012**: Fase 1 (Seguridad)
- **TASK-013 a TASK-024**: Fase 2 (Backend)
- **TASK-025 a TASK-035**: Fase 3 (Frontend)

## 🔄 METODOLOGÍA DE TRABAJO

### Para ti (GPT-5-codex):

1. **Lee esta guía completa** para entender el contexto global

2. **Implementación secuencial** (TASK-001 → TASK-035):
   
   Para cada tarea:
   - **LEER**: Abrir `.github/execution-plan/instructions/TASK-XXX-*.md`
   - **IMPLEMENTAR**: Escribir TODO el código especificado
   - **VALIDAR**: Ejecutar comandos de verificación
   - **CONFIRMAR**: Verificar criterios de aceptación
   - **COMMIT**: `git commit -m "feat: TASK-XXX - [descripción]"`
   - **CONTINUAR**: Siguiente tarea automáticamente

3. **NO improvisar**: Seguir instrucciones exactamente como están escritas

4. **NO omitir código**: Implementar COMPLETO, no versiones "simplificadas"

5. **NO saltar validaciones**: Ejecutar TODOS los tests/comandos

6. **SÍ adaptar rutas**: Ajustar paths según estructura real del proyecto

7. **SÍ reportar problemas**: Si algo falla, documentar el error

## 🚨 REGLAS CRÍTICAS

### ❌ NO HACER:
- ❌ Cambiar arquitectura o stack tecnológico
- ❌ Omitir secciones de código "por simplicidad"
- ❌ Inventar soluciones no especificadas
- ❌ Saltar tests o validaciones
- ❌ Ignorar criterios de aceptación
- ❌ Hacer commits masivos (un commit por tarea)

### ✅ SÍ HACER:
- ✅ Seguir instrucciones al pie de la letra
- ✅ Implementar código completo de cada tarea
- ✅ Ejecutar todas las validaciones
- ✅ Reportar errores con detalle
- ✅ Adaptar rutas/configuración según entorno
- ✅ Mantener consistencia de estilo
- ✅ Documentar decisiones si hay ambigüedad

## 📊 SEGUIMIENTO DE PROGRESO

Actualizar después de cada fase completada:

### Estado Actual:
- [ ] **FASE 1**: Seguridad Crítica (0/12 tareas)
- [ ] **FASE 2**: Backend Robusto (0/12 tareas)
- [ ] **FASE 3**: Optimización Frontend (0/11 tareas)

**Total: 0/35 tareas completadas (0%)**

### Checkpoints de Validación:

**Después de FASE 1:**
```bash
npm run test:security
npm audit
npm run lint
```

**Después de FASE 2:**
```bash
npm run test:api
npm run build:backend
curl http://localhost:3000/health
open http://localhost:3000/docs
```

**Después de FASE 3:**
```bash
npm run build
npm run test:e2e
npm run lighthouse
npm run load-test
```

## 🎬 INICIO DE IMPLEMENTACIÓN

### Comando inicial:
```bash
cd "c:\Users\Usuario\Desktop\Web Puranatura\Pureza-Naturalis-V3"
code .github/execution-plan/instructions/TASK-001-SECRET-DETECTION.md
```

### Prompt de inicio:
```
He leído MASTER-INSTRUCTIONS.md.
Comenzando implementación secuencial desde TASK-001.
```

## 📚 RECURSOS ADICIONALES

### Documentación de referencia:
- React 18: https://react.dev
- Fastify: https://fastify.dev
- Drizzle ORM: https://orm.drizzle.team
- Vite: https://vitejs.dev
- TailwindCSS: https://tailwindcss.com
- Playwright: https://playwright.dev
- k6: https://k6.io

### Estándares de calidad:
- OWASP Top 10: https://owasp.org/www-project-top-ten/
- WCAG 2.1: https://www.w3.org/WAI/WCAG21/quickref/
- Web Vitals: https://web.dev/vitals/
- Conventional Commits: https://www.conventionalcommits.org/

## 🎯 CRITERIOS DE PROYECTO COMPLETADO

El proyecto está 100% completo cuando:

- [x] Las 35 tareas están implementadas
- [x] Todos los tests pasan (unit, integration, e2e)
- [x] Coverage > 80%
- [x] Lighthouse scores > 90 (todas las categorías)
- [x] Load tests pasan (P95 < 500ms, error rate < 1%)
- [x] Security audit clean (0 vulnerabilidades críticas/altas)
- [x] CI/CD pipeline funcional (deploy automático)
- [x] Documentación completa (README, ARCHITECTURE, API, etc.)
- [x] Monitoring configurado (Sentry, Grafana)
- [x] PWA installable y funcionando offline

## 🚀 SIGUIENTE PASO

**Tu misión**: Implementar las 35 tareas secuencialmente según las instrucciones.

**Acción inmediata**: 
1. Confirma que entendiste este documento
2. Comienza con TASK-001-SECRET-DETECTION.md
3. Reporta progreso después de cada tarea
4. Continúa hasta completar las 35 tareas

---

**Versión**: 1.0  
**Fecha**: 07/11/2025  
**Preparado por**: GitHub Copilot  
**Para**: GPT-5-codex Developer  
**Estado**: READY TO START 🚀
