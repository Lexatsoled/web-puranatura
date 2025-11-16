# 🗺️ ROADMAP MAESTRO DE DEPURACIÓN Y ROBUSTEZ

**Fecha inicio**: 2025-11-07  
**Proyecto**: Pureza Naturalis V3  
**Objetivo**: Depuración exhaustiva, máxima robustez y seguridad  
**Método**: Ejecución supervisada (Director: GitHub Copilot, Developer: GPT-5-codex)

---

## 📊 RESUMEN EJECUTIVO

### Estadísticas del proyecto
- **Archivos totales analizados**: 370 módulos
- **Hallazgos críticos**: 3 (SEC-CHECKOUT-002, SEC-SECRETS-001, SEC-CSRF-003)
- **Hallazgos altos**: 2
- **Hallazgos medios**: 5
- **Tareas totales**: 35 tareas
- **Duración estimada**: 3-5 semanas
- **Fases**: 3 fases principales

### Prioridades
1. 🔴 **CRÍTICO**: Seguridad (Tareas 1-12)
2. 🟡 **ALTO**: Backend robusto + Performance (Tareas 13-24)
3. 🟢 **MEDIO**: Refinamiento y optimización (Tareas 25-35)

---

## 🎯 FASE 1: SEGURIDAD CRÍTICA (Semana 1-2)

**Objetivo**: Eliminar vulnerabilidades críticas y altas  
**Duración estimada**: 10-15 días  
**Requisito de éxito**: 100% de tests de seguridad pasando

### TASK-001: Setup de detección de secretos
- **Prioridad**: 🔴 CRÍTICA
- **Tiempo estimado**: 2-3 horas
- **Dependencias**: Ninguna
- **Archivo**: `instructions/TASK-001-SECRET-DETECTION.md`
- **Validación**: Gitleaks bloquea commits con secretos

### TASK-002: Verificación histórica de secretos
- **Prioridad**: 🔴 CRÍTICA
- **Tiempo estimado**: 1 hora
- **Dependencias**: TASK-001
- **Archivo**: `instructions/TASK-002-SECRET-HISTORY.md`
- **Validación**: Log de auditoría limpio

### TASK-003: Documentación de gestión de secretos
- **Prioridad**: 🔴 CRÍTICA
- **Tiempo estimado**: 2 horas
- **Dependencias**: TASK-001, TASK-002
- **Archivo**: `instructions/TASK-003-SECRET-DOCS.md`
- **Validación**: Guía completa y clara

### TASK-004: Migrar checkout a backend
- **Prioridad**: 🔴 CRÍTICA
- **Tiempo estimado**: 8-10 horas
- **Dependencias**: Ninguna (paralelo a 1-3)
- **Archivo**: `instructions/TASK-004-CHECKOUT-BACKEND.md`
- **Validación**: 0 pedidos en localStorage

### TASK-005: Implementar protección CSRF
- **Prioridad**: 🔴 CRÍTICA
- **Tiempo estimado**: 4-6 horas
- **Dependencias**: Ninguna (paralelo)
- **Archivo**: `instructions/TASK-005-CSRF-PROTECTION.md`
- **Validación**: Tests CSRF pasando

### TASK-006: Sistema de rotación de refresh tokens
- **Prioridad**: 🔴 CRÍTICA
- **Tiempo estimado**: 6-8 horas
- **Dependencias**: TASK-005
- **Archivo**: `instructions/TASK-006-TOKEN-ROTATION.md`
- **Validación**: Tokens con jti único

### TASK-007: Sanitización de logging (PII scrubbing)
- **Prioridad**: 🟡 ALTA
- **Tiempo estimado**: 4-5 horas
- **Dependencias**: Ninguna
- **Archivo**: `instructions/TASK-007-LOG-SANITIZATION.md`
- **Validación**: 0 PII en logs de prueba

### TASK-008: Actualizar SecurityService
- **Prioridad**: 🟡 ALTA
- **Tiempo estimado**: 3-4 horas
- **Dependencias**: TASK-007
- **Archivo**: `instructions/TASK-008-SECURITY-SERVICE.md`
- **Validación**: Solo IDs persistidos

### TASK-009: Tests E2E de seguridad
- **Prioridad**: 🔴 CRÍTICA
- **Tiempo estimado**: 6-8 horas
- **Dependencias**: TASK-004, TASK-005, TASK-006
- **Archivo**: `instructions/TASK-009-SECURITY-E2E.md`
- **Validación**: Suite completa pasando

