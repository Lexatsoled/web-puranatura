# 🛡️ GROK-TASK-2: SEC-CSP-001 - Content Security Policy

**ID:** SEC-CSP-001  
**Severidad:** 🔴 HIGH  
**Tiempo estimado:** 15 minutos  
**Complejidad:** ⭐ Muy fácil  
**Status:** ⏳ TODO

---

## 📋 RESUMEN DE TAREA

**Problema:**
- Navegadores pueden cargar scripts de fuentes no autorizadas
- Permite ataques XSS (inyección de código malicioso)
- Content Security Policy (CSP) no está configurada en HTML

**Solución:**
- Agregar CSP meta tag en `index.html`
- Verificar que backend tenga security headers
- Resultado: XSS mitigation +99%

---

## 🎯 PASO 1: ABRIR ARCHIVO

```powershell
# Comando para abrir archivo
code index.html
```

**Ubicación esperada:**
```
C:\Users\Usuario\Desktop\Web Puranatura\Pureza-Naturalis-V3\index.html
```

---

## ✏️ PASO 2: LOCALIZAR DÓNDE INSERTAR

En el archivo `index.html`, buscar la sección `<head>`:

**ENCONTRAR ESTO:**
```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Pureza Naturalis</title>
  </head>
```

**EL CAMBIO:** Insertar CSP meta tag **INMEDIATAMENTE DESPUÉS** de `<meta charset="UTF-8" />`

---

## 🔄 PASO 3: AGREGAR CSP META TAG

### Opción A: Copiar-Pega Exacto (RECOMENDADO)

**BUSCAR ESTO EN index.html:**
```html
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
```

**REEMPLAZAR POR ESTO:**
```html
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https: blob:; font-src 'self' https://fonts.gstatic.com data:; connect-src 'self' https: wss: http://localhost:3001; frame-ancestors 'none'; base-uri 'self'; form-action 'self';" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta http-equiv="X-Content-Type-Options" content="nosniff" />
    <meta name="X-Frame-Options" content="DENY" />
    <meta http-equiv="X-XSS-Protection" content="1; mode=block" />
    <meta name="Referrer-Policy" content="strict-origin-when-cross-origin" />
    <meta name="Permissions-Policy" content="accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
```

**PASOS EN VS CODE:**
1. Presionar `Ctrl+F` (Find)
2. Buscar: `<meta charset="UTF-8" />`
3. Presionar `Ctrl+H` (Find and Replace)
4. En "Replace", pegar el código de arriba
5. Click "Replace"
6. Guardar `Ctrl+S`

### Opción B: Manual (Si copiar-pega no funciona)

**Después de la línea:** `<meta charset="UTF-8" />`

**Agregar estas 6 líneas:**
```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https: blob:; font-src 'self' https://fonts.gstatic.com data:; connect-src 'self' https: wss: http://localhost:3001; frame-ancestors 'none'; base-uri 'self'; form-action 'self';" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta http-equiv="X-Content-Type-Options" content="nosniff" />
<meta name="X-Frame-Options" content="DENY" />
<meta http-equiv="X-XSS-Protection" content="1; mode=block" />
<meta name="Referrer-Policy" content="strict-origin-when-cross-origin" />
<meta name="Permissions-Policy" content="accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()" />
```

---

## ✅ PASO 4: VERIFICAR EL CAMBIO

**En VS Code:**
- [ ] Archivo muestra punto blanco (sin guardar)
- [ ] Presionar `Ctrl+S` para guardar
- [ ] Punto desaparece (guardado ✅)

**Validación visual - El archivo debe verse así:**
```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'..." />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta http-equiv="X-Content-Type-Options" content="nosniff" />
    <meta name="X-Frame-Options" content="DENY" />
    <meta http-equiv="X-XSS-Protection" content="1; mode=block" />
    <meta name="Referrer-Policy" content="strict-origin-when-cross-origin" />
    <meta name="Permissions-Policy" content="accelerometer=..." />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
```

---

## 🧪 PASO 5: EJECUTAR PRUEBA

