# Ajustes Recomendados al Plan de Mejora PuraNatura

**Fecha:** 03 de Diciembre de 2025  
**Auditor:** GitHub Copilot (Gemini 3 Pro)  
**Objetivo:** Corregir y refinar el plan de mejora para garantizar su ejecución exitosa por modelos de IA sencillos (GPT-4.1, GPT-5-mini, Raptor mini) en entorno Windows con Node.js, sin Docker ni Kubernetes.

---

## 📋 Resumen Ejecutivo

El **Plan de Mejora** contenido en esta carpeta es conceptualmente sólido y sigue mejores prácticas de ingeniería de software. Sin embargo, presenta **riesgos críticos de ejecución en Windows** y barreras de adopción para agentes de IA con capacidades limitadas, principalmente debido a:

1. **Dependencias implícitas no documentadas** (paquetes npm faltantes).
2. **Comandos específicos de Linux/Bash** que fallarán en PowerShell.
3. **Esqueletos de código abstractos** (pseudocódigo) que requieren interpretación avanzada.
4. **Riesgos de integridad de datos** en operaciones de backup con SQLite en modo WAL.

Este documento proporciona **justificaciones técnicas detalladas** y **correcciones concretas** para cada problema identificado.

---

## 🔍 Análisis DAFO (SWOT) del Plan

### 💪 Fortalezas (Strengths)

#### 1. **Modularidad y Estructura Clara**

**Observación:** El plan sigue una jerarquía `Plan-Maestro.md → Checklist → Playbooks → Skeletons` que reduce la carga cognitiva.

**Justificación:** Los modelos de IA con límites de contexto (4K-32K tokens) se benefician de documentos modulares. En lugar de procesar un documento monolítico de 10,000 líneas, pueden cargar solo el playbook relevante (ej. `Breaker-Playbook.md` con ~150 líneas).

**Impacto:** ✅ **Positivo.** Esta estructura es ideal para agentes autónomos y debe mantenerse.

---

#### 2. **Seguridad por Diseño**

**Observación:** El plan enfatiza principios _deny-by-default_, gestión de secretos local en carpeta `Secretos/` (gitignored) y validación de deriva (drift) con scripts de escaneo.

**Justificación:**

