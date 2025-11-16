# 🤖 PROMPT PARA GROK - COPIA Y PEGA EXACTO

---

## OPCIÓN 1: PROMPT COMPLETO (RECOMENDADO)

```
Soy Grok Code Fast 1. Voy a ejecutar FASE 1 de correcciones de seguridad para el proyecto Pureza Naturalis V3.

Mi tarea: Implementar 4 correcciones de seguridad críticas en este orden:
1. SEC-SEED-001: Seed password segura
2. SEC-CSP-001: Content Security Policy headers
3. SEC-INPUT-001: Input validation (200 char limit)
4. SEC-RATE-LIMIT-001: Rate limiting (100 req/min)

INSTRUCCIONES:

1. Navego a: C:\Users\Usuario\Desktop\Web Puranatura\Pureza-Naturalis-V3

2. Leo en orden:
   - GROK_PHASE_1_START.md (overview)
   - GROK-TASK-1_SEED_PASSWORD.md (tarea 1)
   - GROK-TASK-2_CSP_HEADERS.md (tarea 2)
   - GROK-TASK-3_INPUT_VALIDATION.md (tarea 3)
   - GROK-TASK-4_RATE_LIMITING.md (tarea 4)
   - GROK-PHASE_1_COMPLETE.md (validación)

3. Ejecuto cada tarea EXACTAMENTE como se describe (paso a paso)

4. Después de cada tarea, verifico que funciona antes de pasar a la siguiente

5. Al final, ejecuto: .\validate-audits.ps1

6. Debo ver: ✅ 7/7 tests passing

7. Luego ejecuto: git add . && git commit -m "feat(security): Phase 1 - SEC-001 fixes" && git push

Comienzo AHORA con GROK_PHASE_1_START.md
```

---

## OPCIÓN 2: PROMPT CORTO (MÍNIMO)

```
Ejecutar FASE 1 de Pureza Naturalis V3:
- Archivo inicio: C:\Users\Usuario\Desktop\Web Puranatura\Pureza-Naturalis-V3\GROK_PHASE_1_START.md
- 4 tareas: Seed password → CSP → Input validation → Rate limiting
- Validación: .\validate-audits.ps1 debe pasar 7/7
- Commit: "feat(security): Phase 1 - SEC-001 fixes"

Comienza ahora.
```

---

## OPCIÓN 3: PROMPT ULTRA TÉCNICO

```
Project: Pureza Naturalis V3 (React + Fastify + SQLite)
Location: C:\Users\Usuario\Desktop\Web Puranatura\Pureza-Naturalis-V3
Task: PHASE 1 Security Implementation

Scope (4 fixes):
1. backend/src/db/seed.ts - Random password generation
2. index.html - CSP meta tags (7 tags)
3. src/utils/api.ts + backend/src/routes/v1/products.ts - Query validation (200 char limit)
4. backend/src/plugins/rateLimit.ts (create) + backend/src/server.ts - Rate limiting (100 req/min)

Execution:
- Follow GROK_PHASE_1_START.md
- Execute 4 tasks in order using provided instruction files
- Run validate-audits.ps1 (expect 7/7 pass)
- Git commit with message: "feat(security): Phase 1 - SEC-001 fixes"

Begin.
```

---

## OPCIÓN 4: PROMPT INTERACTIVO CON CHECKPOINTS

```
GROK CODE FAST 1 - MISIÓN FASE 1

Proyecto: Pureza Naturalis V3
Ubicación: C:\Users\Usuario\Desktop\Web Puranatura\Pureza-Naturalis-V3

=== CHECKPOINT 1 ===
Lee: GROK_PHASE_1_START.md
Confirma: ¿Entiendes las 4 tareas?

=== CHECKPOINT 2 ===
Ejecuta: GROK-TASK-1_SEED_PASSWORD.md
Verifica: npm run db:seed funciona sin errores
Continúa: ¿Listo para TASK 2?

=== CHECKPOINT 3 ===
Ejecuta: GROK-TASK-2_CSP_HEADERS.md
Verifica: index.html tiene 7 meta tags de seguridad
Continúa: ¿Listo para TASK 3?

=== CHECKPOINT 4 ===
Ejecuta: GROK-TASK-3_INPUT_VALIDATION.md
Verifica: curl tests pasan (normal y query larga)
Continúa: ¿Listo para TASK 4?

=== CHECKPOINT 5 ===
Ejecuta: GROK-TASK-4_RATE_LIMITING.md
Verifica: 150 requests = ~100 OK + ~50 429 responses
Continúa: ¿Listo para validación final?

=== CHECKPOINT 6 ===
Ejecuta: .\validate-audits.ps1
Verifica: 7/7 tests passing
Continúa: ¿Listo para commit?

=== CHECKPOINT 7 ===
Ejecuta: git add . && git commit -m "feat(security): Phase 1 - SEC-001 fixes" && git push
Confirma: Push exitoso

=== COMPLETADO ===
FASE 1 LISTA PARA PRODUCCIÓN ✅
```

---

## OPCIÓN 5: PROMPT TIPO "AGENT" (AUTONOMÍA TOTAL)

