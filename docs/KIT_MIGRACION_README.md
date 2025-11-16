# README: Kit de Migración Backend

## 📦 Contenido del Kit

Este kit contiene todo lo necesario para que **GPT-5-codex-LOW** ejecute la migración completa del proyecto a backend SQLite + API REST.

### Estructura Generada

```
docs/
├── PLAN_MIGRACION_COMPLETO.md     # Plan maestro (LEER PRIMERO)
├── fase0_setup_backend.md          # Instrucciones detalladas Fase 0
├── fase1_autenticacion.md          # Instrucciones detalladas Fase 1
└── checklists/
    ├── seguridad.md                # Checklist de seguridad
    ├── rendimiento.md              # Checklist de rendimiento
    └── accesibilidad.md            # Checklist de accesibilidad

templates/
└── backend/
    ├── package.json                # Dependencias del backend
    ├── tsconfig.json               # Configuración TypeScript
    └── .env.example                # Variables de entorno

scripts/
├── setup_backend.ps1               # Setup automatizado
└── validate_phase.ps1              # Validación por fase
```

---

## 🚀 Instrucciones para GPT-5-codex-LOW

### **Paso 1: Leer el Plan Completo**

Abre y lee completamente: `docs/PLAN_MIGRACION_COMPLETO.md`

Este documento contiene:
- Contexto y objetivos
- Stack técnico decidido
- Estructura del proyecto
- Fases con criterios de éxito
- Métricas objetivo
- Riesgos y mitigaciones

**No empieces a codear sin leer esto primero.**

---

### **Paso 2: Ejecutar Setup Automatizado**

```powershell
cd "c:\Users\Usuario\Desktop\Web Puranatura\Pureza-Naturalis-V3"
.\scripts\setup_backend.ps1
```

Este script:
- Crea estructura de carpetas
- Copia templates
- Instala dependencias
- Valida entorno

**Resultado esperado:** Estructura backend/ lista con package.json, tsconfig.json, .env

---

### **Paso 3: Implementar Fase 0**

Abre: `docs/fase0_setup_backend.md`

Sigue **CADA PASO NUMERADO**:
- PASO 1 a PASO 17 (todos detallados)
- Cada paso tiene:
  - Acción clara
  - Código de ejemplo o template a usar
  - Comando de validación

**Archivos a implementar:**
1. `backend/src/config/index.ts` - Carga de variables de entorno
2. `backend/src/db/schema.ts` - Schema Drizzle (tablas)
3. `backend/src/db/client.ts` - Conexión SQLite
4. `backend/src/db/migrate.ts` - Script de migraciones
5. `backend/src/db/seed.ts` - Cargar productos iniciales
6. `backend/src/index.ts` - Servidor Fastify

**Validación:**
```powershell
.\scripts\validate_phase.ps1 -Phase 0
```

Si pasa → ✅ Fase 0 completa, proceder a Fase 1

---

### **Paso 4: Implementar Fase 1**

Abre: `docs/fase1_autenticacion.md`

Sigue PASO 1 a PASO 14:
- Implementar auth (signup, login, logout)
- Middleware de autenticación
- Tests de auth
- Migrar frontend AuthContext

**Validación:**
```powershell
.\scripts\validate_phase.ps1 -Phase 1
```

Si pasa → ✅ Fase 1 completa

---

### **Paso 5-8: Continuar con Fases Restantes**

*(No generadas aún para ahorrar tokens, se generarán cuando llegues)*

- Fase 2: Productos API
- Fase 3: Inventario
- Fase 4: Seguridad
- Fase 5: Deploy

---

## 📝 Cómo Usar los Templates

Los templates tienen **comentarios TODO** claros:

```typescript
// TODO: Implementar login
export async function login(data: LoginInput): Promise<User | null> {
  // 1. Buscar usuario por email
  // 2. Si no existe, retornar null
  // 3. Comparar password con bcrypt.compare
  // 4. Si no coincide, retornar null
  // 5. Retornar usuario (sin password_hash)
}
```

**Tu trabajo:**
1. Leer el TODO
2. Implementar siguiendo los pasos numerados
3. Validar con comandos indicados

---

## ✅ Checklists de Validación

Usa los checklists en `docs/checklists/` para validar:

- **seguridad.md**: Antes de deploy, verifica que TODO esté marcado
- **rendimiento.md**: Después de Fase 2, verifica métricas
- **accesibilidad.md**: Después de Fase 3, verifica a11y

---

## 🆘 Troubleshooting

Cada archivo de instrucciones tiene sección de troubleshooting al final.

Si encuentras un error:
1. Busca en sección "Troubleshooting" del doc de la fase
2. Si no está ahí, reporta a usuario con:
   - Error completo
   - Archivo donde ocurre
   - Comando ejecutado
   - Logs relevantes

El usuario consultará con Claude Sonnet 4.5 si es necesario.

---

## 📊 Progreso Esperado

| Fase | Tiempo | Dificultad | Bloqueadores |
|------|--------|------------|--------------|
| 0    | 3-5h   | Media      | Ninguno      |
| 1    | 30-40h | Alta       | CORS         |
| 2    | 40-60h | Media      | Bundle size  |
| 3    | 30-40h | Media      | Transacciones|
| 4    | 30-40h | Alta       | CSP          |
| 5    | 30-40h | Media      | Docker       |

**Total estimado:** 163-225 horas (~4-6 semanas a tiempo completo)

---

## 🎯 Criterios de Éxito Final

Al completar todas las fases:

- ✅ Backend funcional con SQLite + API REST
- ✅ Autenticación segura (bcrypt + JWT httpOnly)
- ✅ Bundle reducido de 449KB a ~50KB
- ✅ LCP < 2.5s
- ✅ 0 errores TypeScript
- ✅ 0 secretos en frontend
- ✅ 0 vulnerabilidades críticas (npm audit)
- ✅ Tests coverage ≥ 80%
- ✅ Lighthouse ≥ 90/100 (performance + a11y)

---

## 📞 Soporte

Si te quedas atascado:
1. Revisa troubleshooting en el doc de la fase
2. Reporta al usuario con contexto completo
3. Usuario consultará con Claude Sonnet 4.5

---

**Preparado por:** Claude Sonnet 4.5 (GitHub Copilot)  
**Fecha:** 2025-11-05  
**Para:** GPT-5-codex (razonamiento LOW)  
**Versión:** 1.0
