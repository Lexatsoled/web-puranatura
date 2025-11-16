# TASK-002: Verificación Histórica de Secretos

**Prioridad**: 🔴 CRÍTICA  
**Tiempo estimado**: 1 hora  
**Dependencias**: TASK-001 (completada)  
**Asignado a**: GPT-5-codex  
**Revisor**: GitHub Copilot

---

## 📋 CONTEXTO

Aunque `backend/.env` y `backend/database.sqlite` están actualmente en `.gitignore`, necesitamos verificar que NUNCA fueron comiteados en el historial de Git. Si alguna vez se comitearon, los secretos podrían estar expuestos en el historial público.

### Hallazgo relacionado

- **ID**: SEC-SECRETS-001 (parte 2)
- **Severidad**: ALTA
- **Riesgo**: Exposición histórica de credenciales

---

## 🎯 OBJETIVO

Realizar auditoría completa del historial de Git para:

1. Verificar que `backend/.env` nunca fue comiteado
2. Verificar que `backend/database.sqlite*` nunca fueron comiteados
3. Documentar hallazgos en reporte de auditoría
4. Proporcionar evidencia de seguridad histórica

---

## 📁 ARCHIVOS A CREAR

### 1. `reports/execution-2025-11-07/secret-history-audit.md`

**Ubicación**: `reports/execution-2025-11-07/`  
**Propósito**: Documentar resultados de auditoría histórica

```markdown
# Auditoría Histórica de Secretos

**Fecha**: 2025-11-07  
**Ejecutado por**: GPT-5-codex  
**Revisado por**: GitHub Copilot  
**Tarea**: TASK-002

---

## Resumen Ejecutivo

- **Archivos auditados**: `backend/.env`, `backend/database.sqlite*`
- **Periodo auditado**: Historial completo de Git
- **Resultado**: [LIMPIO / SECRETOS ENCONTRADOS]
- **Acción requerida**: [NINGUNA / LIMPIEZA DE HISTORIAL]

---

## Metodología

### Comandos ejecutados:

\`\`\`bash
# 1. Buscar backend/.env en historial completo
git log --all --full-history --pretty=format:"%H %ai %an" -- backend/.env

# 2. Buscar backend/database.sqlite* en historial completo
git log --all --full-history --pretty=format:"%H %ai %an" -- "backend/database.sqlite*"

# 3. Buscar cualquier archivo .env en backend (expansión)
git log --all --full-history --pretty=format:"%H %ai %an" -- "backend/**/.env*"

# 4. Verificar contenido actual de .gitignore
git log --all --pretty=format:"%H %ai" -- backend/.gitignore
\`\`\`

---

## Resultados Detallados

### 1. backend/.env

\`\`\`
[Pegar output del comando git log aquí]
\`\`\`

**Análisis**:
- Commits encontrados: [NÚMERO]
- Primer commit (si existe): [FECHA y HASH]
- Último commit (si existe): [FECHA y HASH]
- **Conclusión**: [NUNCA COMITEADO / ENCONTRADO EN HISTORIAL]

### 2. backend/database.sqlite*

\`\`\`
[Pegar output del comando git log aquí]
\`\`\`

**Análisis**:
- Commits encontrados: [NÚMERO]
- Archivos encontrados: [.sqlite, .sqlite-shm, .sqlite-wal]
- **Conclusión**: [NUNCA COMITEADO / ENCONTRADO EN HISTORIAL]

### 3. backend/.gitignore

\`\`\`
[Pegar output del comando git log aquí]
\`\`\`

**Análisis**:
- Estado actual de protección: [DESCRIPCIÓN]
- Fecha de creación: [FECHA]

---

## Hallazgos de Seguridad

### ✅ ARCHIVOS LIMPIOS (nunca comiteados):
- [ ] backend/.env
- [ ] backend/.env.local
- [ ] backend/database.sqlite
- [ ] backend/database.sqlite-shm
- [ ] backend/database.sqlite-wal

### ⚠️ ARCHIVOS ENCONTRADOS EN HISTORIAL:
[Listar aquí si se encuentra algo, o dejar vacío]

---

## Recomendaciones

[Basado en hallazgos, proponer acciones]

### Si historial está limpio:
✅ Continuar con flujo normal (TASK-003)

### Si se encontraron secretos:
⚠️ ACCIÓN REQUERIDA:
1. Evaluar severidad de exposición
2. Rotar todos los secretos encontrados
3. Considerar herramientas de limpieza de historial (git filter-repo, BFG)
4. Notificar a stakeholders

---

## Evidencia

### Captura de comandos ejecutados:

\`\`\`bash
[Log completo de ejecución con timestamps]
\`\`\`

### Hash de verificación:

\`\`\`bash
# Commit actual usado para auditoría
git rev-parse HEAD
# Output: [HASH]
\`\`\`

---

**Auditoría completada**: [FECHA y HORA]  
**Próxima acción**: [TASK-003 o acciones correctivas]
```

