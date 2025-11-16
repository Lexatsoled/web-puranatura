# TASK-001: Setup de Detección de Secretos

**Prioridad**: 🔴 CRÍTICA  
**Tiempo estimado**: 2-3 horas  
**Dependencias**: Ninguna  
**Asignado a**: GPT-5-codex  
**Revisor**: GitHub Copilot

---

## 📋 CONTEXTO

El proyecto actualmente tiene `.env` raíz versionado en Git (contiene solo variables públicas VITE_*), pero necesitamos prevenir que secretos reales se cometan accidentalmente en el futuro. Implementaremos **gitleaks** como herramienta de detección automatizada.

### Hallazgo relacionado
- **ID**: SEC-SECRETS-001
- **Severidad**: ALTA
- **Impacto**: Exposición de credenciales y datos sensibles

---

## 🎯 OBJETIVO

Implementar sistema automatizado de detección de secretos que:

1. Escanee commits antes de permitirlos (pre-commit hook)
2. Valide PRs en CI/CD (GitHub Actions)
3. Permita escanear historial completo
4. Documente falsos positivos conocidos

---

## 📁 ARCHIVOS A CREAR

### 1. `.gitleaksignore`
**Ubicación**: Raíz del proyecto  
**Propósito**: Ignorar falsos positivos conocidos

```gitignore
# Archivos de ejemplo/template (no contienen secretos reales)
*.example
*.template
*.sample
.env.example
backend/.env.example

# Documentación
README.md
docs/**/*.md
*.md

# Archivos de configuración conocidos (sin secretos)
package.json
package-lock.json
tsconfig.json

# Reports y logs
reports/**
*.log
```

### 2. `.github/workflows/secret-scan.yml`
**Ubicación**: `.github/workflows/`  
**Propósito**: CI/CD workflow para escanear secretos

```yaml
name: Secret Scan

on:
  push:
    branches: ['**']
  pull_request:
    branches: ['main', 'develop']

jobs:
  gitleaks:
    name: Scan for secrets
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0  # Necesario para escanear historial
      
      - name: Run Gitleaks
        uses: gitleaks/gitleaks-action@v2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          GITLEAKS_LICENSE: ${{ secrets.GITLEAKS_LICENSE }}  # Opcional
      
      - name: Upload results
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: gitleaks-report
          path: gitleaks-report.json
```

### 3. `.gitleaks.toml` (opcional pero recomendado)
**Ubicación**: Raíz del proyecto  
**Propósito**: Configuración personalizada de gitleaks

```toml
title = "Pureza Naturalis - Gitleaks Config"

[extend]
# useDefault will extend the base configuration with the default gitleaks config:
# https://github.com/gitleaks/gitleaks/blob/master/config/gitleaks.toml
useDefault = true

[allowlist]
description = "Allowlist for known false positives"
paths = [
  '''\.env\.example$''',
  '''README\.md$''',
  '''docs/.*\.md$''',
]

regexes = [
  # Ignorar variables VITE_ públicas (no son secretos)
  '''VITE_[A-Z_]+=.*''',
]
```

---

## 📝 ARCHIVOS A MODIFICAR

### 4. `.husky/pre-commit`

**Archivo existente**: `.husky/pre-commit`

**Modificación**: Añadir escaneo de gitleaks ANTES del check de encoding

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Scan for secrets FIRST (critical security check)
echo "🔍 Scanning for secrets..."
if command -v gitleaks &> /dev/null; then
  npx gitleaks protect --staged --verbose --no-color 2>&1 || {
    echo "❌ Gitleaks detected secrets in staged files!"
    echo "💡 Review the output above and remove sensitive data before committing."
    exit 1
  }
  echo "✅ No secrets detected"
else
  echo "⚠️  Gitleaks not found. Skipping secret scan."
  echo "💡 Install with: brew install gitleaks (macOS) or download from GitHub"
fi

