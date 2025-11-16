# 🚀 EXECUTION WORKFLOW - Pureza Naturalis V3

## 📋 INSTRUCCIONES PARA GPT-5-CODEX

Este documento guía la implementación secuencial de las 35 tareas del proyecto.

## 🎯 OBJETIVO

Implementar completamente la plataforma e-commerce Pureza Naturalis siguiendo las especificaciones técnicas de cada tarea.

## 📁 UBICACIÓN DE INSTRUCCIONES

```
.github/execution-plan/instructions/TASK-XXX-*.md
```

## 🔄 PROCESO DE EJECUCIÓN

### Para cada tarea (TASK-001 a TASK-035):

1. **LEER** la instrucción completa
   ```bash
   # Ejemplo para TASK-001
   code .github/execution-plan/instructions/TASK-001-SECRET-DETECTION.md
   ```

2. **IMPLEMENTAR** todo el código especificado
   - Crear archivos según estructura indicada
   - Copiar código completo de la instrucción
   - Adaptar rutas y configuración si es necesario

3. **VALIDAR** usando los comandos de verificación
   ```bash
   # Cada tarea incluye sección "VALIDACIÓN"
   # Ejecutar todos los comandos listados
   ```

4. **VERIFICAR** criterios de aceptación
   - Marcar checkboxes en "CRITERIOS DE ACEPTACIÓN"
   - Asegurar que todos están ✅

5. **COMMIT** cambios
   ```bash
   git add .
   git commit -m "feat: TASK-XXX - [Nombre de la tarea]"
   ```

6. **CONTINUAR** con siguiente tarea

## 📊 ESTRUCTURA POR FASES

### FASE 1: Seguridad Crítica (TASK-001 a TASK-012)
**Duración estimada**: 8-12 horas

Tareas:
- TASK-001: Secret Detection
- TASK-002: Secret History  
- TASK-003: Secret Docs
- TASK-004: Checkout Backend
- TASK-005: CSRF Protection
- TASK-006: Token Rotation
- TASK-007: Dependency Audit
- TASK-008: Input Sanitization
- TASK-009: Rate Limiting
- TASK-010: Secure Logging
- TASK-011: Security Headers
- TASK-012: Database Backup

**Checkpoint Fase 1**:
```bash
# Verificar que funciona seguridad básica
npm run test:security
npm run audit
```

### FASE 2: Backend Robusto (TASK-013 a TASK-024)
**Duración estimada**: 10-14 horas

Tareas:
- TASK-013: Orders API
- TASK-014: Search API
- TASK-015: Pagination Framework
- TASK-016: Redis Cache
- TASK-017: Query Optimization
- TASK-018: Connection Pooling
- TASK-019: CDN Assets
- TASK-020: Compression
- TASK-021: Health Checks
- TASK-022: Error Handling
- TASK-023: Schema Validation
- TASK-024: OpenAPI Docs

**Checkpoint Fase 2**:
```bash
# Verificar API completa
npm run test:api
curl http://localhost:3000/health
open http://localhost:3000/docs
```

### FASE 3: Optimización Frontend (TASK-025 a TASK-035)
**Duración estimada**: 12-16 horas

Tareas:
- TASK-025: Code Splitting
- TASK-026: Service Worker PWA
- TASK-027: Performance Monitoring
- TASK-028: SEO Optimization
- TASK-029: Accessibility
- TASK-030: Internationalization
- TASK-031: E2E Testing
- TASK-032: CI/CD Pipeline
- TASK-033: Monitoring & Observability
- TASK-034: Load Testing
- TASK-035: Documentation Final

**Checkpoint Fase 3**:
```bash
# Verificar build completo
npm run build
npm run test:e2e
npm run lighthouse
```

## 🎬 INICIO RÁPIDO

```bash
# 1. Posicionarse en el proyecto
cd "c:\Users\Usuario\Desktop\Web Puranatura\Pureza-Naturalis-V3"

# 2. Comenzar con TASK-001
code .github/execution-plan/instructions/TASK-001-SECRET-DETECTION.md

# 3. Seguir el proceso de ejecución (pasos 1-6)
```

## 📝 PROMPT PARA GPT-5-CODEX

```
Implementa TASK-001 (Secret Detection) del proyecto Pureza Naturalis V3.

Instrucción: .github/execution-plan/instructions/TASK-001-SECRET-DETECTION.md

Proceso:
1. Lee la instrucción completa
2. Implementa TODO el código especificado
3. Ejecuta comandos de validación
4. Verifica criterios de aceptación
5. Commit cambios
6. Confirma completado

Cuando termines TASK-001, continúa automáticamente con TASK-002.
```

## ✅ CRITERIOS DE COMPLETADO

Una tarea está completa cuando:
- ✅ Todo el código está implementado
- ✅ Tests pasan exitosamente
- ✅ Validación práctica ejecutada
- ✅ Criterios de aceptación cumplidos
- ✅ Commit realizado
- ✅ Sin errores de compilación/lint

## 🚨 IMPORTANTE

- **NO omitir código**: Implementar TODO lo especificado
- **NO improvisar**: Seguir las instrucciones exactamente
- **NO saltar validaciones**: Ejecutar todos los tests
- **SÍ reportar problemas**: Si algo falla, documentar
- **SÍ adaptar rutas**: Ajustar paths según estructura real del proyecto

## 📊 PROGRESO

Actualizar este archivo al completar cada fase:

- [ ] FASE 1: Seguridad Crítica (0/12)
- [ ] FASE 2: Backend Robusto (0/12)
- [ ] FASE 3: Optimización Frontend (0/11)

**Total: 0/35 tareas completadas**

---

**Inicio**: [Fecha a completar por GPT-5-codex]
**Estado**: PENDIENTE
**Última actualización**: 07/11/2025