---

## 🧪 SCRIPT DE AUDITORÍA

### 1. Crear `scripts/audit-secret-history.sh`

**Ubicación**: `scripts/`  
**Propósito**: Script automatizado de auditoría

```bash
#!/bin/bash

# Script de auditoría histórica de secretos
# Proyecto: Pureza Naturalis V3
# Tarea: TASK-002

set -e  # Exit on error

echo "🔍 Iniciando auditoría histórica de secretos..."
echo "================================================"
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para verificar archivo en historial
check_file_in_history() {
    local file=$1
    local description=$2
    
    echo "📁 Verificando: $description"
    echo "   Archivo: $file"
    
    # Buscar en historial completo
    local result=$(git log --all --full-history --oneline -- "$file" 2>/dev/null)
    
    if [ -z "$result" ]; then
        echo -e "   ${GREEN}✅ LIMPIO${NC} - Nunca fue comiteado"
        echo ""
        return 0
    else
        echo -e "   ${RED}⚠️  ENCONTRADO EN HISTORIAL${NC}"
        echo "   Commits:"
        git log --all --full-history --pretty=format:"      %h %ai %an - %s" -- "$file" 2>/dev/null
        echo ""
        echo ""
        return 1
    fi
}

# Variables de control
found_issues=0

# 1. Verificar backend/.env
check_file_in_history "backend/.env" "Backend environment file" || ((found_issues++))

# 2. Verificar backend/.env.local
check_file_in_history "backend/.env.local" "Backend local environment file" || ((found_issues++))

# 3. Verificar database.sqlite
check_file_in_history "backend/database.sqlite" "SQLite database" || ((found_issues++))

# 4. Verificar database.sqlite-shm
check_file_in_history "backend/database.sqlite-shm" "SQLite shared memory" || ((found_issues++))

# 5. Verificar database.sqlite-wal
check_file_in_history "backend/database.sqlite-wal" "SQLite WAL file" || ((found_issues++))

# 6. Verificar cualquier .env en backend (wildcard)
echo "📁 Verificando: Cualquier archivo .env en backend/"
echo "   Patrón: backend/**/.env*"
local env_files=$(git log --all --full-history --name-only --pretty=format: -- "backend/**/.env*" 2>/dev/null | sort | uniq | grep -v '^$')

if [ -z "$env_files" ]; then
    echo -e "   ${GREEN}✅ LIMPIO${NC} - No se encontraron archivos .env"
else
    echo -e "   ${YELLOW}⚠️  Archivos encontrados:${NC}"
    echo "$env_files" | while read -r file; do
        echo "      - $file"
    done
    ((found_issues++))
fi
echo ""

# Resumen
echo "================================================"
echo "📊 RESUMEN DE AUDITORÍA"
echo "================================================"

if [ $found_issues -eq 0 ]; then
    echo -e "${GREEN}✅ HISTORIAL LIMPIO${NC}"
    echo "   No se encontraron secretos en el historial de Git"
    echo ""
    echo "Próximo paso: TASK-003 - Documentación de gestión de secretos"
    exit 0
else
    echo -e "${RED}⚠️  SE ENCONTRARON $found_issues PROBLEMA(S)${NC}"
    echo ""
    echo "🚨 ACCIÓN REQUERIDA:"
    echo "   1. Revisar los commits identificados arriba"
    echo "   2. Evaluar severidad de exposición"
    echo "   3. Rotar secretos comprometidos"
    echo "   4. Considerar limpieza de historial con git filter-repo"
    echo ""
    echo "   Documentación: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository"
    exit 1
fi
```