### TASK-010: Hardening de backend (Helmet, CORS)
- **Prioridad**: 🟡 ALTA
- **Tiempo estimado**: 2-3 horas
- **Dependencias**: TASK-005
- **Archivo**: `instructions/TASK-010-BACKEND-HARDENING.md`
- **Validación**: Headers de seguridad correctos

### TASK-011: Rate limiting por ruta
- **Prioridad**: 🟢 MEDIA
- **Tiempo estimado**: 2-3 horas
- **Dependencias**: TASK-010
- **Archivo**: `instructions/TASK-011-RATE-LIMITING.md`
- **Validación**: Límites funcionando

### TASK-012: Documentación de arquitectura de seguridad
- **Prioridad**: 🟡 ALTA
- **Tiempo estimado**: 3-4 horas
- **Dependencias**: TASK-001 a TASK-011
- **Archivo**: `instructions/TASK-012-SECURITY-DOCS.md`
- **Validación**: Diagramas y guías completas

**CHECKPOINT 1**: Todas las tareas 1-12 completadas y validadas → Revisión completa de seguridad

---

## 🎯 FASE 2: BACKEND ROBUSTO + PERFORMANCE (Semana 3-4)

**Objetivo**: APIs funcionales, base de datos optimizada, assets eficientes  
**Duración estimada**: 10-15 días  
**Requisito de éxito**: 0 endpoints 404, LCP < 2.5s

### TASK-013: Schema Drizzle para orders y addresses
- **Prioridad**: 🔴 CRÍTICA
- **Tiempo estimado**: 3-4 horas
- **Dependencias**: TASK-004
- **Archivo**: `instructions/TASK-013-DRIZZLE-SCHEMA.md`
- **Validación**: Migraciones ejecutadas

### TASK-014: Endpoints de órdenes (CRUD completo)
- **Prioridad**: 🔴 CRÍTICA
- **Tiempo estimado**: 6-8 horas
- **Dependencias**: TASK-013
- **Archivo**: `instructions/TASK-014-ORDERS-API.md`
- **Validación**: Tests API pasando

### TASK-015: Endpoints de direcciones (CRUD completo)
- **Prioridad**: 🔴 CRÍTICA
- **Tiempo estimado**: 4-5 horas
- **Dependencias**: TASK-013
- **Archivo**: `instructions/TASK-015-ADDRESSES-API.md`
- **Validación**: Tests API pasando

### TASK-016: Actualizar OrderService a backend
- **Prioridad**: 🔴 CRÍTICA
- **Tiempo estimado**: 3-4 horas
- **Dependencias**: TASK-014
- **Archivo**: `instructions/TASK-016-ORDER-SERVICE.md`
- **Validación**: Servicio conectado a API

### TASK-017: Actualizar AddressService a backend
- **Prioridad**: 🟡 ALTA
- **Tiempo estimado**: 2-3 horas
- **Dependencias**: TASK-015
- **Archivo**: `instructions/TASK-017-ADDRESS-SERVICE.md`
- **Validación**: Servicio conectado a API

### TASK-018: Documentar controles SQLite existentes
- **Prioridad**: 🟢 MEDIA
- **Tiempo estimado**: 2 horas
- **Dependencias**: Ninguna
- **Archivo**: `instructions/TASK-018-SQLITE-DOCS.md`
- **Validación**: README técnico completo

### TASK-019: Script de backup SQLite
- **Prioridad**: 🟡 ALTA
- **Tiempo estimado**: 2-3 horas
- **Dependencias**: TASK-018
- **Archivo**: `instructions/TASK-019-SQLITE-BACKUP.md`
- **Validación**: Backup automático funcional

### TASK-020: Pipeline de optimización de imágenes
- **Prioridad**: 🟡 ALTA
- **Tiempo estimado**: 6-8 horas
- **Dependencias**: Ninguna (paralelo)
- **Archivo**: `instructions/TASK-020-IMAGE-PIPELINE.md`
- **Validación**: Payload < 5MB

### TASK-021: Integración vite-imagetools
- **Prioridad**: 🟡 ALTA
- **Tiempo estimado**: 4-5 horas
- **Dependencias**: TASK-020
- **Archivo**: `instructions/TASK-021-VITE-IMAGETOOLS.md`
- **Validación**: Imágenes responsive generadas

