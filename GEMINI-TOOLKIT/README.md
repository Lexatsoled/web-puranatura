# 🤖 GEMINI CODE ASSIST TOOLKIT - Pureza-Naturalis-V3

## 📋 INTRODUCCIÓN

Este toolkit contiene TODAS las instrucciones, scripts y verificaciones necesarias para que **Gemini Code Assist** complete las Fases 2-4 del plan de corrección de Pureza-Naturalis-V3.

**⚠️ IMPORTANTE:** Este toolkit fue diseñado específicamente para ser usado por Gemini Code Assist bajo supervisión humana. NO ejecutes cambios sin revisar cada paso.

---

## ✅ FASE 1: COMPLETADA

Ya se completaron las correcciones CRÍTICAS:

- ✅ **C001-C003**: Vulnerabilidades XSS corregidas con DOMPurify
- ✅ **C004**: localStorage sanitizado y validado
- ✅ **C005**: package.json sin vulnerabilidades críticas
- ✅ **C006**: React plugin actualizado y configurado

**Estado actual:** El proyecto compila y funciona, pero tiene problemas de calidad y optimización.

---

## 🎯 FASES PENDIENTES (Tu Trabajo)

### **FASE 2: CORRECCIONES ALTAS** (3-5 días)

**Prioridad:** ALTA  
**Impacto:** Reduce tamaño del bundle, mejora arquitectura, elimina duplicaciones

Correcciones:

- **E011**: Consolidar imports mixtos (./contexts vs ./src/contexts)
- **E012-E013**: Eliminar dependencies backend (Express, Mongoose, Helmet)
- **E014**: Incluir tests en compilación TypeScript
- **E019**: Eliminar duplicación masiva de assets (~300MB)
- **E020**: Corregir formatos de imagen inconsistentes
- **E021**: Renombrar 4+ archivos con nombres incorrectos
- **E022**: Refactorizar products.ts (6,415 líneas)
- **E023**: Optimizar manual chunks en vite.config.ts
- **E024**: Implementar advertencias para productos peligrosos

### **FASE 3: MEJORAS CALIDAD** (1-2 semanas)

**Prioridad:** MEDIA  
**Impacto:** Mejora mantenibilidad, reduce deuda técnica

Correcciones:

- **E015**: Reducir 77 usos de 'any' (conversión tipo por tipo)
- **E016**: Remover 129 console statements
- **E017**: Implementar 3 TODOs pendientes
- **E018**: Corregir mojibake (188 instancias de texto corrupto)
- Optimizar estrategia de chunks

### **FASE 4: OPTIMIZACIONES** (Backlog)

**Prioridad:** BAJA  
**Impacto:** Optimización final

- Generar versiones AVIF de imágenes
- Auditar imágenes huérfanas
- Métricas de tamaño final
- Optimizaciones adicionales

---

## 📁 ESTRUCTURA DEL TOOLKIT

```
GEMINI-TOOLKIT/
├── README.md                    # Este archivo (índice principal)
├── GEMINI_INSTRUCTIONS.md      # Instrucciones EXHAUSTIVAS (2000+ líneas)
├── PHASE_2_CHECKLIST.md        # Checklist interactivo Fase 2
├── PHASE_3_CHECKLIST.md        # Checklist interactivo Fase 3
├── PHASE_4_CHECKLIST.md        # Checklist interactivo Fase 4
├── ROLLBACK_GUIDE.md           # Guía de rollback por escenario
├── VERIFICATION_TESTS.md       # Tests específicos de verificación
├── COMMON_ERRORS.md            # Errores comunes y cómo evitarlos
└── SUCCESS_CRITERIA.md         # Criterios de éxito medibles
```

---

## 🚀 CÓMO USAR ESTE TOOLKIT

### **PASO 1: PREPARACIÓN INICIAL**

1. **Lee GEMINI_INSTRUCTIONS.md COMPLETO** (es largo, pero necesario)
2. **Crea un backup:**
   ```bash
   git checkout -b fase-2-corrections
   git push origin fase-2-corrections
   ```
3. **Verifica que el proyecto funciona:**
   ```bash
   npm install
   npm run build
   npm test
   ```

### **PASO 2: EJECUTA FASE 2**