**Hacer ejecutable**:
```bash
chmod +x scripts/audit-secret-history.sh
```

---

## 📝 ARCHIVOS A MODIFICAR

### `package.json`

**Añadir script** en la sección `"scripts"`:

```json
{
  "scripts": {
    // ... scripts existentes ...
    "audit:secret-history": "bash scripts/audit-secret-history.sh"
  }
}
```

---

## 🧪 EJECUCIÓN Y VALIDACIÓN

### Paso 1: Ejecutar script de auditoría

```bash
# Opción 1: Ejecutar script directamente
./scripts/audit-secret-history.sh

# Opción 2: Ejecutar via npm
npm run audit:secret-history
```

### Paso 2: Capturar output completo

```bash
# Ejecutar y guardar output
npm run audit:secret-history 2>&1 | tee reports/execution-2025-11-07/audit-output.log
```

### Paso 3: Verificar manualmente (doble verificación)

```bash
# Verificación manual adicional
git log --all --full-history --pretty=format:"%H %ai %an %s" -- backend/.env
git log --all --full-history --pretty=format:"%H %ai %an %s" -- backend/database.sqlite*

# Buscar cualquier mención de "secret", "password", "key" en mensajes de commit
git log --all --grep="secret\|password\|key\|token" --pretty=format:"%H %ai %an %s"

# Listar todos los archivos que alguna vez existieron en backend/
git log --all --pretty=format: --name-only -- backend/ | sort | uniq | grep -E "\.(env|sqlite)"
```

### Paso 4: Completar reporte de auditoría

Usar la plantilla en `reports/execution-2025-11-07/secret-history-audit.md` y llenar con:

1. Output del script
2. Output de verificaciones manuales
3. Análisis de hallazgos
4. Recomendaciones específicas

---

## ✅ CHECKLIST DE VALIDACIÓN

- [ ] Script `scripts/audit-secret-history.sh` creado y ejecutable
- [ ] Reporte `reports/execution-2025-11-07/secret-history-audit.md` completado
- [ ] Script npm `audit:secret-history` añadido a package.json
- [ ] Auditoría ejecutada sin errores
- [ ] Output capturado en `audit-output.log`
- [ ] Verificación manual completada
- [ ] Todos los archivos críticos verificados:
  - [ ] `backend/.env`
  - [ ] `backend/.env.local`
  - [ ] `backend/database.sqlite`
  - [ ] `backend/database.sqlite-shm`
  - [ ] `backend/database.sqlite-wal`
- [ ] Análisis documentado en reporte
- [ ] Recomendaciones claras proporcionadas

---

## 🚨 ESCENARIOS Y ACCIONES

### ESCENARIO A: Historial Limpio ✅

**Hallazgo**: Ningún archivo sensible en historial

**Acciones**:
1. ✅ Marcar TASK-002 como COMPLETADA
2. ✅ Documentar resultado en reporte
3. ✅ Continuar con TASK-003

**Mensaje para Director**:
```
TASK-002: COMPLETADA ✅
Resultado: HISTORIAL LIMPIO
- 0 commits con backend/.env
- 0 commits con database.sqlite*
- Verificación doble confirmada
Reporte: reports/execution-2025-11-07/secret-history-audit.md
```

---

### ESCENARIO B: Secretos Encontrados ⚠️

**Hallazgo**: Archivos sensibles en historial de Git

**Acciones INMEDIATAS**:
1. 🚨 BLOQUEAR TASK-002
2. 🚨 Documentar commits específicos encontrados
3. 🚨 Evaluar severidad:
   - ¿Contenían secretos reales?
   - ¿Cuándo fueron comiteados?
   - ¿El repositorio es público?
4. 🚨 Notificar al Director (Copilot) para decisión

