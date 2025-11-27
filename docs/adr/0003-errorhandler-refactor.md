# ADR 0003 – Refactor `errorHandler.ts`

## Context

- `src/utils/errorHandler.ts` concentra la lógica de notificaciones junto con clases de error y utilidades de API, lo que eleva su complejidad y complica su prueba (refactor checklist T5.1/T5.2).
- La política de la fase 5 pide dividir responsabilidades, reducir CC >10 y agregar tests para servicios clave antes de avanzar a otros refactors (`docs/phase-checkpoints.md`, T5.1).
- QA/SRE necesita artefactos claros antes de cerrar la fase 4 y declarar listos los tests de error para T5.1.

## Decision

- Extraer la decisión de qué notificación mostrar en `getNotificationForError` y delegar el logging en `logAndNotifyError`, simplificando el hook `useErrorHandler`.
- El `withErrorHandling` ahora admite un `showNotification` general que usa la nueva utilería y lanza el error solo cuando no hay handler, garantizando trazabilidad.
- Documentar cada cambio en este ADR y enlazarlo desde el checklist de `docs/phase-checkpoints.md`.
- Añadir tests unitarios (`test/utils/errorHandler.test.ts`) para validar las rutas más importantes (API, validación, red, fallback).

## Consequences

- La complejidad de `errorHandler.ts` baja al tener una matriz de reglas predecible para boosters y un hook mínimo.
- Los tests pueden moquear las utilidades sin depender del contexto de notificaciones, acelerando el siguiente refactor del checklist.
- QA/SRE tendrá una línea clara para validar errores y cerrar T5.1 gracias al ticket/documentación existente.