# Continue with existing checks
npm run check:encoding || exit 1
npx lint-staged
```

**Líneas exactas a modificar**:
- **Antes**: Línea 4 empieza con `npm run check:encoding`
- **Después**: Insertar el bloque de gitleaks ANTES de esa línea

### 5. `package.json`

**Archivo existente**: `package.json`

**Modificación**: Añadir scripts de gitleaks en la sección `"scripts"`

```json
{
  "scripts": {
    // ... scripts existentes ...
    
    // Añadir estos scripts (ordenados alfabéticamente):
    "scan:secrets": "npx gitleaks detect --verbose --no-color",
    "scan:secrets:history": "npx gitleaks detect --verbose --no-color --log-opts='--all'",
    "scan:secrets:report": "npx gitleaks detect --report-format json --report-path reports/secrets-scan.json --verbose"
  }
}
```

**Ubicación exacta**: Después de `"audit:components"` (aprox. línea 46)

---

## 🧪 TESTS Y VALIDACIÓN

### Test 1: Verificar que gitleaks detecta secretos de prueba

```bash
# Crear archivo con secreto de prueba
echo 'AWS_SECRET_KEY="AKIAIOSFODNN7EXAMPLE"' > test-secret-file.txt

# Intentar añadirlo a staging
git add test-secret-file.txt

# Intentar commit (debe FALLAR)
git commit -m "test: intentar comitear secreto" 2>&1 | tee test-output.txt

# Verificar que falló
if grep -q "gitleaks" test-output.txt; then
  echo "✅ Test PASSED: Gitleaks bloqueó el secreto"
else
  echo "❌ Test FAILED: Gitleaks NO detectó el secreto"
  exit 1
fi

# Limpiar
rm test-secret-file.txt test-output.txt
git reset HEAD
```

### Test 2: Verificar que archivos legítimos pasan

```bash
# Crear archivo legítimo
echo 'export const API_URL = process.env.VITE_API_URL;' > test-legit.ts

# Añadir y commitear (debe PASAR)
git add test-legit.ts
git commit -m "test: archivo legítimo" || {
  echo "❌ Test FAILED: Archivo legítimo fue bloqueado"
  exit 1
}

# Limpiar
git reset HEAD~1
rm test-legit.ts
echo "✅ Test PASSED: Archivo legítimo pasó"
```

### Test 3: Verificar scripts npm

```bash
# Test script básico
npm run scan:secrets 2>&1 | tee scan-output.txt

if grep -q "No leaks found" scan-output.txt || grep -q "0 commits" scan-output.txt; then
  echo "✅ Test PASSED: Scan básico funciona"
else
  echo "⚠️  Revisar output manualmente"
fi

rm scan-output.txt
```

### Test 4: Validar workflow YAML

```bash
# Opcional: Validar sintaxis con actionlint
if command -v actionlint &> /dev/null; then
  actionlint .github/workflows/secret-scan.yml
  if [ $? -eq 0 ]; then
    echo "✅ Workflow YAML válido"
  else
    echo "❌ Workflow YAML tiene errores de sintaxis"
    exit 1
  fi
else
  echo "⚠️  actionlint no instalado, validación manual requerida"