**Mensaje para Director**:
```
TASK-002: ⚠️  BLOQUEADA - SECRETOS ENCONTRADOS

Archivos encontrados en historial:
- backend/.env: [X commits]
  - Primer commit: [HASH] [FECHA]
  - Último commit: [HASH] [FECHA]
- database.sqlite: [Y commits]

Severidad: [ALTA/MEDIA/BAJA]
Repositorio: [PÚBLICO/PRIVADO]

Reporte completo: reports/execution-2025-11-07/secret-history-audit.md

REQUIERE DECISIÓN DEL DIRECTOR:
1. ¿Rotar todos los secretos?
2. ¿Limpiar historial de Git?
3. ¿Notificar stakeholders?
```

**NO continuar con TASK-003 hasta resolver**

---

## 🔧 NOTAS TÉCNICAS PARA GPT-5

### ⚠️ IMPORTANTE:

1. **NO ejecutar comandos destructivos** (git filter-repo, BFG) sin aprobación
2. **NO hacer push** durante esta tarea (solo lectura)
3. **SÍ capturar TODO el output** para evidencia
4. **SÍ ser exhaustivo** - mejor sobre-reportar que omitir

### Compatibilidad Windows:

Si el script bash no funciona en Windows, usar alternativa PowerShell:

```powershell
# scripts/audit-secret-history.ps1
Write-Host "🔍 Iniciando auditoría histórica de secretos..." -ForegroundColor Cyan

$files = @(
    "backend/.env",
    "backend/.env.local",
    "backend/database.sqlite",
    "backend/database.sqlite-shm",
    "backend/database.sqlite-wal"
)

$found_issues = 0

foreach ($file in $files) {
    Write-Host "`n📁 Verificando: $file" -ForegroundColor Yellow
    
    $result = git log --all --full-history --oneline -- $file 2>$null
    
    if ([string]::IsNullOrEmpty($result)) {
        Write-Host "   ✅ LIMPIO - Nunca fue comiteado" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  ENCONTRADO EN HISTORIAL" -ForegroundColor Red
        git log --all --full-history --pretty=format:"      %h %ai %an - %s" -- $file
        $found_issues++
    }
}

if ($found_issues -eq 0) {
    Write-Host "`n✅ HISTORIAL LIMPIO" -ForegroundColor Green
    exit 0
} else {
    Write-Host "`n⚠️  SE ENCONTRARON $found_issues PROBLEMA(S)" -ForegroundColor Red
    exit 1
}
```

---

## 📊 CRITERIOS DE ACEPTACIÓN

1. ✅ Script de auditoría ejecuta sin errores
2. ✅ Todos los archivos críticos verificados
3. ✅ Reporte completo generado
4. ✅ Output capturado para evidencia
5. ✅ Verificación manual realizada
6. ✅ Análisis y recomendaciones documentadas
7. ✅ Si historial limpio → continuar con TASK-003
8. ✅ Si problemas → bloquear y escalar

---

## 📤 FORMATO DE ENTREGA

```markdown
## TASK-002: COMPLETADA ✅

### Archivos creados:
- `scripts/audit-secret-history.sh` (ejecutable)
- `scripts/audit-secret-history.ps1` (alternativa Windows)
- `reports/execution-2025-11-07/secret-history-audit.md`
- `reports/execution-2025-11-07/audit-output.log`

### Archivos modificados:
- `package.json` (script audit:secret-history añadido)

### Resultados de auditoría:
- backend/.env: ✅ LIMPIO (0 commits)
- backend/.env.local: ✅ LIMPIO (0 commits)
- database.sqlite: ✅ LIMPIO (0 commits)
- database.sqlite-shm: ✅ LIMPIO (0 commits)
- database.sqlite-wal: ✅ LIMPIO (0 commits)

### Conclusión:
[HISTORIAL LIMPIO / PROBLEMAS ENCONTRADOS]

### Próximo paso:
[TASK-003 / BLOQUEO Y ESCALACIÓN]

### Evidencia adjunta:
- Reporte completo: `reports/execution-2025-11-07/secret-history-audit.md`
- Logs de ejecución: `reports/execution-2025-11-07/audit-output.log`
```

---

**Última actualización**: 2025-11-07  
**Versión**: 1.0  
**Creado por**: GitHub Copilot (Director de Proyecto)
