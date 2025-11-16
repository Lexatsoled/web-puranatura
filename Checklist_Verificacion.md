# ✅ CHECKLIST DE VERIFICACIÓN

> Checklist completo para validar todas las correcciones implementadas  
> Organizado por Sprint y Problema - Criterios de Aceptación claros

---

## 📋 Índice

- [Sprint 1: Backend + Autenticación](#sprint-1-backend--autenticación)
- [Sprint 2: Seguridad + Performance](#sprint-2-seguridad--performance)
- [Sprint 3: Estructura + Optimizaciones](#sprint-3-estructura--optimizaciones)
- [Sprint 4: Linting Automático](#sprint-4-linting-automático)
- [Validación Final Pre-Producción](#validación-final-pre-producción)

---

## Sprint 1: Backend + Autenticación

### ✅ CRIT-SEC-001: Sistema de Autenticación Real

**Estado**: [ ] Pendiente | [ ] En Progreso | [ ] Completado | [ ] Validado

#### Backend Setup

- [ ] PostgreSQL instalado y configurado
  - [ ] Base de datos `puranatura_db` creada
  - [ ] Usuario con permisos correctos
  - [ ] Pool de conexiones funcionando (min: 2, max: 20)
  - [ ] Test de conexión exitoso: `npm run db:test`

- [ ] Tablas creadas correctamente
  ```sql
  -- Verificar tablas
  SELECT table_name FROM information_schema.tables 
  WHERE table_schema = 'public';
  ```
  - [ ] `users` (7 columnas: id, email, password_hash, name, role, created_at, updated_at)
  - [ ] `refresh_tokens` (5 columnas: id, user_id, token, expires_at, created_at)
  - [ ] `auth_audit_log` (7 columnas: id, user_id, action, ip_address, user_agent, details, created_at)
  - [ ] Índices creados (4 totales)

#### Servicios Backend

- [ ] **PasswordService** funcionando
  - [ ] `hash()`: genera hash bcrypt correcto (cost 12)
  - [ ] `verify()`: verifica contraseña vs hash
  - [ ] `validateStrength()`: valida 5 criterios (longitud, mayúsculas, minúsculas, números, especiales)
  - [ ] Tests pasando: `npm run test -- PasswordService`

- [ ] **TokenService** funcionando
  - [ ] `generateAccessToken()`: expira en 15 minutos
  - [ ] `generateRefreshToken()`: expira en 7 días
  - [ ] `verifyAccessToken()`: valida token correctamente
  - [ ] `verifyRefreshToken()`: valida refresh token
  - [ ] Tests pasando: `npm run test -- TokenService`

- [ ] **AuthService** funcionando
  - [ ] `register()`: crea usuario nuevo con hash correcto
  - [ ] `login()`: autentica usuario y genera tokens
  - [ ] `refresh()`: renueva access token
  - [ ] `logout()`: revoca refresh token
  - [ ] Tests pasando: `npm run test -- AuthService`

#### API Endpoints

- [ ] **POST /api/auth/register**
  ```bash
  # Test manual
  curl -X POST http://localhost:3000/api/auth/register \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"Password123!","name":"Test User"}'
  ```
  - [ ] Status 201 con email nuevo
  - [ ] Status 409 con email duplicado
  - [ ] Status 400 con datos inválidos
  - [ ] Devuelve: `{ user, accessToken, refreshToken }`
  - [ ] Password hasheado en DB (NO texto plano)

- [ ] **POST /api/auth/login**
  ```bash
  curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"Password123!"}'
  ```
  - [ ] Status 200 con credenciales correctas
  - [ ] Status 401 con credenciales incorrectas
  - [ ] Status 429 después de 5 intentos (rate limiting)
  - [ ] Devuelve tokens válidos
  - [ ] Registra en audit log

- [ ] **POST /api/auth/refresh**
  ```bash
  curl -X POST http://localhost:3000/api/auth/refresh \
    -H "Content-Type: application/json" \
    -d '{"refreshToken":"<refresh_token>"}'
  ```
  - [ ] Status 200 con refresh token válido
  - [ ] Status 401 con refresh token inválido/expirado
  - [ ] Genera nuevo access token
  - [ ] Refresh token no reutilizable (rotation)

- [ ] **POST /api/auth/logout**
  ```bash
  curl -X POST http://localhost:3000/api/auth/logout \
    -H "Content-Type: application/json" \
    -d '{"refreshToken":"<refresh_token>"}'
  ```
  - [ ] Status 200
  - [ ] Refresh token eliminado de DB
  - [ ] Registra en audit log

#### Middlewares

- [ ] **authenticate** (protección de rutas)
  ```bash
  # Sin token
  curl http://localhost:3000/api/protected
  # Debe devolver 401
  
  # Con token
  curl http://localhost:3000/api/protected \
    -H "Authorization: Bearer <access_token>"
  # Debe devolver 200
  ```
  - [ ] Rechaza requests sin token (401)
  - [ ] Rechaza tokens inválidos (401)
  - [ ] Rechaza tokens expirados (401)
  - [ ] Acepta tokens válidos (200)
  - [ ] Anexa `req.user` con payload

- [ ] **rateLimitMiddleware** (5 intentos / 15 min)
  ```bash
  # Hacer 6 requests rápidos
  for i in {1..6}; do
    curl -X POST http://localhost:3000/api/auth/login \
      -H "Content-Type: application/json" \
      -d '{"email":"test@example.com","password":"wrong"}';
  done
  ```
  - [ ] Permite primeros 5 intentos
  - [ ] Bloquea intento #6 con 429
  - [ ] Header `X-RateLimit-Remaining` correcto
  - [ ] Resetea después de 15 minutos

#### Frontend Integration

- [ ] **AuthService** (frontend) configurado
  - [ ] `api.ts` con axios interceptor
  - [ ] Tokens guardados en localStorage
  - [ ] Auto-refresh al recibir 401
  - [ ] Logout al fallar refresh

- [ ] **AuthContext** funcionando
  - [ ] `useAuth()` disponible globalmente
  - [ ] `login()`: actualiza estado del user
  - [ ] `logout()`: limpia estado y tokens
  - [ ] `isAuthenticated` refleja estado correcto

- [ ] **Flujo completo Login**
  1. [ ] Abrir `/login`
  2. [ ] Ingresar email y contraseña
  3. [ ] Click en "Iniciar Sesión"
  4. [ ] Verificar loading state
  5. [ ] Redirige a `/` al éxito
  6. [ ] User menu visible con nombre
  7. [ ] Token en localStorage

- [ ] **Flujo completo Logout**
  1. [ ] Click en user menu
  2. [ ] Click en "Cerrar Sesión"
  3. [ ] Redirige a `/login`
  4. [ ] localStorage limpio
  5. [ ] User menu no visible

#### Data Migration

- [ ] Script de migración ejecutado
  ```bash
  npm run migrate:users
  ```
  - [ ] Usuarios antiguos migrados a nueva tabla
  - [ ] Contraseñas re-hasheadas con bcrypt
  - [ ] No hay usuarios con contraseñas en texto plano
  - [ ] Backup pre-migración disponible

#### Tests

- [ ] **Tests Unitarios (41 backend)**
  ```bash
  npm run test -- --coverage backend/
  ```
  - [ ] PasswordService: 10 tests ✅
  - [ ] TokenService: 8 tests ✅
  - [ ] AuthService: 12 tests ✅
  - [ ] AuthMiddleware: 6 tests ✅
  - [ ] RateLimitMiddleware: 5 tests ✅
  - [ ] **Cobertura > 80%**

- [ ] **Tests Integración (12 frontend)**
  ```bash
  npm run test -- AuthContext LoginPage
  ```
  - [ ] AuthContext: 6 tests ✅
  - [ ] LoginPage: 6 tests ✅

- [ ] **Tests E2E (3 tests)**
  ```bash
  npm run test:e2e -- auth-flow
  ```
  - [ ] Registro completo ✅
  - [ ] Login y logout ✅
  - [ ] Refresh token automático ✅

#### Acceptance Criteria

- [ ] ✅ NO hay autenticación simulada
- [ ] ✅ Contraseñas hasheadas con bcrypt (cost 12)
- [ ] ✅ JWT con expiración (access: 15min, refresh: 7 días)
- [ ] ✅ Refresh token rotation implementado
- [ ] ✅ Rate limiting funcional (5 intentos / 15 min)
- [ ] ✅ Audit logging completo
- [ ] ✅ Frontend integrado correctamente
- [ ] ✅ Tests pasando (41 backend + 12 frontend + 3 E2E = 56 tests)
- [ ] ✅ CVSS 9.8 → 0.0 (problema resuelto)

**Firma**: ___________ | Fecha: ___________ | Revisor: ___________

---

## Sprint 2: Seguridad + Performance

### ✅ HIGH-SEC-002: Content Security Policy

**Estado**: [ ] Pendiente | [ ] En Progreso | [ ] Completado | [ ] Validado

#### Configuración CSP

- [ ] Middleware `helmet` instalado
  ```bash
  npm list helmet
  # Debe mostrar versión instalada
  ```

- [ ] CSP headers configurados en backend
  ```typescript
  // Verificar en backend/src/middleware/security.middleware.ts
  ```
  - [ ] `default-src 'self'`
  - [ ] `script-src` con fuentes permitidas
  - [ ] `style-src` con fuentes permitidas
  - [ ] `img-src` permite https: y data:
  - [ ] `connect-src` con API URL
  - [ ] `frame-src 'none'`
  - [ ] `object-src 'none'`

#### Validación

- [ ] **Verificar headers en navegador**
  1. [ ] Abrir DevTools → Network
  2. [ ] Cargar página principal
  3. [ ] Verificar Response Headers:
     - [ ] `Content-Security-Policy` presente
     - [ ] `X-Content-Type-Options: nosniff`
     - [ ] `X-Frame-Options: DENY`
     - [ ] `Strict-Transport-Security`
     - [ ] `X-XSS-Protection: 1; mode=block`

- [ ] **Test de violaciones CSP**
  ```javascript
  // Intentar inyectar script inline (debe ser bloqueado)
  document.body.innerHTML = '<script>alert("XSS")</script>';
  ```
  - [ ] Console muestra error CSP
  - [ ] Script NO se ejecuta

#### Tests

- [ ] Tests de CSP headers (2 tests)
  ```bash
  npm run test -- security.middleware
  ```
  - [ ] Headers presentes en respuesta
  - [ ] Valores correctos configurados

#### Acceptance Criteria

- [ ] ✅ CSP headers configurados
- [ ] ✅ Scripts inline bloqueados
- [ ] ✅ Solo fuentes permitidas pueden cargar recursos
- [ ] ✅ Tests pasando (2 tests)

**Firma**: ___________ | Fecha: ___________ | Revisor: ___________

---

### ✅ HIGH-SEC-003: CSRF Protection Real

**Estado**: [ ] Pendiente | [ ] En Progreso | [ ] Completado | [ ] Validado

#### Backend Implementation

- [ ] **CSRFService** implementado
  - [ ] `generateToken()`: genera token aleatorio de 64 chars
  - [ ] `validateToken()`: verifica y revoca token
  - [ ] `cleanExpiredTokens()`: limpieza automática cada 10 min
  - [ ] Tokens expiran en 1 hora

- [ ] **Middleware CSRF** funcionando
  ```typescript
  // Verificar en backend/src/middleware/csrf.middleware.ts
  ```
  - [ ] GET/HEAD/OPTIONS no requieren token
  - [ ] POST/PUT/DELETE/PATCH requieren token
  - [ ] Header `X-CSRF-Token` obligatorio
  - [ ] Status 403 si falta o es inválido

- [ ] **Endpoint GET /api/csrf-token**
  ```bash
  curl http://localhost:3000/api/csrf-token
  # Debe devolver: {"csrfToken":"..."}
  ```
  - [ ] Status 200
  - [ ] Devuelve token válido
  - [ ] Token almacenado en servidor

#### Frontend Integration

- [ ] **Hook useCSRFProtection** funcionando
  ```typescript
  const { token, isLoading, error, refreshToken } = useCSRFProtection();
  ```
  - [ ] Carga token automáticamente al mount
  - [ ] `refreshToken()` obtiene nuevo token
  - [ ] Maneja errores correctamente

- [ ] **Axios interceptor** configurado
  ```typescript
  // Verificar en frontend/src/api/api.ts
  ```
  - [ ] Token anexado en header `X-CSRF-Token`
  - [ ] Solo en métodos POST/PUT/DELETE/PATCH
  - [ ] GET no incluye token

#### Validación

- [ ] **Test sin token CSRF**
  ```bash
  # Intentar POST sin token
  curl -X POST http://localhost:3000/api/products \
    -H "Content-Type: application/json" \
    -d '{"name":"Test"}'
  # Debe devolver 403
  ```
  - [ ] Status 403
  - [ ] Mensaje: "Token CSRF requerido"

- [ ] **Test con token CSRF válido**
  ```bash
  # 1. Obtener token
  TOKEN=$(curl -s http://localhost:3000/api/csrf-token | jq -r '.csrfToken')
  
  # 2. Usar token
  curl -X POST http://localhost:3000/api/products \
    -H "Content-Type: application/json" \
    -H "X-CSRF-Token: $TOKEN" \
    -d '{"name":"Test"}'
  # Debe devolver 201
  ```
  - [ ] Status 201 (o esperado)
  - [ ] Request procesado correctamente

- [ ] **Test con token expirado**
  ```bash
  # Usar token de hace > 1 hora
  curl -X POST http://localhost:3000/api/products \
    -H "X-CSRF-Token: expired_token" \
    -d '{"name":"Test"}'
  # Debe devolver 403
  ```
  - [ ] Status 403
  - [ ] Mensaje: "Token CSRF inválido o expirado"

- [ ] **Test de reutilización (one-time use)**
  ```bash
  # Usar mismo token dos veces
  TOKEN=$(curl -s http://localhost:3000/api/csrf-token | jq -r '.csrfToken')
  curl -X POST http://localhost:3000/api/products -H "X-CSRF-Token: $TOKEN" -d '{}'
  curl -X POST http://localhost:3000/api/products -H "X-CSRF-Token: $TOKEN" -d '{}'
  # Segunda request debe devolver 403
  ```
  - [ ] Primera request exitosa
  - [ ] Segunda request rechazada (403)

#### Tests

- [ ] Tests de CSRFService (6 tests)
  ```bash
  npm run test -- CSRFService
  ```
  - [ ] Generación de token
  - [ ] Validación de token
  - [ ] Expiración de token
  - [ ] Limpieza automática
  - [ ] One-time use
  - [ ] Token inválido

- [ ] Tests de middleware (4 tests)
  ```bash
  npm run test -- csrf.middleware
  ```
  - [ ] GET sin token (OK)
  - [ ] POST sin token (403)
  - [ ] POST con token válido (OK)
  - [ ] POST con token inválido (403)

- [ ] Tests frontend (2 tests)
  ```bash
  npm run test -- useCSRFProtection
  ```
  - [ ] Hook carga token
  - [ ] Interceptor anexa token

#### Acceptance Criteria

- [ ] ✅ Tokens CSRF en todas las mutaciones
- [ ] ✅ Backend valida tokens correctamente
- [ ] ✅ Tokens de un solo uso (revocados al usar)
- [ ] ✅ Expiración en 1 hora
- [ ] ✅ Limpieza automática cada 10 minutos
- [ ] ✅ Frontend integrado (hook + interceptor)
- [ ] ✅ Tests pasando (6 + 4 + 2 = 12 tests)

**Firma**: ___________ | Fecha: ___________ | Revisor: ___________

---

### ✅ HIGH-PERF-001: Estilos Inline a Tailwind

**Estado**: [ ] Pendiente | [ ] En Progreso | [ ] Completado | [ ] Validado

#### Conversión de Estilos

- [ ] **Archivos convertidos** (11 archivos)
  1. [ ] `src/components/layout/Header.tsx`
  2. [ ] `src/components/layout/HeaderSimple.tsx`
  3. [ ] `src/components/common/SearchBar.tsx`
  4. [ ] `src/components/common/ProductCard.tsx`
  5. [ ] `src/components/common/ProductImage.tsx`
  6. [ ] `src/components/common/ErrorBoundary.tsx`
  7. [ ] `src/components/common/Loader.tsx`
  8. [ ] `src/components/common/Notification.tsx`
  9. [ ] `src/pages/ProductsPage.tsx`
  10. [ ] `src/pages/ProductDetailPage.tsx`
  11. [ ] `src/pages/StorePage.tsx`

#### Verificación por Archivo

**Para cada archivo**:

- [ ] NO contiene atributo `style={{...}}`
  ```bash
  # Buscar estilos inline
  grep -n "style={{" src/components/layout/Header.tsx
  # Debe devolver: no matches
  ```

- [ ] Usa clases Tailwind equivalentes
  ```typescript
  // Antes: style={{ display: 'flex', justifyContent: 'center' }}
  // Después: className="flex justify-center"
  ```

- [ ] Estilos responsivos correctos
  ```typescript
  // Ejemplo: className="text-sm md:text-base lg:text-lg"
  ```

- [ ] Componente renderiza correctamente
  ```bash
  npm run dev
  # Abrir navegador y verificar visualmente
  ```

#### Validación Global

- [ ] **Buscar estilos inline restantes**
  ```bash
  grep -r "style={{" src/ --include="*.tsx" --include="*.jsx"
  # Debe devolver: 0 resultados (excepto comentarios)
  ```

- [ ] **Verificar warnings ESLint**
  ```bash
  npm run lint
  # Buscar: react/no-inline-styles
  # Debe tener 0 warnings de este tipo
  ```

- [ ] **Build exitoso**
  ```bash
  npm run build
  # Debe completar sin errores
  ```

#### Tests Visuales

- [ ] **Desktop** (1920x1080)
  1. [ ] Home page se ve correctamente
  2. [ ] Productos page se ve correctamente
  3. [ ] Detalle de producto se ve correctamente
  4. [ ] Header con todos los elementos visibles
  5. [ ] Footer completo

- [ ] **Tablet** (768x1024)
  1. [ ] Layout responsivo funciona
  2. [ ] Menú mobile activado
  3. [ ] Productos en grid 2 columnas
  4. [ ] Imágenes redimensionadas

- [ ] **Mobile** (375x667)
  1. [ ] Todo el contenido visible
  2. [ ] Botones con tamaño táctil correcto
  3. [ ] Texto legible
  4. [ ] Scroll suave

#### Tests Automatizados

- [ ] Tests de componentes actualizados (11 tests)
  ```bash
  npm run test -- Header SearchBar ProductCard
  ```
  - [ ] Componentes renderizan sin errores
  - [ ] Clases Tailwind aplicadas correctamente

#### Acceptance Criteria

- [ ] ✅ 0 estilos inline en JSX (eliminar 141)
- [ ] ✅ 100% Tailwind CSS
- [ ] ✅ Responsive design funcional
- [ ] ✅ Build sin warnings
- [ ] ✅ Tests visuales pasando
- [ ] ✅ 141 warnings ESLint eliminados

**Firma**: ___________ | Fecha: ___________ | Revisor: ___________

---

## Sprint 3: Estructura + Optimizaciones

### ✅ MED-STRUCT-001: Estructura de App.tsx

**Estado**: [ ] Pendiente | [ ] En Progreso | [ ] Completado | [ ] Validado

#### Refactorización

- [ ] **SimpleLayout.tsx** aislado
  ```typescript
  // src/components/layout/SimpleLayout.tsx
  ```
  - [ ] Solo contiene estructura layout
  - [ ] Header, Outlet, Footer
  - [ ] NO contiene lógica de routing

- [ ] **App.tsx** limpio
  ```typescript
  // src/App.tsx
  ```
  - [ ] Solo providers (AuthProvider, ErrorBoundary)
  - [ ] RouterProvider con rutas
  - [ ] < 50 líneas de código
  - [ ] NO contiene componentes inline

- [ ] **routes.tsx** separado
  ```typescript
  // src/router/routes.tsx
  ```
  - [ ] Todas las rutas definidas aquí
  - [ ] Lazy loading aplicado
  - [ ] Suspense con fallback

#### Validación

- [ ] **App.tsx estructura correcta**
  ```typescript
  // Debe seguir este patrón:
  function App() {
    return (
      <ErrorBoundary>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </ErrorBoundary>
    );
  }
  ```

- [ ] **Routing funciona correctamente**
  ```bash
  # Navegar a cada ruta
  npm run dev
  ```
  1. [ ] `/` → HomePage
  2. [ ] `/productos` → ProductsPage
  3. [ ] `/productos/:id` → ProductDetailPage
  4. [ ] `/carrito` → CartPage
  5. [ ] `/checkout` → CheckoutPage
  6. [ ] `/perfil` → ProfilePage

- [ ] **Lazy loading funciona**
  ```bash
  # Abrir DevTools → Network
  # Navegar entre páginas
  # Verificar que cada página carga su chunk por separado
  ```
  - [ ] `HomePage-[hash].js` carga al visitar `/`
  - [ ] `ProductsPage-[hash].js` carga al visitar `/productos`
  - [ ] etc.

#### Tests

- [ ] Tests de App.tsx (3 tests)
  ```bash
  npm run test -- App.test
  ```
  - [ ] Renderiza sin errores
  - [ ] Providers funcionan correctamente
  - [ ] Routing funcional

#### Acceptance Criteria

- [ ] ✅ App.tsx < 50 líneas
- [ ] ✅ SimpleLayout aislado
- [ ] ✅ Rutas en archivo separado
- [ ] ✅ Lazy loading implementado
- [ ] ✅ Tests pasando (3 tests)

**Firma**: ___________ | Fecha: ___________ | Revisor: ___________

---

### ✅ MED-STRUCT-002: Carpetas Duplicadas

**Estado**: [ ] Pendiente | [ ] En Progreso | [ ] Completado | [ ] Validado

#### Identificación

- [ ] **Listar carpetas duplicadas**
  ```bash
  # Buscar carpetas con nombres similares
  find . -type d -name "*pureza*" -o -name "*puranatura*"
  ```
  - [ ] `Web Pureza Naturalis nueva/`
  - [ ] `web-puranatura---terapias-naturales/`
  - [ ] `web-puranatura---terapias-naturales - copia/`

#### Decisión

- [ ] **Determinar carpeta activa**
  - [ ] `Pureza-Naturalis-V3/` → MANTENER (versión actual)
  - [ ] Resto → ARCHIVAR o ELIMINAR

#### Limpieza

- [ ] **Backup de carpetas obsoletas**
  ```bash
  # Crear archivo antes de eliminar
  tar -czf obsolete-folders-backup.tar.gz \
    "Web Pureza Naturalis nueva/" \
    "web-puranatura---terapias-naturales/" \
    "web-puranatura---terapias-naturales - copia/"
  ```
  - [ ] Backup creado: `obsolete-folders-backup.tar.gz`
  - [ ] Tamaño del backup verificado

- [ ] **Eliminar carpetas obsoletas**
  ```bash
  rm -rf "Web Pureza Naturalis nueva/"
  rm -rf "web-puranatura---terapias-naturales/"
  rm -rf "web-puranatura---terapias-naturales - copia/"
  ```
  - [ ] Carpetas eliminadas
  - [ ] Solo queda `Pureza-Naturalis-V3/`

#### Validación

- [ ] **Verificar workspace limpio**
  ```bash
  ls -la
  # Debe mostrar solo:
  # - Pureza-Naturalis-V3/
  # - docs/
  # - tools/
  # - obsolete-folders-backup.tar.gz (si se creó)
  ```

- [ ] **Build funciona correctamente**
  ```bash
  cd Pureza-Naturalis-V3
  npm run build
  # Debe completar sin errores
  ```

#### Acceptance Criteria

- [ ] ✅ Solo 1 carpeta de proyecto activa
- [ ] ✅ Carpetas obsoletas eliminadas o archivadas
- [ ] ✅ Backup creado antes de eliminar
- [ ] ✅ Build exitoso después de limpieza

**Firma**: ___________ | Fecha: ___________ | Revisor: ___________

---

### ✅ MED-PERF-001: Bundle Size Optimization

**Estado**: [ ] Pendiente | [ ] En Progreso | [ ] Completado | [ ] Validado

#### Configuración

- [ ] **Vite config optimizado**
  ```typescript
  // vite.config.ts
  ```
  - [ ] `rollup-plugin-visualizer` instalado
  - [ ] `manualChunks` configurado
  - [ ] `terserOptions` con drop_console
  - [ ] `chunkSizeWarningLimit: 500`

- [ ] **Manual chunks definidos**
  ```typescript
  manualChunks: {
    'react-vendor': ['react', 'react-dom', 'react-router-dom'],
    'state-vendor': ['zustand', 'immer'],
    'ui-vendor': ['clsx', 'dompurify']
  }
  ```

#### Análisis

- [ ] **Generar reporte de bundle**
  ```bash
  npm run build
  # Debe abrir stats.html automáticamente
  ```

- [ ] **Verificar tamaños**
  ```bash
  ls -lh dist/assets/
  # Revisar tamaños de chunks
  ```
  - [ ] `index-[hash].js` < 150KB (gzipped)
  - [ ] `react-vendor-[hash].js` < 150KB
  - [ ] `state-vendor-[hash].js` < 50KB
  - [ ] `ui-vendor-[hash].js` < 50KB
  - [ ] **Total bundle < 300KB (gzipped)**

#### Optimizaciones

- [ ] **Tree shaking verificado**
  ```bash
  # Buscar código no utilizado en bundle
  # Usar stats.html para identificar dependencias pesadas
  ```
  - [ ] No hay dependencias no usadas
  - [ ] Imports específicos (no wildcard)

- [ ] **Dead code eliminado**
  ```bash
  npm run build -- --mode production
  # console.logs eliminados automáticamente
  ```
  - [ ] No hay `console.log` en producción
  - [ ] No hay `debugger` statements

#### Validación

- [ ] **Lighthouse Performance**
  ```bash
  lighthouse http://localhost:5173 --view
  ```
  - [ ] Performance Score > 90
  - [ ] FCP < 1.8s
  - [ ] LCP < 2.5s
  - [ ] TBT < 200ms

- [ ] **Bundle Buddy Analysis**
  - [ ] No hay duplicación de módulos
  - [ ] Dependencias compartidas correctamente

#### Tests

- [ ] Build performance test
  ```bash
  time npm run build
  # Debe completar en < 30 segundos
  ```

#### Acceptance Criteria

- [ ] ✅ Bundle total < 300KB (gzipped)
- [ ] ✅ Chunks individuales < 150KB
- [ ] ✅ Tree shaking activo
- [ ] ✅ Dead code eliminado
- [ ] ✅ Performance Score > 90

**Firma**: ___________ | Fecha: ___________ | Revisor: ___________

---

### ✅ MED-TEST-001: Separar jsdom de Playwright

**Estado**: [ ] Pendiente | [ ] En Progreso | [ ] Completado | [ ] Validado

#### Configuración

- [ ] **vitest.config.ts** correcto
  ```typescript
  // vitest.config.ts
  test: {
    environment: 'jsdom', // Para componentes React
    include: ['**/*.test.{ts,tsx}']
  }
  ```

- [ ] **playwright.config.ts** correcto
  ```typescript
  // playwright.config.ts
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:5173'
  }
  ```

#### Estructura de Archivos

- [ ] **Tests unitarios en src/**
  ```bash
  find src/ -name "*.test.ts" -o -name "*.test.tsx"
  # Debe listar todos los tests unitarios
  ```
  - [ ] Usan `@testing-library/react`
  - [ ] Environment: `jsdom`

- [ ] **Tests E2E en e2e/**
  ```bash
  ls e2e/
  # Debe mostrar:
  # - auth-flow.spec.ts
  # - purchase-flow.spec.ts
  # - product-search.spec.ts
  ```
  - [ ] Usan `@playwright/test`
  - [ ] No importan React Testing Library

#### Validación

- [ ] **Tests unitarios funcionan**
  ```bash
  npm run test:run
  ```
  - [ ] Todos los tests pasan
  - [ ] jsdom disponible
  - [ ] Componentes renderizan correctamente

- [ ] **Tests E2E funcionan**
  ```bash
  npm run test:e2e
  ```
  - [ ] Playwright lanza navegador
  - [ ] Tests de flujos completos pasan
  - [ ] NO usa jsdom

- [ ] **Comandos separados**
  ```json
  // package.json
  {
    "scripts": {
      "test": "vitest",              // Solo unitarios
      "test:run": "vitest run",      // Solo unitarios
      "test:e2e": "playwright test"  // Solo E2E
    }
  }
  ```

#### Tests

- [ ] Verificar configuraciones (2 tests)
  - [ ] vitest usa jsdom
  - [ ] playwright usa navegador real

#### Acceptance Criteria

- [ ] ✅ Tests unitarios usan jsdom
- [ ] ✅ Tests E2E usan Playwright (sin jsdom)
- [ ] ✅ Configs separadas correctamente
- [ ] ✅ Comandos independientes
- [ ] ✅ Todos los tests pasan

**Firma**: ___________ | Fecha: ___________ | Revisor: ___________

---

## Sprint 4: Linting Automático

### ✅ LOW-DOCS-*: Markdown Linting (141 warnings)

**Estado**: [ ] Pendiente | [ ] En Progreso | [ ] Completado | [ ] Validado

#### Auto-Fix

- [ ] **Ejecutar markdownlint con fix**
  ```bash
  npx markdownlint-cli2-fix "**/*.md"
  ```
  - [ ] Comando ejecutado sin errores
  - [ ] Archivo `.markdownlint.json` configurado

#### Validación

- [ ] **Verificar warnings eliminados**
  ```bash
  npx markdownlint-cli2 "**/*.md"
  # Debe mostrar: 0 warnings
  ```

- [ ] **Revisar cambios en archivos**
  ```bash
  git diff
  ```
  - [ ] MD032: Líneas en blanco añadidas alrededor de listas
  - [ ] MD051: Fragmentos de enlaces corregidos
  - [ ] MD053: Enlaces de definición corregidos

#### Archivos Afectados

- [ ] Todos los archivos .md sin warnings:
  - [ ] `README.md`
  - [ ] `DIAGNOSTICO_INICIAL.md`
  - [ ] `PROBLEMAS_CRITICOS.md`
  - [ ] `PLAN_DE_ACCION.md`
  - [ ] `Instrucciones_Maestras.md`
  - [ ] `Instrucciones_Frontend.md`
  - [ ] `Instrucciones_Seguridad.md`
  - [ ] `Instrucciones_Testing.md`
  - [ ] `Instrucciones_Performance.md`
  - [ ] `Instrucciones_Despliegue.md`
  - [ ] Otros archivos MD en el proyecto

#### CI/CD Integration

- [ ] **Agregar linting a pipeline**
  ```yaml
  # .github/workflows/main.yml
  - name: Lint markdown
    run: npx markdownlint-cli2 "**/*.md"
  ```
  - [ ] Job de linting agregado
  - [ ] Falla si hay warnings

#### Acceptance Criteria

- [ ] ✅ 0 warnings de markdownlint
- [ ] ✅ 141 problemas corregidos automáticamente
- [ ] ✅ `.markdownlint.json` configurado
- [ ] ✅ CI/CD verifica linting

**Firma**: ___________ | Fecha: ___________ | Revisor: ___________

---

## Validación Final Pre-Producción

### 🎯 Checklist General

#### Funcionalidad

- [ ] **Autenticación**
  - [ ] Registro de usuario funciona
  - [ ] Login funciona
  - [ ] Logout funciona
  - [ ] Refresh token automático
  - [ ] Rate limiting activo

- [ ] **Navegación**
  - [ ] Todas las rutas accesibles
  - [ ] Lazy loading funciona
  - [ ] Back/forward del navegador funcionan
  - [ ] Deep linking funciona

- [ ] **Carrito**
  - [ ] Agregar productos
  - [ ] Actualizar cantidad
  - [ ] Eliminar productos
  - [ ] Persistencia en localStorage
  - [ ] Total calculado correctamente

#### Seguridad

- [ ] **Headers**
  ```bash
  curl -I https://puranatura.com
  ```
  - [ ] Content-Security-Policy
  - [ ] X-Content-Type-Options: nosniff
  - [ ] X-Frame-Options: DENY
  - [ ] Strict-Transport-Security
  - [ ] X-XSS-Protection

- [ ] **Tokens**
  - [ ] JWT con expiración corta (15 min)
  - [ ] Refresh tokens rotados
  - [ ] CSRF tokens en mutaciones
  - [ ] Tokens almacenados correctamente

- [ ] **Audit**
  ```bash
  npm audit --production
  ```
  - [ ] 0 vulnerabilidades críticas
  - [ ] 0 vulnerabilidades altas

#### Performance

- [ ] **Bundle**
  ```bash
  ls -lh dist/assets/
  ```
  - [ ] Total < 300KB (gzipped)
  - [ ] Chunks < 150KB cada uno

- [ ] **Lighthouse**
  ```bash
  lighthouse https://puranatura.com --view
  ```
  - [ ] Performance > 90
  - [ ] Accessibility > 90
  - [ ] Best Practices > 90
  - [ ] SEO > 90

- [ ] **Web Vitals**
  - [ ] LCP < 2.5s
  - [ ] FID < 100ms
  - [ ] CLS < 0.1
  - [ ] FCP < 1.8s
  - [ ] TTFB < 800ms

#### Testing

- [ ] **Tests pasando**
  ```bash
  npm run test:run && npm run test:e2e
  ```
  - [ ] Unitarios: 100% ✅
  - [ ] Integración: 100% ✅
  - [ ] E2E: 100% ✅
  - [ ] **Total: 61 tests** ✅

- [ ] **Cobertura**
  ```bash
  npm run test:coverage
  ```
  - [ ] Lines > 80%
  - [ ] Functions > 80%
  - [ ] Branches > 80%
  - [ ] Statements > 80%

#### Documentación

- [ ] **Archivos actualizados**
  - [ ] README.md con instrucciones claras
  - [ ] CHANGELOG.md con todos los cambios
  - [ ] .env.example actualizado
  - [ ] API documentation completa

- [ ] **Comentarios en código**
  - [ ] Funciones complejas comentadas
  - [ ] TODOs resueltos o documentados
  - [ ] JSDoc en funciones públicas

#### Deployment

- [ ] **Variables de entorno**
  ```bash
  node scripts/verify-env.mjs
  ```
  - [ ] Todas las variables configuradas
  - [ ] Secrets en lugar seguro (no en repo)

- [ ] **Database**
  - [ ] Migraciones ejecutadas
  - [ ] Backup pre-deploy creado
  - [ ] Rollback plan documentado

- [ ] **CI/CD**
  ```bash
  # Verificar último pipeline
  ```
  - [ ] Tests pasan
  - [ ] Build exitoso
  - [ ] Deploy automático configurado

#### Monitoring

- [ ] **Logging**
  - [ ] Sentry configurado (frontend + backend)
  - [ ] Logs estructurados
  - [ ] Alertas configuradas

- [ ] **Health Checks**
  ```bash
  curl https://api.puranatura.com/health
  ```
  - [ ] Endpoint responde 200
  - [ ] Database conectada
  - [ ] Memoria < 90%

#### Regresión

- [ ] **Funcionalidades existentes**
  - [ ] Búsqueda de productos funciona
  - [ ] Filtros funcionan
  - [ ] Imágenes cargan correctamente
  - [ ] Formularios validan correctamente
  - [ ] Errores se muestran al usuario

- [ ] **Performance no degradada**
  - [ ] Página carga en < 3 segundos
  - [ ] Interacciones son responsivas
  - [ ] No hay memory leaks

---

## 📊 Resumen de Validación

### Sprints Completados

| Sprint | Problemas | Tests | Estado |
|--------|-----------|-------|--------|
| Sprint 1 | CRIT-SEC-001 | 56 tests | [ ] ✅ |
| Sprint 2 | HIGH-SEC-002, HIGH-SEC-003, HIGH-PERF-001 | 14 tests | [ ] ✅ |
| Sprint 3 | MED-STRUCT-001, MED-STRUCT-002, MED-PERF-001, MED-TEST-001 | 5 tests | [ ] ✅ |
| Sprint 4 | LOW-DOCS-* (141) | Auto-fix | [ ] ✅ |

### Métricas Finales

- **Total de problemas corregidos**: 150 (1 crítico + 3 high + 5 medium + 141 low)
- **Total de tests**: 61 (41 backend + 12 frontend + 8 E2E)
- **Cobertura de código**: > 80%
- **Performance Score**: > 90
- **Bundle Size**: < 300KB (gzipped)
- **CVSS Score**: 9.8 → 0.0 (reducción del 100%)

### Sign-Off

**Desarrollador**: _____________________ | Fecha: ___________

**Revisor QA**: _____________________ | Fecha: ___________

**Tech Lead**: _____________________ | Fecha: ___________

**Product Owner**: _____________________ | Fecha: ___________

---

## 🚀 Aprobación para Producción

- [ ] ✅ Todos los sprints completados y validados
- [ ] ✅ Todos los tests pasando (61/61)
- [ ] ✅ Cobertura > 80%
- [ ] ✅ Lighthouse Score > 90
- [ ] ✅ Seguridad verificada (0 vulnerabilidades críticas)
- [ ] ✅ Documentación actualizada
- [ ] ✅ Backup de producción creado
- [ ] ✅ Rollback plan documentado
- [ ] ✅ Monitoring activo

**APROBADO PARA PRODUCCIÓN**: [ ] SÍ | [ ] NO

**Fecha de Deploy**: ___________

**Responsable**: ___________________

---

**Estado Final**: ✅ Checklist de Verificación Completo
