# Guía de Sanitización

## Objetivos
- Evitar XSS e inyecciones en cualquier punto de entrada/salida.
- Unificar el uso de `DOMPurify`, Zod y `validator` tanto en frontend como backend.
- Definir responsabilidades claras para formularios, APIs y persistencia.

## Frontend
### Utilidades
- `src/utils/sanitizer.ts`
  - `sanitizeHtml`, `sanitizeText`, `sanitizeUrl`, `sanitizeEmail`.
  - `sanitizeObject` / `sanitizeFormValues` para limpiar estructuras completas.
  - `createSanitizeValidator` para React Hook Form.
- `src/hooks/useSanitizedInput.ts`
  - Hook controlado que limpia cada keystroke (`text`, `email`, `url` o `html`).
- `src/utils/sanitizationMiddleware.ts`
  - Interceptores Axios (`sanitizeRequestMiddleware`, `sanitizeResponseMiddleware`, `sanitizeErrorMiddleware`).

### Buenas prácticas
1. **Antes de enviar formularios** usa `sanitizeFormValues`.
2. **Inputs controlados**: `useSanitizedInput` para campos críticos (mensajes, emails).
3. **Renderizado HTML**: nunca uses `dangerouslySetInnerHTML` sin pasar por `sanitizeHtml`.
4. **URLs externas**: validar con `sanitizeUrl` antes de componer `href` o `src`.

## Backend
### Schemas
- `backend/src/schemas/validation.ts`
  - Funciones auxiliares (`stringField`, `emailField`, `numberFromQuery`).
  - Schemas reutilizables: auth, productos, pedidos, parámetros.
- `backend/src/middleware/validate.ts`
  - Acepta `body`, `query` o `params` para aplicar Zod en cada ruta.

### Helpers
- `backend/src/db/helpers.ts`
  - `sanitizeDbString`, `sanitizeOptionalString`, `sanitizePhone`, `sanitizeAddress`.
  - Aplicar antes de escribir en la base de datos.

### Flujos protegidos
- **Auth**: `signup` y `login` usan schemas con trims + escape + normalizado de email.
- **Productos**: query params sanitizados antes de llegar al servicio.
- **Pedidos**: direcciones y notas se limpian con `sanitizeAddress` / `sanitizeDbString`.

## SLA
| Tipo | Acción |
|------|--------|
| Datos mostrados al usuario | Siempre pasar por `sanitizeHtml` / `sanitizeText`. |
| Inputs provenientes de formularios | `sanitizeFormValues` + validación en backend. |
| Parámetros de ruta / query | Validar con Zod (middleware `validate`). |
| Inserciones en DB | Limpiar con helpers y nunca interpolar strings. |

## Tests
- Frontend: `src/utils/__tests__/sanitizer.test.ts` cubre casos comunes (script tags, URLs peligrosas, formularios).
- Backend: `backend/src/schemas/__tests__/validation.test.ts` valida normalización y límites.

## Checklist
- [ ] Formularios llaman `sanitizeFormValues`.
- [ ] Axios usa interceptores de sanitización (`setupAxiosSanitization`).
- [ ] Rutas Fastify registran `validate(schema, source)`.
- [ ] Datos antes de persistir pasan por `sanitizeDbString`/`sanitizeAddress`.
- [ ] Nuevos endpoints documentan el esquema utilizado.