fi
```

---

## ✅ CHECKLIST DE VALIDACIÓN

Antes de reportar la tarea como COMPLETADA, verificar:

- [ ] Archivo `.gitleaksignore` creado con entradas correctas
- [ ] Workflow `.github/workflows/secret-scan.yml` creado
- [ ] Archivo `.gitleaks.toml` creado (opcional)
- [ ] `.husky/pre-commit` modificado correctamente
- [ ] Scripts añadidos a `package.json`
- [ ] Test 1 ejecutado: Gitleaks bloquea secretos ✅
- [ ] Test 2 ejecutado: Archivos legítimos pasan ✅
- [ ] Test 3 ejecutado: Scripts npm funcionan ✅
- [ ] Test 4 ejecutado: Workflow YAML válido ✅
- [ ] No hay errores de sintaxis en archivos modificados
- [ ] Git log limpio (sin commits de prueba)

---

## 🚨 PUNTOS DE ATENCIÓN PARA GPT-5

### ⚠️ CRÍTICO - NO HACER:

1. **NO modificar archivos .env existentes** - Solo crear `.gitleaksignore`
2. **NO comitear secretos de prueba** - Limpiar después de tests
3. **NO romper husky hooks existentes** - Solo AÑADIR, no reemplazar
4. **NO instalar gitleaks globalmente** - Usar `npx` para compatibilidad

### ✅ RECOMENDACIONES:

1. **Verificar que husky está instalado**: Ejecutar `npm run prepare` si es necesario
2. **Probar pre-commit hook manualmente** antes de reportar completado
3. **Documentar cualquier falso positivo** encontrado durante tests
4. **Mantener formato consistente** en package.json (indentación, comillas)

### 🔧 TROUBLESHOOTING:

**Si gitleaks no se encuentra**:
```bash
# Opción 1: Usar npx (recomendado)
npx gitleaks version

# Opción 2: Instalar localmente
npm install --save-dev gitleaks

# Opción 3: Instrucciones de instalación manual
echo "Instrucciones en: https://github.com/gitleaks/gitleaks#installing"
```

**Si husky no ejecuta el hook**:
```bash
# Reinstalar husky
npm run prepare
chmod +x .husky/pre-commit

# Verificar
ls -la .husky/pre-commit
```

**Si el workflow falla en GitHub Actions**:
- Verificar permisos de GITHUB_TOKEN en Settings → Actions
- Revisar sintaxis YAML con yamllint online
- Comprobar que la rama existe en remoto

---

## 📊 CRITERIOS DE ACEPTACIÓN

### Funcionales
1. ✅ Gitleaks bloquea commits con secretos conocidos
2. ✅ Archivos en `.gitleaksignore` son excluidos correctamente
3. ✅ Scripts npm ejecutan sin errores
4. ✅ Pre-commit hook no bloquea commits legítimos
5. ✅ Workflow de GitHub Actions está sintácticamente correcto

### No Funcionales
1. ✅ Tiempo de ejecución del pre-commit < 5 segundos
2. ✅ Output claro y útil para desarrolladores
3. ✅ Documentación de falsos positivos
4. ✅ Compatible con Windows, macOS y Linux

---

## 📤 FORMATO DE ENTREGA

Al completar la tarea, reportar en este formato:

```markdown
## TASK-001: COMPLETADA ✅

### Archivos creados:
- `.gitleaksignore` (15 líneas)
- `.github/workflows/secret-scan.yml` (28 líneas)
- `.gitleaks.toml` (23 líneas)

### Archivos modificados:
- `.husky/pre-commit` (añadidas 15 líneas, línea 5-19)
- `package.json` (añadidos 3 scripts, línea 47-49)

### Tests ejecutados:
✅ Test 1: Secreto bloqueado correctamente
✅ Test 2: Archivo legítimo pasó
✅ Test 3: Scripts npm funcionan
✅ Test 4: Workflow YAML válido

### Notas adicionales:
[Cualquier observación, falso positivo encontrado, o decisión tomada]

### Próximo paso recomendado:
TASK-002: Verificación histórica de secretos
```

---

## 🔄 PROCESO DE REVISIÓN

**Director (Copilot) revisará**:
1. Sintaxis y estructura de archivos
2. Cobertura de tests
3. Compatibilidad con proyecto existente
4. Seguridad y robustez de implementación
5. Documentación de decisiones

**Si aprobado** → Merge y continuar con TASK-002  
**Si cambios requeridos** → Feedback específico y re-iteración  
**Si bloqueado** → Escalación y análisis de alternativas

---

**Última actualización**: 2025-11-07  
**Versión**: 1.0  
**Creado por**: GitHub Copilot (Director de Proyecto)
