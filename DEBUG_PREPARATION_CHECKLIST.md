# ✅ CHECKLIST DE PREPARACIÓN PARA DEBUG - Pureza Naturalis V3

**Proyecto:** Frontend E-commerce React + TypeScript + Vite  
**Estado:** Diseño en progreso - Frontend-only (sin backend)  
**Objetivo:** Depurar errores Mojibake antes de continuar desarrollo

---

## 🔴 PROBLEMA IDENTIFICADO: Errores Mojibake (Codificación UTF-8)

### 📍 **Ubicación del Error**

**Archivo:** `c:\Users\Usuario\Desktop\Web Puranatura\Pureza-Naturalis-V3\index.html`

#### **Líneas Afectadas:**

1. **Línea ~240** (comentario CSS):
   ```html
   <!-- CustomÃƒÆ'Ã‚Â¡styles with performance optimizations -->
   ```
   - ❌ **Texto corrupto:** `CustomÃƒÆ'Ã‚Â¡styles`
   - ✅ **Debería ser:** `Custom styles`

2. **Línea ~259** (fuente Playfair Display):
   ```css
   font-family: 'Playfair Display', Georgia, 'TimÃƒÆ'Ã‚Â¡s New Roman', serif;
   ```
   - ❌ **Texto corrupto:** `TimÃƒÆ'Ã‚Â¡s New Roman`
   - ✅ **Debería ser:** `Times New Roman`

3. **Línea ~87** (vite.config.ts - comentario):
   ```typescript
   // Sentry plugin para upload de sourcemaps en producciÃ³n
   ```
   - ❌ **Texto corrupto:** `producciÃ³n`
   - ✅ **Debería ser:** `producción`

---

## 🛠️ CAUSA RAÍZ

### **Problema de Doble Codificación UTF-8**

Los caracteres especiales españoles (ñ, á, é, í, ó, ú) están siendo:
1. Codificados como UTF-8 → `ó` = bytes `C3 B3`
2. Interpretados como Latin-1 → `Ã³`
3. Re-codificados como UTF-8 → `ÃƒÆ'Ã‚Â³`

**Resultado:** Caracteres "Mojibake" ilegibles

---

## ✅ ACCIONES CORRECTIVAS

### **1. Correcciones Inmediatas (Manual)**

#### **index.html:**
```html
<!-- ANTES (línea 240) -->
<!-- CustomÃƒÆ'Ã‚Â¡styles with performance optimizations -->

<!-- DESPUÉS -->
<!-- Custom styles with performance optimizations -->
```

```css
/* ANTES (línea 259) */
font-family: 'Playfair Display', Georgia, 'TimÃƒÆ'Ã‚Â¡s New Roman', serif;

/* DESPUÉS */
font-family: 'Playfair Display', Georgia, 'Times New Roman', serif;
```

#### **vite.config.ts:**
```typescript
// ANTES (línea 87)
// Sentry plugin para upload de sourcemaps en producciÃ³n

// DESPUÉS
// Sentry plugin para upload de sourcemaps en producción
```

---

### **2. Verificación de Configuración de Codificación**

#### **✅ Estado Actual CORRECTO:**

1. **index.html** (línea 4):
   ```html
   <meta charset="UTF-8" />
   ```
   ✅ Correcto

2. **package.json** - Agregar si no existe:
   ```json
   {
     "engines": {
       "node": ">=18.0.0"
     }
   }
   ```

3. **VS Code** - Archivo `.vscode/settings.json`:
   ```json
   {
     "files.encoding": "utf8",
     "files.autoGuessEncoding": false,
     "[html]": {
       "files.encoding": "utf8"
     },
     "[typescript]": {
       "files.encoding": "utf8"
     },
     "[typescriptreact]": {
       "files.encoding": "utf8"
     }
   }
   ```

