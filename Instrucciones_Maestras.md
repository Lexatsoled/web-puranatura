# 🤖 INSTRUCCIONES MAESTRAS PARA AGENTES AI

> **Guía Principal de Corrección y Mejora del Proyecto Pureza Naturalis V3**  
> Documento para AI Agents ejecutando el Plan de Acción  
> Fecha: 3 de Noviembre de 2025  
> Versión: 1.0

---

## 📋 Índice

1. [Introducción](#introducción)
2. [Documentos de Referencia](#documentos-de-referencia)
3. [Flujo de Trabajo General](#flujo-de-trabajo-general)
4. [Configuración del Entorno](#configuración-del-entorno)
5. [Proceso de Corrección por Sprint](#proceso-de-corrección-por-sprint)
6. [Guías Modulares](#guías-modulares)
7. [Gates de Calidad](#gates-de-calidad)
8. [Comandos y Herramientas](#comandos-y-herramientas)
9. [Resolución de Problemas](#resolución-de-problemas)
10. [Criterios de Completitud](#criterios-de-completitud)

---

## 1. Introducción

### 1.1 Propósito

Este documento es la **guía maestra** para cualquier agente AI (como tú) que esté ejecutando las correcciones y mejoras del proyecto Pureza Naturalis V3. Contiene el proceso paso a paso, referencias a documentación técnica, y criterios de validación para asegurar que todas las correcciones se implementen correctamente.

### 1.2 Contexto del Proyecto

**Proyecto**: Pureza Naturalis V3  
**Tipo**: E-commerce de productos naturales y terapias holísticas  
**Stack**: React 18.3 + TypeScript 5.7 + Vite 6.2 + Zustand + PostgreSQL  
**Estado Actual**: 75% production-ready  
**Estado Objetivo**: 100% production-ready  
**Problemas Identificados**: 150 (1 crítico, 3 altos, 5 medios, 141 bajos)

### 1.3 Alcance de las Correcciones

- **Sprint 1**: Backend + Autenticación Real (40-60h)
- **Sprint 2**: Seguridad + Performance (12-17h)
- **Sprint 3**: Optimizaciones Medias (8-12h)
- **Sprint 4**: Limpieza Final (4h)

**Total**: 70-98 horas de trabajo técnico

---

## 2. Documentos de Referencia

### 2.1 Documentos Principales (LEER PRIMERO)

| Documento | Propósito | Prioridad |
|-----------|-----------|-----------|
| `DIAGNOSTICO_INICIAL.md` | Estado actual del proyecto, métricas de calidad | 🔴 ALTA |
| `PROBLEMAS_CRITICOS.md` | Lista de 150 problemas priorizados | 🔴 ALTA |
| `PLAN_DE_ACCION.md` | Soluciones técnicas detalladas con código | 🔴 ALTA |
| `Instrucciones_Maestras.md` | Este documento (flujo de trabajo) | 🔴 ALTA |

### 2.2 Guías Modulares por Dominio

| Guía | Contenido | Cuándo Usar |
|------|-----------|-------------|
| `Instrucciones_Frontend.md` | Patrones React, componentes, estado | Sprint 1-3 |
| `Instrucciones_Seguridad.md` | Auth, CSRF, XSS, CSP, sanitización | Sprint 1-2 |
| `Instrucciones_Testing.md` | Unit tests, E2E, coverage | Todos los sprints |
| `Instrucciones_Performance.md` | Bundle, lazy loading, Web Vitals | Sprint 2-3 |
| `Instrucciones_Despliegue.md` | CI/CD, deployment, rollback | Post-correcciones |

### 2.3 Checklist de Validación

| Documento | Propósito |
|-----------|-----------|
| `Checklist_Verificacion.md` | Criterios de aceptación por corrección |

---

## 3. Flujo de Trabajo General

### 3.1 Proceso de Alto Nivel

```text
┌─────────────────────────────────────────────────────────────┐
│                    INICIO DE SPRINT                         │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  1. PREPARACIÓN                                             │
│  ├─ Leer PLAN_DE_ACCION.md para el sprint actual           │
│  ├─ Leer guía modular correspondiente                       │
│  ├─ Crear branch: feature/sprint-X-nombre                   │
│  └─ Verificar que el entorno esté configurado              │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  2. IMPLEMENTACIÓN                                          │
│  ├─ Para cada problema del sprint:                          │
│  │   ├─ Leer solución técnica en PLAN_DE_ACCION.md        │
│  │   ├─ Implementar código                                  │
│  │   ├─ Escribir tests                                      │
│  │   ├─ Ejecutar tests                                      │
│  │   ├─ Validar con checklist                              │
│  │   └─ Commit incremental                                  │
│  └─ Continuar hasta completar todos los problemas          │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  3. VALIDACIÓN                                              │
│  ├─ Ejecutar suite completa de tests                        │
│  ├─ Verificar coverage > 80%                                │
│  ├─ Ejecutar linter y formatter                             │
│  ├─ Build sin errores                                        │
│  └─ Validar con Checklist_Verificacion.md                  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  4. GATE DE CALIDAD                                         │
│  ├─ Todos los tests pasando? ✓                             │
│  ├─ Coverage > 80%? ✓                                       │
│  ├─ Sin errores de linting? ✓                              │
│  ├─ Build exitoso? ✓                                        │
│  └─ Checklist completado? ✓                                │
└─────────────────────────────────────────────────────────────┘
                              ↓
                         ¿Pasa Gate?
                         /        \
                      SÍ          NO
                      /              \
                     ↓                ↓
          ┌─────────────────┐  ┌─────────────────┐
          │  5. MERGE       │  │  VOLVER A 2.    │
          │  └─ PR          │  │  CORREGIR       │
          │  └─ Code Review │  └─────────────────┘
          │  └─ Merge       │
          └─────────────────┘
                    ↓
          ┌─────────────────┐
          │  SPRINT          │
          │  COMPLETADO ✓   │
          └─────────────────┘
```

### 3.2 Principios Fundamentales

1. **Commits Incrementales**: Hacer commit después de cada corrección funcional
2. **Tests Primero**: Escribir tests ANTES de implementar (TDD cuando sea posible)
3. **Validación Continua**: Ejecutar tests después de cada cambio
4. **No Breaking Changes**: Nunca romper funcionalidad existente
5. **Documentar Decisiones**: Comentar código complejo y decisiones técnicas
6. **Rollback Ready**: Cada commit debe ser revertible sin efectos secundarios

---

## 4. Configuración del Entorno

### 4.1 Prerrequisitos

Antes de comenzar, verificar que estén instalados:

```bash
# Verificar versiones
node --version    # >= 18.0.0
npm --version     # >= 9.0.0
git --version     # >= 2.0.0

# PostgreSQL (solo para Sprint 1)
psql --version    # >= 14.0
```

### 4.2 Setup Inicial

```bash
# 1. Clonar/Ubicarse en el proyecto
cd "c:\Users\Usuario\Desktop\Web Puranatura\Pureza-Naturalis-V3"

# 2. Instalar dependencias frontend
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con valores apropiados

# 4. Verificar que el proyecto arranca
npm run dev
# Debe abrir en http://localhost:5173

# 5. Ejecutar tests existentes
npm test
# Debe pasar todos los tests actuales
```

### 4.3 Setup Backend (Sprint 1 únicamente)

```bash
# 1. Crear carpeta backend
mkdir backend
cd backend

# 2. Inicializar proyecto
npm init -y

# 3. Instalar dependencias (ver PLAN_DE_ACCION.md sección 3.1.3.1)
npm install express cors helmet dotenv bcrypt jsonwebtoken pg express-rate-limit express-validator
npm install --save-dev typescript @types/node @types/express @types/bcrypt @types/jsonwebtoken ts-node nodemon jest @types/jest ts-jest supertest @types/supertest

# 4. Configurar TypeScript
# Copiar tsconfig.json desde PLAN_DE_ACCION.md sección 3.1.3.2

# 5. Configurar PostgreSQL
# Crear base de datos: createdb pureza_naturalis
# Ejecutar schema: psql -U pureza_admin -d pureza_naturalis -f schema.sql
```

### 4.4 Verificación del Entorno

```bash
# Checklist de verificación
✓ Node.js >= 18.0.0
✓ npm dependencias instaladas sin errores
✓ .env configurado correctamente
✓ npm run dev funciona (frontend)
✓ npm test pasa tests existentes
✓ PostgreSQL corriendo (Sprint 1)
✓ Base de datos creada (Sprint 1)
```

---

## 5. Proceso de Corrección por Sprint

### 5.1 Sprint 1: Backend + Autenticación Real

**Duración**: 2 semanas (40-60 horas)  
**Branch**: `feature/sprint-1-auth-backend`

#### 5.1.1 Orden de Implementación

**IMPORTANTE**: Seguir este orden estrictamente para evitar dependencias rotas.

```text
Día 1-2: Setup y Base de Datos
├─ 1. Crear carpeta backend y configurar proyecto Node.js
├─ 2. Configurar TypeScript (tsconfig.json)
├─ 3. Crear base de datos PostgreSQL
├─ 4. Ejecutar schema SQL (users, refresh_tokens, auth_audit_log)
└─ 5. Configurar connection pool (database.ts)

Día 3-4: Servicios Core
├─ 6. PasswordService (hash + validación)
├─ 7. TokenService (JWT generation + verification)
└─ 8. AuthService (register + login + refresh + logout)

Día 5-6: API Endpoints
├─ 9. Validation middleware
├─ 10. Rate limiting middleware
├─ 11. Auth routes (6 endpoints)
└─ 12. Server principal (server.ts)

Día 7-8: Seguridad y Middleware
├─ 13. Authentication middleware
├─ 14. Authorization middleware (roles)
└─ 15. Error handling global

Día 9-10: Frontend Integration
├─ 16. API Client con interceptores
├─ 17. AuthService frontend (nuevo)
├─ 18. Actualizar AuthContext
└─ 19. Actualizar tipos User

Día 11: Migración de Datos
├─ 20. Script de migración de usuarios
└─ 21. Ejecutar migración

Día 12-14: Testing
├─ 22. Tests unitarios (PasswordService, TokenService)
├─ 23. Tests de integración (AuthService)
├─ 24. Tests de API (authRoutes)
└─ 25. Validación completa con checklist
```

#### 5.1.2 Instrucciones Detalladas

**Para cada paso**:

1. **Leer**: Buscar la sección correspondiente en `PLAN_DE_ACCION.md`
2. **Copiar**: Copiar el código TypeScript/SQL proporcionado
3. **Adaptar**: Ajustar paths y configuraciones si es necesario
4. **Implementar**: Crear el archivo y pegar el código
5. **Validar**: Ejecutar tests o verificar funcionamiento
6. **Commit**: `git commit -m "feat(sprint-1): Add [componente]"`

**Ejemplo para Paso 6 (PasswordService)**:

```bash
# 1. Leer PLAN_DE_ACCION.md sección 3.1.5.2
# 2. Crear archivo
mkdir -p backend/src/services
touch backend/src/services/PasswordService.ts

# 3. Copiar código desde PLAN_DE_ACCION.md
# (Pegar contenido completo del PasswordService)

# 4. Verificar que compila
cd backend
npm run build

# 5. Ejecutar tests (si existen)
npm test PasswordService

# 6. Commit
git add src/services/PasswordService.ts
git commit -m "feat(sprint-1): Add PasswordService with bcrypt hashing"
```

#### 5.1.3 Gates de Calidad Sprint 1

Antes de marcar Sprint 1 como completo, verificar:

- [ ] Backend servidor arranca sin errores
- [ ] PostgreSQL con 3 tablas creadas
- [ ] 6 endpoints de API responden correctamente
- [ ] POST /api/auth/register funcional
- [ ] POST /api/auth/login funcional con rate limiting
- [ ] POST /api/auth/refresh funcional
- [ ] GET /api/auth/me requiere token
- [ ] Frontend puede registrar usuario
- [ ] Frontend puede hacer login
- [ ] Token refresh automático funciona
- [ ] 41 tests pasando (backend)
- [ ] Coverage > 80%
- [ ] Migración de usuarios ejecutada

**Consultar**: `Instrucciones_Seguridad.md` para detalles adicionales.

---

### 5.2 Sprint 2: Seguridad + Performance

**Duración**: 1 semana (12-17 horas)  
**Branch**: `feature/sprint-2-security-performance`

#### 5.2.1 Problemas a Resolver

1. **HIGH-SEC-002**: Content Security Policy headers
2. **HIGH-SEC-003**: CSRF token real (no placeholder)
3. **HIGH-PERF-001**: Migrar 11 estilos inline a Tailwind

#### 5.2.2 Orden de Implementación

```text
Día 1-2: CSP Headers (4-6h)
├─ 1. Crear middleware securityHeaders.ts
├─ 2. Aplicar en server.ts
├─ 3. Configurar CSP en vite.config.ts (Report-Only)
├─ 4. Probar en navegador (Console sin errores)
└─ 5. Tests de CSP headers

Día 3-4: CSRF Real (6-8h)
├─ 6. Crear endpoint /api/csrf/token en backend
├─ 7. Actualizar hook useCSRFProtection en frontend
├─ 8. Configurar interceptor en apiClient
├─ 9. Tests de CSRF validation
└─ 10. Verificar en requests POST/PUT/DELETE

Día 5: Estilos Inline (2-3h)
├─ 11. Identificar 11 estilos inline en SimpleLayout.tsx
├─ 12. Convertir a clases Tailwind
├─ 13. Verificar UI visualmente idéntica
└─ 14. Ejecutar linter (0 warnings)
```

#### 5.2.3 Instrucciones Detalladas

**HIGH-SEC-002 (CSP)**:

```bash
# 1. Leer PLAN_DE_ACCION.md sección 4.1
# 2. Crear middleware
touch backend/src/middleware/securityHeaders.ts
# Copiar código de sección 4.1.1

# 3. Aplicar en server.ts
# Agregar: app.use(securityHeaders);

# 4. Verificar en navegador
# Abrir DevTools → Network → Ver Response Headers
# Debe mostrar: Content-Security-Policy: default-src 'self'...

# 5. Commit
git commit -m "feat(sprint-2): Add CSP headers middleware"
```

**HIGH-PERF-001 (Estilos Inline)**:

```bash
# 1. Abrir SimpleLayout.tsx
# 2. Buscar cada style={{ ... }}
# 3. Reemplazar con className="..."
# Ejemplo:
#   ANTES: <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50 }}>
#   DESPUÉS: <div className="fixed top-0 left-0 right-0 z-50">

# 4. Verificar visualmente
npm run dev
# Navegar por la app, verificar que todo se vea igual

# 5. Ejecutar linter
npm run lint
# Debe mostrar 0 warnings de inline styles

# 6. Commit
git commit -m "refactor(sprint-2): Convert inline styles to Tailwind in SimpleLayout"
```

#### 5.2.4 Gates de Calidad Sprint 2

- [ ] CSP headers presentes en todas las responses
- [ ] Console del navegador sin errores de CSP
- [ ] CSRF token endpoint /api/csrf/token funcional
- [ ] CSRF token incluido en requests POST/PUT/DELETE
- [ ] 11 estilos inline convertidos a Tailwind
- [ ] 0 warnings de ESLint relacionados con estilos
- [ ] UI visualmente idéntica
- [ ] Tests de seguridad pasando
- [ ] 12 nuevos tests implementados y pasando

**Consultar**: `Instrucciones_Seguridad.md` y `Instrucciones_Performance.md`

---

### 5.3 Sprint 3: Optimizaciones Medias

**Duración**: 1 semana (8-12 horas)  
**Branch**: `feature/sprint-3-optimizations`

#### 5.3.1 Problemas a Resolver

1. **MED-STRUCT-001**: App.tsx missing
2. **MED-STRUCT-002**: Carpetas duplicadas
3. **MED-PERF-002**: Bundle size optimization
4. **MED-SEC-004**: jsdom en cliente (split)
5. **MED-DOCS-001**: Documentación obsoleta

#### 5.3.2 Orden de Implementación

```text
Día 1: Estructura (1.5h)
├─ 1. Verificar/restaurar App.tsx
├─ 2. Hacer backup de carpetas duplicadas
├─ 3. Eliminar carpetas obsoletas
└─ 4. Commit: "refactor(sprint-3): Clean up project structure"

Día 2-3: Bundle Optimization (3-4h)
├─ 5. Instalar rollup-plugin-visualizer
├─ 6. Analizar bundle actual
├─ 7. Configurar manualChunks en vite.config.ts
├─ 8. Implementar lazy loading agresivo
├─ 9. Build y verificar reducción de tamaño
└─ 10. Commit: "perf(sprint-3): Optimize bundle size"

Día 4: jsdom Split (2h)
├─ 11. Crear sanitization.client.ts
├─ 12. Crear sanitization.server.ts
├─ 13. Actualizar imports en componentes
├─ 14. Verificar bundle reducido en 2MB
└─ 15. Commit: "refactor(sprint-3): Split jsdom for client/server"

Día 5: Documentación (1h)
├─ 16. Mover temp_*.txt a docs/archive/
├─ 17. Comprimir archivos antiguos
├─ 18. Crear docs/README.md con índice
└─ 19. Commit: "docs(sprint-3): Clean up obsolete documentation"
```

#### 5.3.3 Instrucciones Detalladas

**MED-PERF-002 (Bundle Size)**:

```bash
# 1. Instalar analizador
npm install -D rollup-plugin-visualizer

# 2. Analizar bundle actual
npm run build
# Abrir dist/stats.html y ver tamaños

# 3. Editar vite.config.ts
# Agregar manualChunks (ver PLAN_DE_ACCION.md sección 5.3)

# 4. Re-build y comparar
npm run build
# Verificar reducción de 15-20%

# 5. Commit
git commit -m "perf(sprint-3): Reduce bundle size with manual chunks"
```

**MED-SEC-004 (jsdom Split)**:

```bash
# 1. Crear archivos separados
touch src/utils/security/sanitization.client.ts
touch src/utils/security/sanitization.server.ts

# 2. Copiar código de PLAN_DE_ACCION.md sección 5.4

# 3. Actualizar imports en componentes
# Buscar: import { ... } from '@/utils/security/sanitization'
# Reemplazar: import { ... } from '@/utils/security/sanitization.client'

# 4. Build y verificar tamaño
npm run build
# Debe mostrar reducción de ~2MB

# 5. Ejecutar tests
npm test
# Tests deben seguir pasando

# 6. Commit
git commit -m "refactor(sprint-3): Split jsdom to reduce client bundle"
```

#### 5.3.4 Gates de Calidad Sprint 3

- [ ] App.tsx existe y funciona
- [ ] Carpetas duplicadas eliminadas
- [ ] Bundle size reducido 15-20%
- [ ] Lazy loading implementado
- [ ] jsdom NO en bundle cliente
- [ ] Bundle reducido ~2MB
- [ ] Tests siguen pasando
- [ ] Documentación archivada
- [ ] docs/README.md creado

**Consultar**: `Instrucciones_Performance.md` y `Instrucciones_Frontend.md`

---

### 5.4 Sprint 4: Limpieza Final

**Duración**: 3 días (4 horas)  
**Branch**: `feature/sprint-4-cleanup`

#### 5.4.1 Problema a Resolver

**LOW-LINT-001 a LOW-LINT-141**: 141 warnings de markdown linting

#### 5.4.2 Implementación

```bash
# 1. Instalar herramientas
npm install -D markdownlint-cli prettier

# 2. Crear configuración .markdownlint.json
# Copiar desde PLAN_DE_ACCION.md sección 6.1.2

# 3. Ejecutar auto-fix
npx markdownlint --fix "**/*.md"
npx prettier --write "**/*.md"

# 4. Verificar cambios
git diff

# 5. Commit si todo está bien
git add .
git commit -m "fix(sprint-4): Auto-fix 141 markdown linting warnings"
```

#### 5.4.3 Gates de Calidad Sprint 4

- [ ] markdownlint-cli instalado
- [ ] .markdownlint.json configurado
- [ ] Auto-fix ejecutado
- [ ] 0 warnings de markdown linting
- [ ] Documentos siguen siendo legibles
- [ ] Cambios commiteados

---

## 6. Guías Modulares

### 6.1 Cuándo Usar Cada Guía

| Guía | Usar Durante | Propósito |
|------|--------------|-----------|
| **Instrucciones_Frontend.md** | Sprint 1, 2, 3 | Patrones React, componentes, hooks, estado |
| **Instrucciones_Seguridad.md** | Sprint 1, 2 | Auth, tokens, sanitización, CSRF, CSP |
| **Instrucciones_Testing.md** | Todos | Escribir tests unitarios, integración, E2E |
| **Instrucciones_Performance.md** | Sprint 2, 3 | Bundle, lazy loading, code splitting |
| **Instrucciones_Despliegue.md** | Post-sprints | CI/CD, deployment, rollback |

### 6.2 Consulta Rápida

**¿Necesitas ayuda con...?**

- **Crear componente React**: → `Instrucciones_Frontend.md`
- **Implementar autenticación**: → `Instrucciones_Seguridad.md`
- **Escribir test unitario**: → `Instrucciones_Testing.md`
- **Optimizar bundle size**: → `Instrucciones_Performance.md`
- **Hacer deploy a staging**: → `Instrucciones_Despliegue.md`

---

## 7. Gates de Calidad

### 7.1 Gates por Sprint

Cada sprint debe pasar estos gates antes de ser considerado completo:

```text
GATE 1: Tests
├─ Todos los tests unitarios pasando
├─ Todos los tests de integración pasando
├─ Todos los tests E2E pasando (si aplica)
└─ Coverage > 80%

GATE 2: Code Quality
├─ 0 errores de TypeScript
├─ 0 errores de ESLint críticos
├─ Warnings < 5
└─ Prettier aplicado

GATE 3: Funcionalidad
├─ Build exitoso sin errores
├─ Aplicación arranca correctamente
├─ Funcionalidad nueva probada manualmente
└─ Sin regresiones (funcionalidad anterior intacta)

GATE 4: Documentación
├─ Código comentado (funciones complejas)
├─ README actualizado si es necesario
├─ Changelog actualizado
└─ Commits con mensajes claros

GATE 5: Seguridad
├─ Sin credenciales hardcodeadas
├─ Variables de entorno usadas correctamente
├─ Sin vulnerabilidades conocidas (npm audit)
└─ Checklist de seguridad completado
```

### 7.2 Comandos de Validación

```bash
# Ejecutar antes de marcar sprint como completo

# 1. Tests
npm test -- --coverage
# Verificar: All tests passed, Coverage > 80%

# 2. Linting
npm run lint
# Verificar: 0 errors

# 3. Type checking
npm run type-check  # o tsc --noEmit
# Verificar: 0 errors

# 4. Build
npm run build
# Verificar: Build completed successfully

# 5. Security audit
npm audit --production
# Verificar: 0 high or critical vulnerabilities

# 6. E2E (si aplica)
npm run test:e2e
# Verificar: All tests passed
```

---

## 8. Comandos y Herramientas

### 8.1 Comandos Esenciales

#### Frontend

```bash
# Desarrollo
npm run dev                    # Iniciar servidor dev (localhost:5173)
npm run build                  # Build para producción
npm run preview                # Preview del build

# Testing
npm test                       # Tests unitarios
npm run test:coverage          # Con coverage
npm run test:watch             # Watch mode
npm run test:e2e               # E2E con Playwright
npm run test:e2e:ui            # E2E con UI

# Code Quality
npm run lint                   # ESLint
npm run lint:fix               # Auto-fix
npm run format                 # Prettier
npm run type-check             # TypeScript check
```

#### Backend

```bash
cd backend

# Desarrollo
npm run dev                    # Nodemon con ts-node
npm run build                  # Compilar a dist/
npm start                      # Ejecutar dist/server.js

# Testing
npm test                       # Jest tests
npm run test:coverage          # Con coverage
npm run test:watch             # Watch mode

# Database
npm run migrate:up             # Aplicar migraciones
npm run migrate:down           # Revertir migraciones
npm run migrate:users          # Migrar usuarios antiguos
```

#### Git

```bash
# Branches
git checkout -b feature/sprint-X-nombre
git push -u origin feature/sprint-X-nombre

# Commits (Conventional Commits)
git commit -m "feat(sprint-1): Add PasswordService"
git commit -m "fix(sprint-2): Correct CSP policy"
git commit -m "refactor(sprint-3): Split jsdom"
git commit -m "test(sprint-1): Add AuthService tests"
git commit -m "docs(sprint-4): Update README"

# Merge
git checkout develop
git merge feature/sprint-X-nombre
git push origin develop
```

### 8.2 Herramientas de Debugging

```bash
# Ver logs del servidor
npm run dev | tee logs/dev.log

# Analizar bundle
npm run build
npx vite-bundle-visualizer

# Ver coverage HTML
npm run test:coverage
open coverage/lcov-report/index.html

# PostgreSQL queries
psql -U pureza_admin -d pureza_naturalis
# Dentro de psql:
# \dt - Listar tablas
# \d users - Describir tabla users
# SELECT * FROM users LIMIT 5;
```

---

## 9. Resolución de Problemas

### 9.1 Problemas Comunes

#### Problema: "Module not found"

```bash
# Solución 1: Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install

# Solución 2: Verificar imports
# Asegurarse de usar alias correcto:
import { User } from '@/types/User'  # ✓ Correcto
import { User } from '../types/User' # ✗ Evitar
```

#### Problema: Tests fallan después de cambio

```bash
# 1. Verificar que cambio no rompió contratos
# 2. Actualizar mocks si es necesario
# 3. Ejecutar tests individualmente
npm test -- --testNamePattern="AuthService"

# 4. Ver output detallado
npm test -- --verbose

# 5. Si todo falla, revertir cambio
git checkout -- archivo-problemático.ts
```

#### Problema: Backend no arranca

```bash
# 1. Verificar que PostgreSQL está corriendo
pg_isready

# 2. Verificar conexión a BD
psql -U pureza_admin -d pureza_naturalis -c "SELECT 1"

# 3. Verificar variables de entorno
cat backend/.env

# 4. Ver logs completos
cd backend
npm run dev 2>&1 | tee error.log
```

#### Problema: Build falla

```bash
# 1. Limpiar cache
rm -rf dist/ node_modules/.vite

# 2. Verificar errores de TypeScript
npm run type-check

# 3. Build con más información
npm run build -- --debug

# 4. Verificar espacio en disco
df -h
```

### 9.2 Dónde Buscar Ayuda

1. **PLAN_DE_ACCION.md**: Soluciones técnicas completas
2. **PROBLEMAS_CRITICOS.md**: Descripción del problema original
3. **Guías Modulares**: Patrones específicos por dominio
4. **Documentación del Stack**:
   - React: <https://react.dev>
   - TypeScript: <https://www.typescriptlang.org/docs>
   - Vite: <https://vitejs.dev>
   - Zustand: <https://docs.pmnd.rs/zustand>
   - Express: <https://expressjs.com>
   - PostgreSQL: <https://www.postgresql.org/docs>

---

## 10. Criterios de Completitud

### 10.1 Proyecto Completo al 100%

El proyecto se considera **100% completo** cuando:

#### Funcionalidad

- [ ] Todos los 150 problemas resueltos
- [ ] Sistema de autenticación funcional con backend real
- [ ] Todas las páginas cargan correctamente
- [ ] Carrito de compras funciona
- [ ] Navegación sin errores

#### Tests

- [ ] 61+ tests implementados y pasando
- [ ] Coverage > 80% (unit tests)
- [ ] Tests E2E cubren flujos críticos
- [ ] 0 tests flakey

#### Seguridad

- [ ] Contraseñas hasheadas con bcrypt
- [ ] JWT tokens implementados
- [ ] CSRF protection activo
- [ ] CSP headers configurados
- [ ] XSS protection funcionando
- [ ] Rate limiting activo
- [ ] npm audit sin vulnerabilidades críticas

#### Performance

- [ ] Bundle size < 500KB
- [ ] First Contentful Paint < 1.5s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Time to Interactive < 3s
- [ ] Lazy loading implementado
- [ ] Code splitting correcto

#### Code Quality

- [ ] 0 errores de TypeScript
- [ ] 0 errores de ESLint
- [ ] Warnings < 10
- [ ] Prettier aplicado
- [ ] Código comentado apropiadamente

#### Documentación

- [ ] README.md actualizado
- [ ] CHANGELOG.md completo
- [ ] Todos los .md sin warnings de linting
- [ ] API documentada
- [ ] Deployment guide disponible

### 10.2 Sign-Off Final

**Checklist de aprobación**:

- [ ] Tech Lead: ✓ Arquitectura y código revisados
- [ ] Security Lead: ✓ Auditoría de seguridad pasada
- [ ] QA Lead: ✓ Tests y calidad verificados
- [ ] Todos los sprints completados
- [ ] Gates de calidad pasados
- [ ] Checklist_Verificacion.md completado 100%

### 10.3 Entregables Finales

Al finalizar, debes tener:

1. **Código**:
   - Branch `develop` con todos los cambios merged
   - Tag `v3.0.0-production-ready`

2. **Documentación**:
   - DIAGNOSTICO_INICIAL.md ✓
   - PROBLEMAS_CRITICOS.md ✓
   - PLAN_DE_ACCION.md ✓
   - Instrucciones_Maestras.md ✓
   - 5 Guías modulares ✓
   - Checklist_Verificacion.md ✓
   - README.md actualizado ✓
   - CHANGELOG.md completo ✓

3. **Tests**:
   - 61+ tests implementados
   - Coverage report (HTML)
   - E2E test results

4. **Build**:
   - Dist/ folder listo para deploy
   - Backend compilado en dist/
   - Sourcemaps generados

---

## 📌 Recordatorios Finales

### Para AI Agents

1. **Sé metódico**: Sigue el orden especificado
2. **Valida constantemente**: Ejecuta tests después de cada cambio
3. **Documenta decisiones**: Comenta código complejo
4. **No improvises**: Usa el código del PLAN_DE_ACCION.md
5. **Pregunta si hay duda**: Consulta guías modulares
6. **Commits pequeños**: Uno por funcionalidad
7. **No rompas nada**: Tests deben seguir pasando
8. **Checklist siempre**: Usa Checklist_Verificacion.md

### Mensaje de Motivación

Este proyecto está en **excelente estado** (8.2/10). Solo necesita:
- Autenticación real (Sprint 1)
- Headers de seguridad (Sprint 2)
- Optimizaciones menores (Sprint 3-4)

**Con estas correcciones → 100% Production-Ready** 🚀

---

**Estado**: ✅ **GUÍA MAESTRA COMPLETA Y LISTA PARA USO**