- **Secretos fuera del repositorio:** Previene exposición accidental en commits (el error de seguridad #1 en proyectos open-source).
- **Validación de drift:** El script `check-secret-drift` detecta cuando claves o tokens se filtran fuera de `Secretos/`, actuando como última línea de defensa antes del PR.
- **Principio de mínimo privilegio:** Endpoint `/metrics` protegido con autenticación evita que atacantes obtengan métricas internas (tiempo de respuesta, errores) para planificar ataques.

**Impacto:** ✅ **Positivo.** Alineado con OWASP Top 10 y estándares de la industria.

---

#### 3. **Métricas de Éxito Cuantificables**

**Observación:** Cada fase define criterios de salida medibles (ej. "p95 < 300ms", "CSP violations/1k < 1", "cobertura ≥ 80%").

**Justificación:** Un agente de IA puede **verificar objetivamente** si completó la tarea ejecutando comandos de prueba y comparando salidas con los umbrales. Sin métricas claras, el modelo podría declarar "tarea completada" sin validación real.

**Ejemplo:**

```bash
# En lugar de "mejorar el rendimiento" (ambiguo)
# El plan especifica:
npm run perf:api
# Esperar: p95_latency < 300ms (verificable en JSON de salida)
```

**Impacto:** ✅ **Positivo.** Esencial para agentes autónomos.

---

#### 4. **Estrategia de Rollback Documentada**

**Observación:** Cada fase incluye instrucciones de reversión (ej. "volver CSP a reportOnly si UI se rompe").

**Justificación:** Los modelos de IA pueden cometer errores (ej. introducir un bug en producción). Tener procedimientos de rollback explícitos permite a un agente:

- Detectar el fallo (ej. tests E2E fallan).
- Ejecutar rollback automático.
- Registrar el incidente para análisis humano.

**Impacto:** ✅ **Positivo.** Reduce riesgo de downtime prolongado.

---

### 📉 Debilidades (Weaknesses)

#### 1. **Incompatibilidad con Windows/PowerShell** ⚠️ **CRÍTICO**

**Observación:** Los comandos en `Runbook-Backups.md` asumen shell Unix/Linux:

```bash
cp backend/prisma/dev.db backups/dev-$(date +%Y%m%d).db
sha256sum backups/dev-*.db >> backups/hashes.txt
```

**Problema:**

- `cp` no existe en PowerShell (equivalente: `Copy-Item`).
- `date +%Y%m%d` falla; PowerShell usa `Get-Date -Format "yyyyMMdd"`.
- `sha256sum` no está disponible por defecto (equivalente: `Get-FileHash`).

**Justificación Técnica:**  
PowerShell tiene una sintaxis radicalmente diferente de Bash. Un modelo de IA que intente ejecutar literalmente estos comandos recibirá errores como:

```
cp : El término 'cp' no se reconoce como nombre de un cmdlet...
```

El agente podría:

- **Escenario A:** Intentar instalar `cp` (fallará, no es instalable).
- **Escenario B:** Entrar en bucle pidiendo ayuda.
- **Escenario C:** Declarar fallo y detener la ejecución.

**Impacto:** 🔴 **Bloqueante.** La Fase 2 (backups) no se puede ejecutar en Windows sin modificación.

**Solución Propuesta:**
Añadir sección explícita en `Runbook-Backups.md`:

````markdown
### Comandos para Windows (PowerShell)

```powershell
# 1. Backup de base de datos
$fecha = Get-Date -Format "yyyyMMdd"
Copy-Item "backend/prisma/dev.db" -Destination "backups/dev-$fecha.db"

# 2. Backup de Secretos (con permisos)
Copy-Item -Path "Secretos" -Destination "backups/Secretos-$fecha" -Recurse -Force

# 3. Generar hashes de integridad
Get-FileHash "backups/dev-$fecha.db" -Algorithm SHA256 |
  Select-Object Algorithm, Hash, Path |
  Out-File "backups/hashes.txt" -Append

# 4. Comprimir (opcional)
Compress-Archive -Path "backups/dev-$fecha.db", "backups/Secretos-$fecha" `
                 -DestinationPath "backups/snapshot-$fecha.zip"
```
````

````

---

#### 2. **Esqueletos de Código Abstractos (Pseudocódigo)**
**Observación:** Los archivos `*.skeleton.*` contienen principalmente comentarios con pseudocódigo:

```typescript
// catalog-breaker.skeleton.ts (líneas 14-87)
/* Pseudocódigo sugerido:

type State = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

interface BreakerConfig {
  failureThreshold: number;
  // ...
}
*/
````

**Problema:**  
Un modelo "mini" (GPT-4.1 o similar) tiene capacidad limitada para:

- Interpretar comentarios en español/inglés.
- Convertir lógica abstracta a código TypeScript sintácticamente correcto.
- Manejar edge cases no documentados (ej. ¿qué pasa si `openedAt` es `undefined`?).

**Justificación Técnica:**  
Los modelos pequeños están optimizados para **seguir patrones existentes**, no para "inventar" implementaciones desde cero. Si el esqueleto es un comentario, el modelo podría:

- Generar código con errores de tipos (`failures: number[]` sin inicializar).
- Omitir manejo de errores (ej. división por cero en cálculos de ventana).
- Crear código no idempotente (ej. breaker se abre/cierra erráticamente).

**Impacto:** 🟠 **Alto Riesgo.** La Fase 2 (circuit breaker) requiere implementación compleja; alta probabilidad de bugs.

**Solución Propuesta:**
Convertir el esqueleto a **código funcional pero deshabilitado**:

```typescript
// backend/src/services/catalogBreaker.ts (NO ACTIVO - configurar BREAKER_ENABLED=true)

export type BreakerState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

interface BreakerConfig {
  failureThreshold: number; // default: 5
  windowMs: number; // default: 30_000
  openTimeoutMs: number; // default: 60_000
  halfOpenProbes: number; // default: 2
}

export class CatalogBreaker {
  private state: BreakerState = 'CLOSED';
  private failures: number[] = [];
  private openedAt?: number;
  private halfOpenAttempts = 0;

  constructor(
    private config: BreakerConfig = {
      failureThreshold: 5,
      windowMs: 30_000,
      openTimeoutMs: 60_000,
      halfOpenProbes: 2,
    }
  ) {}

  shouldShortCircuit(): boolean {
    if (this.state === 'OPEN') {
      const elapsed = Date.now() - (this.openedAt || 0);
      if (elapsed >= this.config.openTimeoutMs) {
        this.state = 'HALF_OPEN';
        this.halfOpenAttempts = 0;
        return false;
      }
      return true;
    }
    return false;
  }

  recordSuccess(): void {
    if (this.state === 'HALF_OPEN') {
      this.halfOpenAttempts++;
      if (this.halfOpenAttempts >= this.config.halfOpenProbes) {
        this.reset();
      }
    } else if (this.state === 'CLOSED') {
      this.failures = [];
    }
  }

  recordFailure(): void {
    const now = Date.now();
    this.failures = this.failures.filter(
      (t) => now - t <= this.config.windowMs
    );
    this.failures.push(now);

    if (this.failures.length >= this.config.failureThreshold) {
      this.trip();
    } else if (this.state === 'HALF_OPEN') {
      this.trip();
    }
  }

  private trip(): void {
    this.state = 'OPEN';
    this.openedAt = Date.now();
    this.halfOpenAttempts = 0;
    console.warn('[CatalogBreaker] Circuit OPENED - catalog degraded');
  }

  private reset(): void {
    this.state = 'CLOSED';
    this.failures = [];
    this.halfOpenAttempts = 0;
    console.info('[CatalogBreaker] Circuit CLOSED - catalog recovered');
  }
}
```

**Ventaja:** El modelo solo necesita **importar y conectar** (tarea de dificultad baja) en lugar de **crear desde cero** (tarea de dificultad alta).

---

#### 3. **Dependencias Implícitas No Documentadas**

**Observación:** El esqueleto `check-secret-drift.skeleton.cjs` usa `require('glob')`, pero `glob` no está en `package.json`.

**Problema:**  
Cuando el agente intente ejecutar el script:

```bash
node scripts/check-secret-drift.cjs
```

Fallará con:

```
Error: Cannot find module 'glob'
```

**Justificación Técnica:**  
Node.js no incluye `glob` en su librería estándar. El script asume que está instalado pero no lo declara como prerrequisito.

**Impacto:** 🟡 **Medio.** Bloquea Fase 1 (seguridad) hasta que se instale manualmente.

**Solución Propuesta:**

1. **Actualizar `package.json`:**

   ```bash
   npm install -D glob
   ```

2. **Documentar en `Plan-Maestro.md` (Fase -1: Prerrequisitos):**

   ````markdown
   ### Instalación de Dependencias de Desarrollo

   ```bash
   npm install -D glob cross-env
   ```
   ````

   ```

   ```

---

#### 4. **Riesgo de Corrupción de SQLite en Backups** ⚠️ **CRÍTICO**

**Observación:** El `Runbook-Backups.md` sugiere copiar `dev.db` con `cp` mientras la aplicación está corriendo.

**Problema:**  
SQLite en modo **WAL (Write-Ahead Logging)** usa 3 archivos:

- `dev.db` (base de datos principal)
- `dev.db-wal` (log de escrituras pendientes)
- `dev.db-shm` (memoria compartida)

Si copias solo `dev.db` mientras hay transacciones activas:

- El archivo copiado estará en **estado inconsistente**.
- Al restaurar, la base de datos podría estar corrupta (errores "database disk image is malformed").

**Justificación Técnica:**  
Según la documentación oficial de SQLite:

> "Copying a database file while a write transaction is in progress can result in a corrupt copy."

**Impacto:** 🔴 **Crítico.** Los backups podrían ser inútiles en caso de desastre.

**Solución Propuesta:**
Usar uno de estos métodos seguros:

**Opción A: Backup Online (sin detener el servidor)**

```typescript
// backend/scripts/safe-backup.ts
import { PrismaClient } from '@prisma/client';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const prisma = new PrismaClient();

async function safeBackup() {
  const fecha = new Date().toISOString().split('T')[0].replace(/-/g, '');

  // Usar VACUUM INTO (SQLite 3.27+)
  await prisma.$executeRawUnsafe(`VACUUM INTO 'backups/dev-${fecha}.db'`);

  console.log(`✓ Backup creado: backups/dev-${fecha}.db`);
  await prisma.$disconnect();
}

safeBackup().catch(console.error);
```

**Opción B: Detener Servidor (solo dev/staging)**

```powershell
# 1. Detener servidor
npm run stop-server  # (crear script que mate el proceso)

# 2. Copiar archivos
Copy-Item "backend/prisma/dev.db*" -Destination "backups/"

# 3. Reiniciar
npm run dev
```

**Recomendación:** Usar Opción A para minimizar downtime.

---

### 🚀 Oportunidades (Opportunities)

#### 1. **Estandarización Cross-Platform con Node.js**

**Observación:** Los comandos de shell podrían reemplazarse completamente por scripts de Node.js usando `fs`, `path` y `child_process`.

**Justificación:**

- **Portabilidad:** Un script Node.js funciona idénticamente en Windows, Linux y macOS.
- **Control de errores:** Manejo explícito de excepciones vs. códigos de salida opacos de shell.
- **Integración CI/CD:** Más fácil depurar logs de Node.js que stderr de Bash.

**Ejemplo de Migración:**

**Antes (Bash):**

```bash
cp backend/prisma/dev.db backups/dev-$(date +%Y%m%d).db
sha256sum backups/dev-*.db >> backups/hashes.txt
```

**Después (Node.js):**

```javascript
// scripts/backup-db.cjs
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const fecha = new Date().toISOString().split('T')[0].replace(/-/g, '');
const src = 'backend/prisma/dev.db';
const dest = `backups/dev-${fecha}.db`;

// Copiar archivo
fs.copyFileSync(src, dest);

// Calcular hash
const hash = crypto
  .createHash('sha256')
  .update(fs.readFileSync(dest))
  .digest('hex');

// Guardar hash
fs.appendFileSync('backups/hashes.txt', `${hash} ${dest}\n`);

console.log(`✓ Backup completado: ${dest}`);
```

**Impacto:** ✅ **Alto Valor.** Elimina completamente la barrera Windows/Linux.

---

#### 2. **Automatización de Prerrequisitos con Setup Script**

**Observación:** El plan asume que herramientas como `gitleaks`, `k6`, `glob` están disponibles.

**Justificación:**  
Un modelo de IA no puede instalar binarios del sistema operativo (requiere privilegios). Proveer un script que:

- Detecte qué falta.
- Instale lo que pueda vía npm.
- Muestre instrucciones claras para lo que debe instalarse manualmente.

**Implementación Sugerida:**

```javascript
// scripts/setup-plan.cjs
const { execSync } = require('child_process');

function checkCommand(cmd) {
  try {
    execSync(`${cmd} --version`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

console.log('🔍 Verificando prerrequisitos del Plan de Mejora...\n');

// Dependencias npm
const npmDeps = ['glob'];
const missing = npmDeps.filter((dep) => {
  try {
    require.resolve(dep);
    return false;
  } catch {
    return true;
  }
});

if (missing.length) {
  console.log(`❌ Faltan dependencias npm: ${missing.join(', ')}`);
  console.log('   Ejecuta: npm install -D ' + missing.join(' '));
} else {
  console.log('✓ Dependencias npm OK');
}

// Herramientas sistema
const tools = [
  { name: 'gitleaks', cmd: 'gitleaks' },
  { name: 'k6', cmd: 'k6' },
];

tools.forEach(({ name, cmd }) => {
  if (checkCommand(cmd)) {
    console.log(`✓ ${name} disponible`);
  } else {
    console.log(`⚠️  ${name} no encontrado`);
    console.log(
      `   Instalar desde: https://github.com/${name === 'k6' ? 'grafana/k6' : 'gitleaks/gitleaks'}/releases`
    );
  }
});
```

**Impacto:** ✅ **Medio Valor.** Reduce fricción inicial para cualquier ejecutor.

---

### ⚠️ Amenazas (Threats)

#### 1. **Bloqueo del Agente por Errores No Manejados**

**Observación:** Si el agente encuentra un error (ej. módulo no encontrado), modelos sencillos pueden entrar en bucle infinito.

**Justificación:**  
Los modelos "mini" tienen menos capacidad de razonamiento abstracto. Cuando fallan, tienden a:

- Reintentar la misma acción (definición de locura).
- Pedir al usuario que "instale manualmente" (interrumpiendo la automatización).
- Ejecutar comandos aleatorios en busca de una solución (peligroso).

**Mitigación Propuesta:**

- Añadir **guardias de precondición** explícitas en el checklist:

  ```markdown
  - [ ] **PRE-FASE-1:** Ejecutar `node scripts/setup-plan.cjs` y verificar que todos los checks son ✓.
  ```

- Incluir **códigos de salida estándar** en scripts:
  ```javascript
  if (missing.length > 0) {
    console.error('❌ Setup incompleto. Revisa arriba.');
    process.exit(1); // Detener claramente
  }
  ```

**Impacto:** ✅ **Reduce Riesgo.** El agente falla rápido y limpio en lugar de contaminar el código.

---

#### 2. **Falsos Positivos de Seguridad**

**Observación:** Si el script `check-secret-drift` tiene bugs (ej. regex mal escrita), podría:

- No detectar secretos reales (falso negativo → vulnerabilidad).
- Detectar código legítimo como secreto (falso positivo → bloquea PR).

**Justificación Técnica:**  
Los patrones de regex para detectar claves API son heurísticos imperfectos. Por ejemplo:

```regex
/[A-Za-z0-9]{32}/  // ¿Es un JWT, un hash MD5, o un ID aleatorio?
```

**Mitigación Propuesta:**

1. **Probar con Dataset Conocido:**

   ```javascript
   // test/utils/check-secret-drift.test.ts
   it('debe detectar cadenas con forma de JWT', () => {
     const content =
       'const token = "example-jwt-placeholder.example-payload.placeholder-signature";';
     expect(detectSecrets(content)).toContain('JWT');
   });
   ```

2. **Allowlist Explícita:**
   ```json
   // scripts/patterns/secrets.json
   {
     "allowlist": [
       "test/fixtures/*.json", // Datos de prueba OK
       "docs/examples/*.md" // Ejemplos de documentación
     ]
   }
   ```

**Impacto:** ✅ **Reduce Falsos Positivos.** Aumenta confianza en el sistema.

---

## 📊 Matriz de Prioridades (Correcciones Críticas)

| ID     | Problema                        | Severidad  | Esfuerzo | Prioridad | Justificación                               |
| ------ | ------------------------------- | ---------- | -------- | --------- | ------------------------------------------- |
| **C1** | Comandos Bash en Backups        | 🔴 Crítica | 2h       | **P0**    | Bloquea Fase 2; riesgo corrupción DB        |
| **C2** | Esqueletos abstractos (Breaker) | 🟠 Alta    | 4h       | **P1**    | Alta probabilidad de bugs en implementación |
| **C3** | Dependencia `glob` faltante     | 🟡 Media   | 15min    | **P1**    | Bloquea Fase 1; fácil de resolver           |
| **C4** | Falta script de prerrequisitos  | 🟢 Baja    | 1h       | **P2**    | Mejora UX pero no bloquea ejecución         |

---

## 🛠️ Plan de Acción Concreto (Para Implementar YA)

### ✅ Tarea 1: Instalar Dependencias (15 min)

```bash
npm install -D glob
```

**Verificación:**

```bash
node -e "require('glob')"  # No debe fallar
```

---

### ✅ Tarea 2: Actualizar `Runbook-Backups.md` (30 min)

**Añadir al final de la sección "Procedimiento de Backup":**

````markdown
## Comandos para Windows (PowerShell)

### Backup Manual

```powershell
# Crear carpeta si no existe
New-Item -ItemType Directory -Path "backups" -Force | Out-Null