4. **Git** - Archivo `.gitattributes`:
   ```
   * text=auto eol=lf
   *.html text eol=lf encoding=UTF-8
   *.ts text eol=lf encoding=UTF-8
   *.tsx text eol=lf encoding=UTF-8
   *.json text eol=lf encoding=UTF-8
   ```

---

### **3. Script de Búsqueda Automática de Mojibake**

**Archivo:** `scripts/find-mojibake.ps1`

```powershell
# Buscar patrones Mojibake en archivos del proyecto
Write-Host "🔍 Buscando errores Mojibake en Pureza-Naturalis-V3..." -ForegroundColor Cyan

$mojibakePatterns = @(
    'Ã¡', 'Ã©', 'Ã­', 'Ã³', 'Ãº',  # á, é, í, ó, ú corrupted
    'Ã±',                           # ñ corrupted
    'Ã"', 'Ã‰', 'Ã', 'Ã"', 'Ãš',  # Á, É, Í, Ó, Ú corrupted
    'Ã'',                           # Ñ corrupted
    'Ã¿',                           # ÿ corrupted
    'Ã¢', 'Ã¨', 'Ã®', 'Ã´', 'Ã»'   # â, è, î, ô, û corrupted
)

$projectPath = "c:\Users\Usuario\Desktop\Web Puranatura\Pureza-Naturalis-V3"
$extensions = @('*.html', '*.ts', '*.tsx', '*.js', '*.jsx', '*.json', '*.css')

$results = @()

foreach ($ext in $extensions) {
    $files = Get-ChildItem -Path $projectPath -Filter $ext -Recurse -File |
             Where-Object { $_.FullName -notmatch '(node_modules|dist|build|coverage)' }
    
    foreach ($file in $files) {
        $content = Get-Content $file.FullName -Raw -Encoding UTF8
        
        foreach ($pattern in $mojibakePatterns) {
            if ($content -match $pattern) {
                $results += [PSCustomObject]@{
                    File = $file.FullName.Replace($projectPath, '.')
                    Pattern = $pattern
                    LineNumber = ($content -split "`n" | Select-String $pattern | Select-Object -First 1).LineNumber
                }
            }
        }
    }
}

if ($results.Count -gt 0) {
    Write-Host "`n❌ Encontrados $($results.Count) errores Mojibake:" -ForegroundColor Red
    $results | Format-Table -AutoSize
} else {
    Write-Host "`n✅ No se encontraron errores Mojibake" -ForegroundColor Green
}
```

**Ejecutar:**
```powershell
cd "c:\Users\Usuario\Desktop\Web Puranatura\Pureza-Naturalis-V3"
.\scripts\find-mojibake.ps1
```

---

## 🧪 PROCESO DE DEBUG CON GPT-4.1

### **Pre-Requisitos (ANTES de iniciar debug):**

#### **1. Correcciones Mojibake Completadas**
- [ ] `index.html` línea 240 corregida
- [ ] `index.html` línea 259 corregida
- [ ] `vite.config.ts` línea 87 corregida
- [ ] Script de búsqueda ejecutado: `0 errores encontrados`

#### **2. Verificación de Configuración**
- [x] `<meta charset="UTF-8" />` presente en `index.html`
- [ ] `.vscode/settings.json` configurado con `"files.encoding": "utf8"`
- [ ] `.gitattributes` configurado con `encoding=UTF-8`
- [ ] Todos los archivos guardados con codificación UTF-8 (verificar en VS Code)

#### **3. Estado del Proyecto**
- [x] No hay errores de compilación TypeScript (`npm run typecheck`)
- [ ] Servidor de desarrollo funciona (`npm run dev`)
- [ ] Build de producción exitoso (`npm run build`)

#### **4. Backup de Seguridad**
```powershell
# Crear backup antes de debug
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupPath = "c:\Users\Usuario\Desktop\Web Puranatura\Pureza-Naturalis-V3_backup_$timestamp"
Copy-Item "c:\Users\Usuario\Desktop\Web Puranatura\Pureza-Naturalis-V3" -Destination $backupPath -Recurse
Write-Host "✅ Backup creado en: $backupPath" -ForegroundColor Green
```

---

### **Comandos de Verificación Pre-Debug:**

```powershell
# 1. Posicionarse en el proyecto
cd "c:\Users\Usuario\Desktop\Web Puranatura\Pureza-Naturalis-V3"