```
You are Grok Code Fast 1, an expert code execution agent.

Mission: Complete PHASE 1 Security fixes for Pureza Naturalis V3 (React + Fastify)
Location: C:\Users\Usuario\Desktop\Web Puranatura\Pureza-Naturalis-V3

Your autonomy level: MAXIMUM
- You can make decisions about code implementation
- You can troubleshoot errors independently
- You can skip explanations and go straight to implementation
- You verify all changes before moving to next task

Your constraints:
- MUST follow GROK-PHASE_1_START.md as entry point
- MUST execute tasks in order: Task 1 → 2 → 3 → 4
- MUST run validate-audits.ps1 (expect 7/7 pass)
- MUST commit with message: "feat(security): Phase 1 - SEC-001 fixes"
- CANNOT skip any task
- CANNOT modify tasks beyond what's specified

Begin execution NOW. Report progress after each checkpoint.
```

---

## OPCIÓN 6: PROMPT "COPY-PASTE READY" (PARA VS CODE CHAT)

```
@Grok

Ejecutar Fase 1 seguridad - Pureza Naturalis V3

Ruta: C:\Users\Usuario\Desktop\Web Puranatura\Pureza-Naturalis-V3

Tareas (en orden):
1️⃣ GROK-TASK-1_SEED_PASSWORD.md
2️⃣ GROK-TASK-2_CSP_HEADERS.md
3️⃣ GROK-TASK-3_INPUT_VALIDATION.md
4️⃣ GROK-TASK-4_RATE_LIMITING.md

Validación:
- .\validate-audits.ps1 → debe mostrar 7/7 ✅
- git add . && git commit -m "feat(security): Phase 1 - SEC-001 fixes"

Comienza ahora - ¡adelante!
```

---

## 📋 RECOMENDACIÓN SEGÚN EL CANAL

| Dónde ejecutes | Prompt recomendado | Por qué |
|----------------|-------------------|---------|
| **Chat de Grok directo** | Opción 1 (Completo) | Contexto completo necesario |
| **VS Code Chat (@Grok)** | Opción 6 (Copy-paste ready) | Interface visual, menos verbose |
| **Automático/API** | Opción 3 (Ultra técnico) | Máxima precisión, sin ambigüedad |
| **Con checkpoints** | Opción 4 (Interactivo) | Validar progreso entre tareas |
| **Como agente autónomo** | Opción 5 (Agent type) | Más libertad en troubleshooting |
| **Rápido y directo** | Opción 2 (Corto) | Solo lo esencial |

---

## 🎯 PROMPT FINAL ELEGIDO (Mi recomendación)

**Usa ESTA opción:**

```
Soy Grok. Voy a completar FASE 1 del proyecto Pureza Naturalis V3.

Ubicación: C:\Users\Usuario\Desktop\Web Puranatura\Pureza-Naturalis-V3

4 tareas en orden:
1. GROK-TASK-1_SEED_PASSWORD.md → Seed password segura
2. GROK-TASK-2_CSP_HEADERS.md → CSP meta tags
3. GROK-TASK-3_INPUT_VALIDATION.md → Input validation (200 chars)
4. GROK-TASK-4_RATE_LIMITING.md → Rate limiting (100 req/min)

Proceso:
✅ Leo GROK_PHASE_1_START.md primero
✅ Ejecuto cada tarea exactamente como se describe
✅ Verifico cada cambio antes de continuar
✅ Ejecuto .\validate-audits.ps1 (esperado: 7/7 pass)
✅ Hago commit: git add . && git commit -m "feat(security): Phase 1 - SEC-001 fixes" && git push

Comienzo AHORA.
```

---

## 🚀 INSTRUCCIONES PARA ENVIAR A GROK

### Si es en VS Code Chat:
```
1. Abre VS Code
2. Presiona Ctrl+Shift+P
3. Escribe "Chat: Open" o "@Grok"
4. Copia y pega el PROMPT FINAL ELEGIDO (arriba)
5. Presiona Enter
```

### Si es en Grok Web:
```
1. Ve a grok.com
2. Nueva conversación
3. Copia y pega el PROMPT FINAL ELEGIDO
4. Envía
```

### Si es por API/Automatizado:
```
POST /grok/chat
{
  "message": "[PROMPT FINAL ELEGIDO]",
  "context": "C:\\Users\\Usuario\\Desktop\\Web Puranatura\\Pureza-Naturalis-V3",
  "taskType": "phase1-security",
  "autonomyLevel": "high"
}
```

---

## ✅ CHECKLIST: ANTES DE ENVIAR A GROK

- [ ] Tengo el prompt elegido (recomiendo el "FINAL ELEGIDO")
- [ ] He revisado que TODOS los archivos GROK-*.md existen
- [ ] He revisado que validate-audits.ps1 existe
- [ ] He hecho git status (proyecto limpio)
- [ ] Tengo lista la ubicación exacta: C:\Users\Usuario\Desktop\Web Puranatura\Pureza-Naturalis-V3
- [ ] He copiado el prompt exacto (sin modificar)

---

## 📊 MÉTRICAS DE ÉXITO ESPERADAS

Después que Grok termine, deberías ver:

```
✅ 7/7 tests passing en validate-audits.ps1
✅ Git commit exitoso con message "feat(security): Phase 1 - SEC-001 fixes"
✅ Sin errores en npm run build
✅ Sin errores en TypeScript compilation
✅ Backend inicia sin errores
✅ Frontend inicia sin errores
✅ 4 archivos modificados (seed.ts, index.html, api.ts, products.ts)
✅ 1 archivo creado (rateLimit.ts)
```

Si ves TODO esto: ✅ **FASE 1 COMPLETADA CON ÉXITO**

---

**¿Cuál opción prefieres usar?** (Yo recomiendo la "FINAL ELEGIDO")