# Fecha en formato YYYYMMDD
$fecha = Get-Date -Format "yyyyMMdd"

# Copiar base de datos (NOTA: Detener servidor primero en dev para evitar corrupción)
Copy-Item "backend/prisma/dev.db" -Destination "backups/dev-$fecha.db"

# Copiar Secretos
Copy-Item -Path "Secretos" -Destination "backups/Secretos-$fecha" -Recurse -Force

# Calcular hashes
Get-FileHash "backups/dev-$fecha.db" -Algorithm SHA256 |
  Select-Object @{Name='File';Expression={Split-Path $_.Path -Leaf}}, Hash |
  Export-Csv "backups/hashes.csv" -Append -NoTypeInformation

Write-Host "✓ Backup completado: dev-$fecha.db" -ForegroundColor Green
```
````

### Backup Automático (Opción Segura - Sin Detener Servidor)

```javascript
// backend/scripts/safe-backup.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function backup() {
  const fecha = new Date().toISOString().split('T')[0].replace(/-/g, '');
  await prisma.$executeRawUnsafe(`VACUUM INTO 'backups/dev-${fecha}.db'`);
  console.log(`✓ Backup: dev-${fecha}.db`);
  await prisma.$disconnect();
}

backup().catch((e) => {
  console.error(e);
  process.exit(1);
});
```

**Ejecutar:**

```powershell
npx ts-node backend/scripts/safe-backup.ts
```

```