# 2. Instalar dependencias (si es necesario)
npm install

# 3. Verificar compilación TypeScript
npm run typecheck

# 4. Ejecutar tests (si existen)
npm run test

# 5. Iniciar servidor desarrollo
npm run dev

# 6. Build de producción
npm run build

# 7. Verificar tamaño del bundle
npm run build -- --mode production
```

---

## 📊 INFORMACIÓN DE DIAGNÓSTICO PARA GPT-4.1

### **Resumen Técnico del Proyecto:**

| Categoría | Detalles |
|-----------|----------|
| **Framework** | React 18.3.1 + TypeScript 5.7.2 + Vite 6.2.0 |
| **Estado de Madurez** | Frontend completo (8.2/10), Backend NO implementado |
| **Modo de Desarrollo** | Frontend-only con localStorage simulado |
| **Problemas Actuales** | Mojibake en 3 archivos (index.html, vite.config.ts) |
| **Errores de Compilación** | 0 errores TypeScript |
| **Testing** | Vitest + Playwright configurado |
| **Prioridad de Debug** | ✅ Codificación UTF-8 → Problemas de diseño frontend |

---

### **Contexto del Proyecto:**

#### **Arquitectura:**
- **Sin backend:** Toda la lógica en cliente (localStorage)
- **Seguridad:** Simulada (NO apta para producción)
- **Autenticación:** Mock con localStorage
- **Base de Datos:** Ninguna (productos hardcodeados)

#### **Fase Actual:**
- Diseño y maquetación de frontend
- Ajustes de UI/UX
- Optimización de rendimiento (Web Vitals)

#### **Siguiente Fase (Después de Debug):**
- Implementación de backend (Sprint 1: 40-60h)
- PostgreSQL + Express.js + JWT
- Migración de localStorage a API REST

---

## 🎯 OBJETIVOS DEL DEBUG

### **Objetivo Principal:**
Identificar y corregir **todos los errores Mojibake** en el proyecto antes de continuar con el desarrollo del diseño frontend.

### **Objetivos Secundarios:**
1. ✅ Validar que no hay más errores de codificación ocultos
2. ✅ Configurar herramientas de prevención (linters, Git hooks)
3. ✅ Documentar el proceso para futuras ocurrencias
4. ✅ Optimizar configuración de VS Code / Git

---

## 📝 CHECKLIST FINAL PRE-DEBUG

### **Antes de Iniciar Sesión con GPT-4.1:**

#### **✅ Archivos Corregidos:**
- [ ] `index.html` - Línea 240: `Custom styles` ✅
- [ ] `index.html` - Línea 259: `Times New Roman` ✅
- [ ] `vite.config.ts` - Línea 87: `producción` ✅

#### **✅ Herramientas Configuradas:**
- [ ] VS Code: Encoding UTF-8 por defecto
- [ ] Git: `.gitattributes` con UTF-8
- [ ] Script PowerShell: `find-mojibake.ps1` ejecutado

#### **✅ Validación Técnica:**
- [ ] `npm run typecheck` → ✅ Sin errores
- [ ] `npm run dev` → ✅ Servidor funciona
- [ ] `npm run build` → ✅ Build exitoso
- [ ] Script Mojibake → ✅ 0 errores encontrados

#### **✅ Backup Creado:**
- [ ] Copia de seguridad con timestamp
- [ ] Ubicación: `Pureza-Naturalis-V3_backup_YYYYMMDD_HHMMSS`

---

## 🚀 COMANDOS RÁPIDOS PARA GPT-4.1

### **Iniciar Debug:**
```powershell
cd "c:\Users\Usuario\Desktop\Web Puranatura\Pureza-Naturalis-V3"