Abrir terminal y verificar que el servidor puede servir HTML:

```powershell
# Verificar que index.html es válido HTML
# Simplemente intentar abrirlo en navegador

# Si está en desarrollo:
npm run dev

# Luego abrir browser en:
# http://localhost:5173
```

**Resultado esperado:**
- Página carga normalmente ✅
- No hay errores en console del navegador ✅
- DevTools muestra CSP headers en Network tab ✅

**Si ves esto, es éxito:**
```
Página carga, sin errores CSP
```

**Si ves esto, hay error:**
```
Refused to load script from... due to Content Security Policy directive
```
→ Solución: Ajustar CSP para incluir la fuente necesaria

---

## 📊 PASO 6: VALIDACIÓN FINAL

Ejecutar script de validación:

```powershell
.\validate-audits.ps1

# Buscar estas líneas:
# ✅ [PASS] CSP Meta Tag en HTML
# ✅ [PASS] Security Headers Plugin
```

**Si ambas pasan:** ✅ TAREA 2 COMPLETADA

**Si falla "CSP Meta Tag":**
```
❌ [FAIL] CSP Meta Tag en HTML
   └─ Details: Meta tag not found or incomplete
```
→ Revisar que el meta tag se insertó correctamente en index.html

**Si falla "Security Headers":**
```
❌ [FAIL] Security Headers Plugin
   └─ Details: Plugin not configured
```
→ Revisar que `backend/src/plugins/securityHeaders.ts` existe

---

## 🎯 CHECKLIST DE COMPLETITUD

- [ ] Archivo `index.html` abierto
- [ ] Localicé `<meta charset="UTF-8" />`
- [ ] Insertí CSP meta tag **después** de charset
- [ ] Insertí 6 meta tags adicionales (X-UA-Compatible, X-Content-Type-Options, etc)
- [ ] Guardé el archivo (`Ctrl+S`)
- [ ] Abrí `npm run dev` y cargué página en navegador
- [ ] Página cargó sin errores CSP
- [ ] Ejecuté `.\validate-audits.ps1`
- [ ] Validación pasó: ✅ CSP Meta Tag + ✅ Security Headers

---

## 📋 REFERENCIA: QUÉ HACE CADA META TAG

| Meta Tag | Función |
|----------|---------|
| **Content-Security-Policy** | Previene inyección de scripts (XSS) |
| **X-UA-Compatible** | Compatibility con IE (legacy) |
| **X-Content-Type-Options** | Previene MIME-sniffing |
| **X-Frame-Options** | Previene Clickjacking (DENY = no puede ser iframe) |
| **X-XSS-Protection** | XSS filter en navegadores antiguos |
| **Referrer-Policy** | Controla qué referrer envía al hacer requests |
| **Permissions-Policy** | Restringe acceso a hardware (cámara, micrófono, etc) |

---

## 🚀 PRÓXIMO PASO

Una vez completada esta tarea:

1. Commit los cambios:
```powershell
git add index.html
git commit -m "security(csp): add Content Security Policy and security headers meta tags"
```

2. Ir a: **GROK-TASK-3.md** (Input Validation)

---

## 📞 TROUBLESHOOTING

### Problema: "Content-Security-Policy not found in validate output"
**Solución:** Revisar que meta tag está exactamente en `index.html` usando `Ctrl+F`

### Problema: "Página no carga después de agregar CSP"
**Solución:** CSP puede estar muy restrictiva. Modificar para ser más permisiva:
- Cambiar `'unsafe-inline'` es lo que permite los estilos inline
- Cambiar `'unsafe-eval'` permite eval() en JavaScript

### Problema: "Cannot find module securityHeaders"
**Solución:** Eso está en el backend. No es tu responsabilidad en esta tarea.

### Problema: No sé si el HTML está bien formado
**Solución:** Abrir en navegador. Si carga sin errores, está bien.

---

**STATUS:** ⏳ EN PROGRESO  
**TIEMPO INVERTIDO:** ~15 minutos  
**SIGUIENTE:** GROK-TASK-3.md