---

### ✅ Tarea 3: Convertir Esqueletos a Código Real (4 horas)

**Reemplazar `catalog-breaker.skeleton.ts` por implementación funcional** (código completo proporcionado arriba en sección "Debilidades #2").

**Ubicación final sugerida:**
```

backend/src/services/catalogBreaker.ts (código real)

````

**Uso en rutas:**
```typescript
// backend/src/routes/products.ts
import { CatalogBreaker } from '../services/catalogBreaker';

const breaker = new CatalogBreaker({
  failureThreshold: parseInt(process.env.BREAKER_THRESHOLD || '5'),
  windowMs: 30_000,
  openTimeoutMs: 60_000,
  halfOpenProbes: 2
});

router.get('/products', async (req, res) => {
  if (breaker.shouldShortCircuit()) {
    return res.status(503)
      .setHeader('X-Backend-Degraded', 'true')
      .setHeader('Retry-After', '30')
      .json({ code: 'CATALOG_DEGRADED', message: 'Catálogo temporalmente no disponible' });
  }

  try {
    const products = await prisma.product.findMany();
    breaker.recordSuccess();
    res.json(products);
  } catch (error) {
    breaker.recordFailure();
    throw error;
  }
});
````

---

### ✅ Tarea 4: Crear Script de Setup (1 hora)