### TASK-022: Actualizar componentes de imágenes
- **Prioridad**: 🟡 ALTA
- **Tiempo estimado**: 3-4 horas
- **Dependencias**: TASK-021
- **Archivo**: `instructions/TASK-022-IMAGE-COMPONENTS.md`
- **Validación**: ImageZoom usando nuevas fuentes

### TASK-023: Optimización de bundles (code splitting)
- **Prioridad**: 🟢 MEDIA
- **Tiempo estimado**: 4-5 horas
- **Dependencias**: Ninguna
- **Archivo**: `instructions/TASK-023-BUNDLE-OPTIMIZATION.md`
- **Validación**: Chunks < 500KB

### TASK-024: Tests E2E de flujos completos
- **Prioridad**: 🔴 CRÍTICA
- **Tiempo estimado**: 8-10 horas
- **Dependencias**: TASK-014, TASK-015, TASK-016
- **Archivo**: `instructions/TASK-024-E2E-FLOWS.md`
- **Validación**: Checkout, órdenes, navegación OK

**CHECKPOINT 2**: Todas las tareas 13-24 completadas → Revisión de integración completa

---

## 🎯 FASE 3: REFINAMIENTO Y OPTIMIZACIÓN (Semana 5+)

**Objetivo**: Accesibilidad, consolidación, monitoreo  
**Duración estimada**: 7-10 días  
**Requisito de éxito**: Axe score 100%, 0 componentes duplicados

### TASK-025: Unificar imports de componentes
- **Prioridad**: 🟡 ALTA
- **Tiempo estimado**: 4-5 horas
- **Dependencias**: Ninguna
- **Archivo**: `instructions/TASK-025-UNIFY-COMPONENTS.md`
- **Validación**: 0 imports ../../components

### TASK-026: Eliminar componentes legacy
- **Prioridad**: 🟡 ALTA
- **Tiempo estimado**: 2-3 horas
- **Dependencias**: TASK-025
- **Archivo**: `instructions/TASK-026-REMOVE-LEGACY.md`
- **Validación**: Carpeta /components eliminada

### TASK-027: Mejorar accesibilidad de checkout
- **Prioridad**: 🟡 ALTA
- **Tiempo estimado**: 5-6 horas
- **Dependencias**: TASK-025
- **Archivo**: `instructions/TASK-027-A11Y-CHECKOUT.md`
- **Validación**: Tests axe pasando

### TASK-028: LiveRegion component para notificaciones
- **Prioridad**: 🟢 MEDIA
- **Tiempo estimado**: 2-3 horas
- **Dependencias**: TASK-027
- **Archivo**: `instructions/TASK-028-LIVE-REGION.md`
- **Validación**: Screen readers funcionando

### TASK-029: Lighthouse automation
- **Prioridad**: 🟢 MEDIA
- **Tiempo estimado**: 3-4 horas
- **Dependencias**: TASK-020, TASK-023
- **Archivo**: `instructions/TASK-029-LIGHTHOUSE-AUTO.md`
- **Validación**: CI ejecuta Lighthouse

### TASK-030: Web Vitals monitoring
- **Prioridad**: 🟢 MEDIA
- **Tiempo estimado**: 2-3 horas
- **Dependencias**: TASK-029
- **Archivo**: `instructions/TASK-030-WEB-VITALS.md`
- **Validación**: Métricas capturadas

### TASK-031: Script de inventario automático
- **Prioridad**: 🟢 MEDIA
- **Tiempo estimado**: 3-4 horas
- **Dependencias**: Ninguna
- **Archivo**: `instructions/TASK-031-INVENTORY-AUTO.md`
- **Validación**: inventory.json actualizado

### TASK-032: Workflow CI/CD completo
- **Prioridad**: 🟡 ALTA
- **Tiempo estimado**: 4-5 horas
- **Dependencias**: TASK-009, TASK-024, TASK-029
- **Archivo**: `instructions/TASK-032-CI-CD.md`
- **Validación**: Pipeline funcionando

### TASK-033: Dashboard de métricas
- **Prioridad**: 🟢 MEDIA
- **Tiempo estimado**: 3-4 horas
- **Dependencias**: TASK-030, TASK-031
- **Archivo**: `instructions/TASK-033-METRICS-DASHBOARD.md`
- **Validación**: JSON con métricas actuales

### TASK-034: Documentación final de arquitectura
- **Prioridad**: 🟡 ALTA
- **Tiempo estimado**: 4-5 horas
- **Dependencias**: Todas las anteriores
- **Archivo**: `instructions/TASK-034-FINAL-DOCS.md`
- **Validación**: Diagramas actualizados

