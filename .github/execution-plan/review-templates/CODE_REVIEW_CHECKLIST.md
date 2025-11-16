# 📋 GUÍA DE REVISIÓN DE CÓDIGO

**Para**: GitHub Copilot (Director de Proyecto)  
**Propósito**: Checklist estandarizado para revisar trabajo de GPT-5-codex  
**Versión**: 1.0

---

## 🎯 PROCESO DE REVISIÓN

### 1. REVISIÓN INICIAL (2-3 minutos)

- [ ] **Completitud**: ¿Todos los archivos solicitados fueron creados/modificados?
- [ ] **Formato de entrega**: ¿Sigue la plantilla especificada?
- [ ] **Tests ejecutados**: ¿Evidencia de que tests pasaron?
- [ ] **Sin archivos extra**: ¿No creó archivos no solicitados?

**Si falla alguno** → Feedback inmediato y re-iteración

---

### 2. REVISIÓN DE CÓDIGO (5-10 minutos)

#### Seguridad 🔒

- [ ] **No hay secretos hardcodeados** (API keys, passwords)
- [ ] **Validación de inputs** (Zod, sanitización)
- [ ] **No hay SQL injection** (usar Drizzle ORM, no raw queries)
- [ ] **No hay XSS** (DOMPurify usado correctamente)
- [ ] **Autenticación verificada** (requireAuth donde corresponde)
- [ ] **Datos sensibles no en logs** (PII scrubbing)

#### Arquitectura 🏗️

- [ ] **Respeta patrones existentes** (no inventa nuevos sin razón)
- [ ] **Separación de concerns** (lógica de negocio vs presentación)
- [ ] **Dependency injection** (no singletons innecesarios)
- [ ] **Error handling** (try-catch, mensajes claros)
- [ ] **TypeScript estricto** (no `any` sin justificación)

#### Performance ⚡

- [ ] **No hay N+1 queries** (usar joins, batch loading)
- [ ] **Lazy loading** donde aplica (imágenes, componentes)
- [ ] **Memoización** (useMemo, useCallback apropiados)
- [ ] **Bundle size** (no importa librerías pesadas innecesariamente)

#### Calidad 📊

- [ ] **Tests comprehensivos** (unit + integration + e2e)
- [ ] **Coverage** adecuado (≥80% para código crítico)
- [ ] **Sin código muerto** (commented code, imports sin usar)
- [ ] **Nombres descriptivos** (no `temp`, `data`, `handleClick2`)
- [ ] **Comentarios útiles** (explican "por qué", no "qué")

---

### 3. REVISIÓN DE TESTS (3-5 minutos)

#### Tests Unitarios

- [ ] **Cubren casos felices** (happy path)
- [ ] **Cubren edge cases** (valores límite, null, undefined)
- [ ] **Cubren errores** (throw, reject, 404, 500)
- [ ] **Son independientes** (no dependen de orden de ejecución)
- [ ] **Son rápidos** (< 100ms cada uno)

#### Tests de Integración

- [ ] **Cubren flujos completos** (API → DB → respuesta)
- [ ] **Usan mocks apropiados** (servicios externos, no DB)
- [ ] **Limpian después** (teardown, rollback)

#### Tests E2E

- [ ] **Cubren user journeys críticos** (checkout, login, etc.)
- [ ] **Son estables** (no flaky, no timeouts arbitrarios)
- [ ] **Usan data-testid** (no selectores frágiles)

---

### 4. REVISIÓN DE DOCUMENTACIÓN (2-3 minutos)

- [ ] **README actualizado** (si aplica)
- [ ] **JSDoc completo** (funciones públicas)
- [ ] **Tipos TypeScript documentados** (interfaces complejas)
- [ ] **CHANGELOG actualizado** (breaking changes)
- [ ] **Migration guide** (si hay breaking changes)

---

### 5. REVISIÓN DE REGRESIONES (5-10 minutos)

#### Ejecutar suite completa

```bash
# Lint
npm run lint

# Type check
npm run type-check

# Tests unitarios
npm run test:ci

# Tests E2E (críticos)
npm run test:e2e -- --project chromium

# Build
npm run build
```

#### Checklist de regresiones

- [ ] **No rompe tests existentes** (todos verdes)
- [ ] **No introduce eslint errors** (0 errors)
- [ ] **No introduce TypeScript errors** (0 errors)
- [ ] **Build exitoso** (sin warnings críticos)
- [ ] **Bundle size razonable** (incremento < 10%)

---

## ✅ CRITERIOS DE APROBACIÓN

### APROBADO ✅ (merge inmediato)

```
✅ Todos los checks pasados
✅ Tests completos y pasando
✅ Sin regresiones
✅ Código limpio y mantenible
✅ Documentación completa
```

**Acción**: Dar mensaje de aprobación y continuar con siguiente tarea

---

### CAMBIOS MENORES ⚠️ (1 iteración)

```
⚠️ 1-3 issues menores
⚠️ No afecta funcionalidad
⚠️ Fácil de corregir (< 30 min)
```

**Ejemplos**:
- Falta un comentario JSDoc
- Nombre de variable poco descriptivo
- Test coverage 78% (target 80%)
- Indentación inconsistente

**Acción**: Feedback específico, GPT-5 corrige, re-revisar

---

### CAMBIOS MAYORES 🔴 (re-diseño parcial)

```
🔴 4+ issues
🔴 Afecta funcionalidad o seguridad
🔴 Requiere re-pensar enfoque
```

**Ejemplos**:
- Vulnerabilidad de seguridad
- Pattern incompatible con arquitectura
- Tests no cubren casos críticos
- Performance regression significativa