1. Abre [`GEMINI_INSTRUCTIONS.md`](./GEMINI_INSTRUCTIONS.md) - Sección "FASE 2"
2. Abre [`PHASE_2_CHECKLIST.md`](./PHASE_2_CHECKLIST.md)
3. **Para cada corrección:**
   - Lee las instrucciones COMPLETAS
   - Ejecuta el cambio
   - Verifica con los tests
   - Marca el checkbox ✅
   - Haz commit

### **PASO 3: EJECUTA FASE 3**

Similar a Fase 2, pero usa:

- [`GEMINI_INSTRUCTIONS.md`](./GEMINI_INSTRUCTIONS.md) - Sección "FASE 3"
- [`PHASE_3_CHECKLIST.md`](./PHASE_3_CHECKLIST.md)

### **PASO 4: EJECUTA FASE 4** (Opcional)

- [`GEMINI_INSTRUCTIONS.md`](./GEMINI_INSTRUCTIONS.md) - Sección "FASE 4"
- [`PHASE_4_CHECKLIST.md`](./PHASE_4_CHECKLIST.md)

---

## ⚠️ REGLAS IMPORTANTES

### **🔴 NUNCA HAGAS ESTO:**

1. ❌ NO hagas múltiples cambios sin verificar cada uno
2. ❌ NO continues si `npm run build` falla
3. ❌ NO borres archivos sin verificar que no se usan
4. ❌ NO cambies código sin leer el contexto completo
5. ❌ NO asumas que algo funciona - VERIFICA SIEMPRE

### **✅ SIEMPRE HAZ ESTO:**

1. ✅ Lee las instrucciones COMPLETAS antes de empezar
2. ✅ Haz UN cambio a la vez
3. ✅ Verifica después de cada cambio
4. ✅ Haz commit frecuentemente
5. ✅ Reporta al usuario si algo falla

---

## 🆘 SI ALGO FALLA

1. **DETENTE INMEDIATAMENTE**
2. **NO CONTINUES** con más cambios
3. Consulta [`ROLLBACK_GUIDE.md`](./ROLLBACK_GUIDE.md)
4. Reporta el error al usuario
5. Espera instrucciones antes de continuar

---

## 📊 MÉTRICAS OBJETIVO

### **Bundle Size:**

- **Actual:** ~1.2MB (inicial)
- **Objetivo Fase 2:** <800KB
- **Objetivo Fase 3:** <700KB
- **Objetivo Fase 4:** <600KB

### **Lighthouse Score:**

- **Actual:** ~75-80
- **Objetivo Final:** 95+

### **TypeScript Errors:**

- **Actual:** 77 usos de 'any'
- **Objetivo:** <10 usos de 'any'

### **Code Quality:**

- **Actual:** 129 console statements
- **Objetivo:** 0 console statements en producción

---

## 📞 CONTACTO

Si encuentras algo que no está documentado o necesitas clarificación:

1. **Primero:** Busca en [`COMMON_ERRORS.md`](./COMMON_ERRORS.md)
2. **Segundo:** Revisa [`GEMINI_INSTRUCTIONS.md`](./GEMINI_INSTRUCTIONS.md)
3. **Tercero:** PREGUNTA AL USUARIO - NO adivines

---

## 🎓 FILOSOFÍA DEL TOOLKIT

Este toolkit está diseñado con la filosofía de "**ser extremadamente específico**" porque:

1. Gemini Code Assist NO es tan capaz como Claude
2. Necesita instrucciones paso a paso MUY detalladas
3. Puede "alucinar" código que no existe
4. Necesita verificaciones constantes
5. Requiere supervisión humana activa

**Por eso:**

- Todas las instrucciones son EXHAUSTIVAS
- Cada cambio tiene código ANTES y DESPUÉS
- Cada corrección tiene comandos de verificación
- Hay checklists para seguimiento
- Hay guías de rollback para cada escenario

---

## ✨ EMPEZAR

**👉 Tu siguiente paso:** Abre [`GEMINI_INSTRUCTIONS.md`](./GEMINI_INSTRUCTIONS.md) y lee la sección "ANTES DE EMPEZAR".

**¡Buena suerte! 🚀**

---

## 📄 LICENCIA

Este toolkit es parte del proyecto Pureza-Naturalis-V3 y sigue la misma licencia.