### TASK-035: Smoke tests y guía de mantenimiento
- **Prioridad**: 🟡 ALTA
- **Tiempo estimado**: 3-4 horas
- **Dependencias**: TASK-034
- **Archivo**: `instructions/TASK-035-MAINTENANCE.md`
- **Validación**: Runbook completo

**CHECKPOINT 3**: Proyecto completo → Revisión final y deployment

---

## 📈 MÉTRICAS DE ÉXITO

### Seguridad
- [ ] `tracked_secrets` = 0
- [ ] `local_storage_orders` = 0
- [ ] `csrf_block_rate` ≥ 99%
- [ ] `pii_in_logs` = 0
- [ ] Todos los tests de seguridad pasando

### Performance
- [ ] `image_payload_mb` < 5
- [ ] `LCP` < 2.5s
- [ ] `INP` < 200ms
- [ ] `CLS` < 0.1
- [ ] `api_404_rate` < 1%

### Calidad
- [ ] `duplicated_components` = 0
- [ ] `test_coverage` > 80%
- [ ] `axe_violations` = 0
- [ ] `eslint_errors` = 0
- [ ] `typescript_errors` = 0

### Robustez
- [ ] Suite E2E completa pasando
- [ ] Tests de regresión pasando
- [ ] Documentación actualizada
- [ ] CI/CD pipeline verde

---

## 🔄 PROCESO DE EJECUCIÓN

### Para cada tarea:

1. **PREP** (Director - Copilot)
   - Revisar contexto y dependencias
   - Validar que prerrequisitos están cumplidos
   - Proveer instrucciones detalladas a GPT-5

2. **EXEC** (Developer - GPT-5)
   - Implementar según instrucciones
   - Escribir tests
   - Auto-validar con criterios
   - Reportar completado

3. **REVIEW** (Director - Copilot)
   - Code review técnico
   - Validar tests y calidad
   - Aprobar o pedir cambios
   - Actualizar tracker

4. **MERGE** (PM - Usuario)
   - Aplicar cambios al código
   - Ejecutar tests de regresión
   - Commit y push
   - Actualizar PROGRESS.json

---

## 🚨 GESTIÓN DE RIESGOS

### Si una tarea falla:
1. Analizar causa raíz
2. Ajustar instrucciones
3. Re-intentar (máximo 2 veces)
4. Si persiste → escalar a Director para rediseño

### Si aparecen regresiones:
1. Ejecutar `npm run checkpoint:rollback`
2. Identificar tarea que causó regresión
3. Revertir cambios
4. Corregir y re-ejecutar

### Si hay bloqueos técnicos:
1. Documentar problema
2. Marcar tarea como BLOCKED
3. Continuar con tareas independientes
4. Resolver bloqueo con investigación adicional

---

## 📞 COMUNICACIÓN

### Formato de updates:
```markdown
TAREA-XXX: [TÍTULO]
Estado: EN PROGRESO / BLOQUEADA / COMPLETADA / EN REVISIÓN
Progreso: XX%
Problemas: [descripción o "ninguno"]
Siguiente paso: [acción específica]
```

### Reportes diarios:
- Actualizar `reports/execution-2025-11-07/daily-YYYY-MM-DD.md`
- Listar tareas completadas
- Identificar bloqueos
- Proyectar siguiente día

---

## ✅ CRITERIOS DE FINALIZACIÓN

### Fase 1 completa cuando:
- ✅ Todas las tareas 1-12 en estado COMPLETADA
- ✅ Suite de tests de seguridad verde
- ✅ Code review aprobado
- ✅ Sin vulnerabilidades críticas/altas

### Fase 2 completa cuando:
- ✅ Todas las tareas 13-24 en estado COMPLETADA
- ✅ APIs funcionando 100%
- ✅ Performance dentro de targets
- ✅ Tests E2E pasando

### Fase 3 completa cuando:
- ✅ Todas las tareas 25-35 en estado COMPLETADA
- ✅ Accesibilidad 100%
- ✅ Documentación completa
- ✅ CI/CD operativo

### Proyecto completo cuando:
- ✅ Todas las fases completadas
- ✅ Todas las métricas cumplidas
- ✅ Smoke tests pasando
- ✅ Deployment exitoso

---

**Última actualización**: 2025-11-07  
**Versión**: 1.0  
**Mantenido por**: GitHub Copilot (Director) + GPT-5-codex (Developer)