**Acción**: Feedback detallado con ejemplos, posible rediseño de tarea

---

### RECHAZADO ❌ (re-hacer desde cero)

```
❌ Desviación total de instrucciones
❌ Código no funcional
❌ Rompe proyecto completo
```

**Acción**: Analizar causa raíz, clarificar instrucciones, re-asignar

---

## 📝 PLANTILLA DE FEEDBACK

### Para APROBADO ✅

```markdown
TASK-XXX: ✅ APROBADO

Excelente trabajo. Todos los criterios cumplidos.

**Highlights**:
- [Algo que hizo especialmente bien]
- [Otro punto positivo]

**Merge**: Autorizado
**Próxima tarea**: TASK-XXX+1
```

---

### Para CAMBIOS MENORES ⚠️

```markdown
TASK-XXX: ⚠️ CAMBIOS MENORES REQUERIDOS

Buen trabajo general. Ajustes menores antes de merge.

**Issues a corregir**:

1. **[Archivo:línea]**: [Problema específico]
   - Actual: [código o situación actual]
   - Esperado: [código o situación esperada]
   - Razón: [por qué es importante]

2. **[Otro issue]**: ...

**Tiempo estimado**: 20-30 minutos
**Re-enviar para revisión**: Una vez corregido
```

---

### Para CAMBIOS MAYORES 🔴

```markdown
TASK-XXX: 🔴 CAMBIOS MAYORES REQUERIDOS

Necesita re-trabajo significativo antes de aprobar.

**Issues críticos**:

1. **Seguridad** - [Archivo:línea]
   - Problema: [descripción detallada]
   - Impacto: [riesgo específico]
   - Solución: [enfoque correcto con ejemplo]

2. **Arquitectura** - [Archivo:línea]
   - Problema: [desviación del pattern]
   - Por qué es problema: [explicación]
   - Refactor requerido: [pasos específicos]

**Ejemplos de código correcto**:
\`\`\`typescript
[código ejemplo]
\`\`\`

**Tiempo estimado**: 2-4 horas
**Próximo paso**: Aplicar correcciones y re-enviar
```

---

### Para RECHAZADO ❌

```markdown
TASK-XXX: ❌ RECHAZADO - RE-HACER

El código no cumple con los requisitos mínimos.

**Razones del rechazo**:
1. [Razón principal]
2. [Otra razón crítica]
3. [Más razones si aplica]

**Análisis de causa raíz**:
- ¿Las instrucciones fueron claras? [SÍ/NO - ajustar si NO]
- ¿Faltó contexto? [SÍ/NO - proveer si SÍ]
- ¿Complejidad subestimada? [SÍ/NO - dividir tarea si SÍ]

**Plan de acción**:
1. [Clarificar instrucciones específicas]
2. [Proveer ejemplos adicionales]
3. [Re-asignar con nuevas instrucciones]

**No continuar con siguiente tarea hasta resolver**
```

---

## 🔍 CHECKLIST ESPECÍFICOS POR TIPO DE TAREA

### Tareas de Seguridad (TASK-001 a TASK-012)

- [ ] **Secrets**: ¿Gitleaks configurado correctamente?
- [ ] **Auth**: ¿Middleware de autenticación verifica tokens?
- [ ] **CSRF**: ¿Tokens validados en cada request?
- [ ] **PII**: ¿Datos sensibles scrubbed de logs?
- [ ] **Validación**: ¿Inputs sanitizados con Zod?

### Tareas de Backend (TASK-013 a TASK-019)

- [ ] **Schema**: ¿Drizzle schema tiene tipos correctos?
- [ ] **Migrations**: ¿SQL generado es idempotente?
- [ ] **API**: ¿Endpoints siguien convenciones REST?
- [ ] **Validation**: ¿Zod schemas cubren edge cases?
- [ ] **Error handling**: ¿Mensajes claros sin exponer internals?

### Tareas de Performance (TASK-020 a TASK-023)

- [ ] **Images**: ¿Srcsets generados correctamente?
- [ ] **Lazy loading**: ¿Componentes lazy loaded apropiadamente?
- [ ] **Bundles**: ¿Code splitting óptimo?
- [ ] **Metrics**: ¿LCP, INP, CLS medidos?

### Tareas de A11y (TASK-025 a TASK-028)

- [ ] **ARIA**: ¿Labels y roles correctos?
- [ ] **Keyboard**: ¿Navegación completa con teclado?
- [ ] **Screen readers**: ¿LiveRegions para notificaciones?
- [ ] **Contrast**: ¿Ratios WCAG AA cumplidos?

---

## 🚀 OPTIMIZACIÓN DEL PROCESO

### Después de 5 tareas revisadas

**Analizar patterns**:
- ¿Qué errores son recurrentes?
- ¿Qué instrucciones necesitan más claridad?
- ¿Qué ejemplos de código ayudarían?

**Ajustar instrucciones futuras**:
- Añadir ejemplos de errores comunes
- Clarificar ambigüedades detectadas
- Proveer templates más específicos

---

## 📊 MÉTRICAS DE CALIDAD

### Por tarea

- **Primera iteración exitosa**: Target 70%
- **Iteraciones promedio**: Target < 1.5
- **Tiempo de review**: Target < 15 min
- **Tests pasando**: Target 100%

### Por fase

- **Tareas aprobadas sin cambios**: Target 60%
- **Regresiones introducidas**: Target 0
- **Coverage de tests**: Target > 80%

---

**Última actualización**: 2025-11-07  
**Versión**: 1.0  
**Mantenido por**: GitHub Copilot (Director de Proyecto)