# Verificar encoding de archivos específicos
Get-Content .\index.html -Encoding UTF8 | Select-String "Custom|Times|producción"

# Buscar Mojibake en todo el proyecto
.\scripts\find-mojibake.ps1

# Verificar estado del proyecto
npm run typecheck && npm run dev
```

### **Post-Corrección:**
```powershell
# Re-verificar encoding
chcp 65001  # UTF-8 en PowerShell
Get-Content .\index.html -Encoding UTF8 | Select-String -Pattern "Ã" -Context 2,2

# Commit con mensaje descriptivo
git add .
git commit -m "fix: corregir errores Mojibake en index.html y vite.config.ts (UTF-8)"
```

---

## 📌 NOTAS IMPORTANTES

### **Para GPT-4.1:**

1. **NO implementar backend** durante este debug
2. **Enfocarse SOLO** en errores de codificación y frontend
3. **Verificar 100%** que no quedan caracteres Mojibake ocultos
4. **Documentar** cualquier otro error de diseño encontrado

### **Problemas Conocidos (NO relacionados con Mojibake):**

- ⚠️ **Autenticación simulada:** localStorage en lugar de JWT (esperado)
- ⚠️ **Sin validación servidor:** Todo en cliente (esperado para frontend-only)
- ⚠️ **Productos hardcodeados:** `src/data/products/all-products.ts` (temporal)

---

## 🎓 LECCIONES APRENDIDAS

### **Causa Raíz Identificada:**

El problema Mojibake ocurrió porque:

1. **Edición con encoding incorrecto:** Algún editor guardó los archivos como Latin-1 en lugar de UTF-8
2. **Git sin normalización:** `.gitattributes` no forzaba UTF-8
3. **VS Code sin configuración explícita:** `files.encoding` no estaba configurado

### **Prevención Futura:**

1. ✅ Configurar `.vscode/settings.json` con encoding UTF-8
2. ✅ Crear `.gitattributes` con normalización
3. ✅ Script de CI/CD que detecte Mojibake antes de commits
4. ✅ Pre-commit hook con validación de encoding

---

## 📞 CONTACTO Y DOCUMENTACIÓN

- **Documentación del Proyecto:** `./docs/`
- **Plan de Acción Completo:** `PLAN_DE_ACCION.md` (4,200+ líneas)
- **Diagnóstico Inicial:** `DIAGNOSTICO_INICIAL.md` (1,110 líneas)
- **Instrucciones para AI:** `Instrucciones_Maestras.md` (970 líneas)

---

## ✅ RESUMEN EJECUTIVO

| Estado | Descripción |
|--------|-------------|
| **Problema** | 3 instancias de Mojibake en `index.html` y `vite.config.ts` |
| **Causa** | Doble codificación UTF-8 → Latin-1 → UTF-8 |
| **Impacto** | Visual (caracteres corruptos) - NO afecta funcionalidad |
| **Prioridad** | 🟡 Media (estético, no crítico) |
| **Tiempo Estimado** | 15-30 minutos de corrección |
| **Prevención** | Configurar VS Code + Git + Script de validación |

---

## 🎯 PRÓXIMOS PASOS

### **Después de Corregir Mojibake:**

1. ✅ Continuar con diseño/maquetación frontend
2. ✅ Optimizar rendimiento (LCP, FID, CLS)
3. ✅ Completar testing E2E con Playwright
4. ⏸️ **NO** implementar backend hasta que diseño esté 100% completo
5. ⏸️ Backend será Sprint 1 (40-60 horas) según `PLAN_DE_ACCION.md`

---

**Fecha de Creación:** 2025-01-04  
**Última Actualización:** 2025-01-04  
**Versión:** 1.0  
**Estado:** 🟢 Listo para Debug con GPT-4.1
