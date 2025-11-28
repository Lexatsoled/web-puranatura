# ADR 0002 – Refactor `useAnalytics.ts`

## Context

- `reports/complexity-report.json` marca `src/hooks/useAnalytics.ts` como el archivo más complejo (CC 57).
- La lógica mezcla providers (GA + Facebook), queueing, consent y backend logging en una sola clase, lo cual dificulta pruebas y elevan la complejidad lógica (CC/CI).
- El plan de Fase 5 apunta a reducir CC >10 y dividir componentes grandes con hooks reutilizables (`docs/phase-checkpoints.md`, T5.1 checklist).

## Decision

- Extraer tipos y servicios de proveedores a `src/types/analytics.ts` y `src/services/analyticsProviders.ts` (scripts ya creados).
- Mantener un hook ligero que gestione el estado de consent, trackPageView y expose trackEvent.
- Delegar la persistencia de eventos al backend usando `logEventToBackend` con `traceId` y sessionId, manteniendo la lógica de Redux/traceId en los servicios.
- Registrar cada cambio en `docs/phase-checkpoints.md` y actualizar `reports/complexity-report.json` tras el refactor.

## Consequences

- CC disminuye al tener una clase pequeña y servicios reutilizables.
- Facilita pruebas unitarias de los servicios y del hook.
- El nuevo hook ya puede integrarse en los componentes y se vuelve más fácil expandir a nuevos proveedores sin tocar la misma pieza.

## Pasos específicos del refactor

| Paso | Acción                                                                                                                                                                         | Resultado esperado                                                  |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------- |
| 1    | Separar tipos en `src/types/analytics.ts`                                                                                                                                      | Tipos centralizados, uso de `Record<string, unknown>` para metadata |
| 2    | Extraer proveedores y helpers en `src/services/analyticsProviders.ts` (`initGoogleAnalytics`, `initFacebookPixel`, `logEventToProviders`, `logEventToBackend`, `getSessionId`) | Lógica de carga/registro desacoplada del hook                       |
| 3    | Reducir `useAnalytics` a estado de consentimiento + `trackEvent` + `trackPageView` usando los servicios importados                                                             | Hook ligero y fácil de testear                                      |
| 4    | Asegurar que el backend logging incluye `timestamp` y `sessionId` (ya implementado)                                                                                            | Persistencia homogénea de eventos con trazabilidad                  |
| 5    | Añadir tests unitarios/mocks para servicios (GA/FB) y el hook (consentimiento y queue)                                                                                         | Cobertura mínima que valida el nuevo contrato                       |
| 6    | Ejecutar `npm run test:ci` y `npm run check:complexity` tras el refactor                                                                                                       | CC reducida y suites verdes                                         |
| 7    | Documentar en `docs/phase-checkpoints.md` la reducción de complejidad y enlazar este ADR                                                                                       | Traza completa de la decisión                                       |