**Archivo:** `scripts/setup-plan.cjs`

**Contenido:** (Código completo en sección "Oportunidades #2")

**Añadir al checklist en `Checklist-Plan-Maestro.md`:**

```markdown
## Pre-Fase (-1) — Prerrequisitos

- [ ] Ejecutar `node scripts/setup-plan.cjs` y verificar que todos los checks son ✓.
- [ ] Si faltan herramientas (gitleaks, k6), instalarlas siguiendo las instrucciones del script.
```

---

## 📝 Cambios Documentales Requeridos

### 1. Actualizar `Plan-Maestro.md`

**Añadir al inicio (después de "Contexto y principios"):**

````markdown
## Prerrequisitos (Fase -1)

### Software Requerido

- **Node.js:** >= 20.0.0
- **npm:** >= 10.0.0
- **PowerShell:** 5.1+ (Windows) o equivalente shell en Linux/Mac

### Dependencias de Desarrollo

Instalar antes de empezar:

```bash
npm install -D glob cross-env
```
````

### Herramientas Externas (Opcionales pero Recomendadas)

- **gitleaks:** Escaneo de secretos ([releases](https://github.com/gitleaks/gitleaks/releases))
- **k6:** Tests de carga ([releases](https://github.com/grafana/k6/releases))

### Verificación

Ejecutar:

```bash
node scripts/setup-plan.cjs
```

Todos los checks deben ser ✓ antes de proceder.

````

---

### 2. Actualizar `README.md` (Plan-mejora/)

**Añadir después de "Cómo usar este directorio":**

```markdown
## ⚠️ Notas Específicas de Windows

Los comandos de backup y scripts asumen **PowerShell 5.1+**.

### Diferencias Clave
| Linux/Bash | Windows/PowerShell |
|------------|-------------------|
| `cp file dest` | `Copy-Item file dest` |
| `date +%Y%m%d` | `Get-Date -Format "yyyyMMdd"` |
| `sha256sum` | `Get-FileHash -Algorithm SHA256` |

**Todos los ejemplos de PowerShell están documentados en los playbooks.**
````

---

## 🎯 Métricas de Éxito de estas Correcciones

Después de aplicar los ajustes, el plan debe cumplir:

1. ✅ **Portabilidad:** Scripts ejecutables en Windows sin modificación.
2. ✅ **Reproducibilidad:** Un agente de IA puede ejecutar `scripts/setup-plan.cjs` y obtener diagnóstico claro.
3. ✅ **Integridad de Datos:** Backups de SQLite verificados sin corrupción.
4. ✅ **Reducción de Ambigüedad:** Código real en lugar de pseudocódigo en esqueletos críticos.

---

## 🔄 Próximos Pasos Recomendados

1. **Implementar Tarea 1-4** (este documento).
2. **Probar en Entorno Limpio:**

   ```bash
   git clone <repo>
   cd web-puranatura---terapias-naturales
   node scripts/setup-plan.cjs
   # Debe pasar sin errores
   ```

3. **Validar con Modelo de IA:**
   - Dar acceso a GPT-4.1 al `Plan-Maestro.md` actualizado.
   - Pedirle que ejecute Fase 0.
   - Verificar que no se bloquea en comandos de shell.

4. **Documentar Lecciones Aprendidas:**
   - Si surge un nuevo bloqueante, añadirlo a este documento.

---

## 📚 Referencias y Recursos

### Documentación Oficial

- **SQLite Backup:** https://www.sqlite.org/backup.html
- **SQLite WAL Mode:** https://www.sqlite.org/wal.html
- **PowerShell vs Bash:** https://learn.microsoft.com/en-us/powershell/scripting/learn/ps101/01-getting-started

### Patrones de Circuit Breaker

- **Martin Fowler:** https://martinfowler.com/bliki/CircuitBreaker.html
- **Resilience4j (referencia Java):** https://resilience4j.readme.io/docs/circuitbreaker

### Seguridad en Node.js

- **OWASP Top 10:** https://owasp.org/www-project-top-ten/
- **Gitleaks Patterns:** https://github.com/gitleaks/gitleaks/tree/master/config

---

## ✍️ Conclusión

El **Plan de Mejora** es excelente en su concepción estratégica pero requiere **ajustes tácticos** para ser ejecutable por modelos de IA en Windows. Las correcciones propuestas son:

- **Factibles:** Pueden completarse en ~8 horas de trabajo humano.
- **De Alto Impacto:** Eliminan bloqueantes críticos (backups, esqueletos, dependencias).
- **Sostenibles:** Hacen el plan cross-platform y mantenible a largo plazo.

Una vez implementadas, el plan estará listo para ser ejecutado por **cualquier agente de IA** con capacidades básicas de seguimiento de instrucciones y ejecución de comandos Node.js/PowerShell.

---

**Firma del Auditor:**  
GitHub Copilot (Gemini 3 Pro)  
Fecha: 03/12/2025
