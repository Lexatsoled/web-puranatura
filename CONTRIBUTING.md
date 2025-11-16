# Guía de Contribución 🤝

¡Bienvenido/a! Nos alegra que quieras contribuir a **Pureza Naturalis V3**. Esta guía te ayudará a entender cómo contribuir de manera efectiva al proyecto.

## 📋 Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [Cómo Contribuir](#cómo-contribuir)
- [Configuración del Entorno](#configuración-del-entorno)
- [Estándares de Desarrollo](#estándares-de-desarrollo)
- [Proceso de Pull Request](#proceso-de-pull-request)
- [Reportar Bugs](#reportar-bugs)
- [Solicitar Funcionalidades](#solicitar-funcionalidades)

## 📜 Código de Conducta

Este proyecto sigue un código de conducta para asegurar un ambiente inclusivo y respetuoso. Al participar, aceptas:

- Ser respetuoso/a con todas las personas
- Usar lenguaje inclusivo y no discriminatorio
- Aceptar constructivamente críticas y sugerencias
- Enfocarte en lo que es mejor para la comunidad
- Mostrar empatía hacia otros miembros

## 🚀 Cómo Contribuir

### Tipos de Contribuciones

1. **🐛 Reportar Bugs**: Issues detallados con pasos para reproducir
2. **💡 Sugerir Funcionalidades**: Ideas para mejorar la aplicación
3. **🔧 Correcciones**: Fixes para bugs existentes
4. **✨ Nuevas Funcionalidades**: Implementación de features solicitadas
5. **📚 Documentación**: Mejoras en docs, README, comentarios
6. **🧪 Tests**: Agregar o mejorar cobertura de tests
7. **🎨 UI/UX**: Mejoras en interfaz y experiencia de usuario

### Primeros Pasos

1. **Fork** el repositorio
2. **Clona** tu fork localmente
3. **Crea** una rama para tu contribución
4. **Desarrolla** siguiendo los estándares
5. **Testea** tus cambios
6. **Commit** con mensajes descriptivos
7. **Push** a tu fork
8. **Crea** un Pull Request

## 🛠️ Configuración del Entorno

### Prerrequisitos

- **Node.js** >= 18.0.0
- **npm** >= 8.0.0
- **Git** >= 2.30.0

### Instalación

```bash
# Clonar repositorio
git clone https://github.com/YOUR_USERNAME/pureza-naturalis-v3.git
cd pureza-naturalis-v3

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus claves

# Verificar instalación
npm run validate
```

### Extensiones de VS Code Recomendadas

```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

## 📏 Estándares de Desarrollo

### 📝 Estilo de Código

- **TypeScript**: Tipos estrictos, interfaces descriptivas
- **ESLint**: Sin errores de linting
- **Prettier**: Formateo automático
- **Comentarios**: JSDoc en español para funciones públicas

```typescript
/**
 * Calcula el total del carrito incluyendo descuentos
 * @param items - Lista de items del carrito
 * @param discountCode - Código de descuento opcional
 * @returns Total calculado con impuestos
 */
export function calculateTotal(
  items: CartItem[],
  discountCode?: string
): number {
  // Implementación aquí
}
```

### 🏗️ Arquitectura

- **Componentes**: Funcionales con hooks, nombrado en PascalCase
- **Hooks**: Prefijo `use`, lógica reutilizable
- **Servicios**: Lógica de negocio, llamadas API
- **Utilidades**: Funciones puras, helpers
- **Stores**: Zustand para estado global

### 🧪 Testing

- **Cobertura mínima**: 80% para nuevo código
- **Tests unitarios**: Componentes, hooks, utilidades
- **Tests de integración**: Flujos completos
- **Tests E2E**: Escenarios críticos con Playwright

```bash
# Ejecutar tests
npm run test:coverage

# Tests E2E
npm run test:e2e
```

### 📚 Documentación

- **README**: Actualizado con nuevos features
- **JSDoc**: Comentarios en español para APIs públicas
- **TypeDoc**: Generación automática de docs

```bash
# Generar documentación
npm run docs

# Validar comentarios
npm run validate:comments
```

## 🔄 Proceso de Pull Request

### Convenciones de Commit

Usamos [Conventional Commits](https://conventionalcommits.org/):

```
type(scope): description

Types: feat, fix, docs, style, refactor, test, chore
```

Ejemplos:

- `feat(auth): agregar login con Google`
- `fix(cart): corregir cálculo de totales`
- `docs(readme): actualizar guía de instalación`
- `test(utils): agregar tests para sanitización`

### Template de PR

```markdown
## 📝 Descripción

Breve descripción de los cambios

## 🎯 Tipo de Cambio

- [ ] 🐛 Bug fix
- [ ] ✨ Nueva funcionalidad
- [ ] 💥 Breaking change
- [ ] 📚 Documentación
- [ ] 🎨 Estilos
- [ ] 🧪 Tests
- [ ] 🔧 Configuración

## ✅ Checklist

- [ ] Tests pasan
- [ ] Linting sin errores
- [ ] Documentación actualizada
- [ ] Comentarios en español
- [ ] Cobertura de tests >= 80%

## 🔗 Issues Relacionados

Resuelve #123, #456

## 📸 Screenshots (si aplica)
```

### Revisión de Código

**Antes de enviar tu PR:**

- ✅ Tests pasan localmente
- ✅ ESLint sin errores
- ✅ TypeScript sin errores
- ✅ Comentarios validados
- ✅ Documentación actualizada

**Durante la revisión:**

- Responder a comentarios constructivamente
- Hacer cambios solicitados
- Mantener conversación abierta

## 🐛 Reportar Bugs

### Template para Bug Reports

```markdown
**Descripción del Bug**
Descripción clara y concisa

**Pasos para Reproducir**

1. Ir a '...'
2. Hacer click en '...'
3. Ver error

**Comportamiento Esperado**
Qué debería pasar

**Comportamiento Actual**
Qué pasa en realidad

**Capturas de Pantalla**
Si aplica

**Entorno**

- OS: [Windows/Mac/Linux]
- Browser: [Chrome/Firefox/Safari]
- Version: [e.g. 22]

**Contexto Adicional**
Cualquier información relevante
```

## 💡 Solicitar Funcionalidades

### Template para Feature Requests

```markdown
**¿Qué problema resuelve?**
Descripción del problema

**Solución Propuesta**
Descripción de la solución

**Alternativas Consideradas**
Otras soluciones evaluadas

**Impacto**
Cómo afecta a usuarios/desarrolladores

**Prioridad**
Alta/Media/Baja
```

## 🎯 Áreas de Contribución Prioritarias

### Alto Impacto

- [ ] Optimización de rendimiento
- [ ] Mejoras de accesibilidad
- [ ] Internacionalización completa
- [ ] PWA features

### Medio Impacto

- [ ] Nuevos componentes UI
- [ ] Integración con APIs externas
- [ ] Sistema de reviews de productos
- [ ] Dashboard de administración

### Bajo Impacto

- [ ] Mejoras de UI/UX
- [ ] Nuevos temas
- [ ] Utilidades adicionales
- [ ] Scripts de automatización

## 📞 Soporte

¿Necesitas ayuda?

- 📧 **Email**: dev@pureza-naturalis.com
- 💬 **Discord**: [Unirse al servidor](https://discord.gg/pureza-naturalis)
- 📖 **Docs**: [Documentación completa](docs/)
- 🐛 **Issues**: [Reportar problemas](https://github.com/pureza-naturalis/pureza-naturalis-v3/issues)

## 🙏 Reconocimiento

¡Gracias por contribuir! Todos los contribuidores serán reconocidos en:

- Lista de contribuidores en README
- Menciones en releases
- Posible swag/community recognition

---

**Recuerda**: Las contribuciones pequeñas y frecuentes son más valiosas que cambios grandes e infrecuentes. ¡Cada contribución cuenta! 🌟

## Guía de Etiquetas Explicativas (comentarios de módulo)

Para facilitar que cualquier analista comprenda el código con rapidez y profundidad, todos los archivos que exportan componentes, hooks, utilidades, servicios o stores deben comenzar con un encabezado breve en español siguiendo este formato:

```
/**
 * [Tipo]: [Nombre]
 * Propósito: [Qué resuelve y por qué existe]
 * Entradas: [Props/args principales]
 * Salidas: [Valores devueltos/efectos observables]
 * Comportamiento/Notas: [Cómo funciona a alto nivel, consideraciones de rendimiento/seguridad]
 */
```

Convenciones y buenas prácticas:

- Redactar en español claro y directo; evitar jerga innecesaria.
- Explicar el “por qué” además del “qué” cuando aporte contexto.
- Mantener el encabezado en 5–10 líneas; detalles extra pueden ir como comentarios locales en funciones internas.
- No duplicar el contenido de tipos o nombres de variables cuando ya es evidente.
- Señalar si existe interacción con red, almacenamiento, caché, o efectos secundarios relevantes.
- Para componentes, indicar accesibilidad (por ejemplo, roles/aria) cuando aplique.
- Para hooks, listar de forma concisa la API expuesta.
- Para utilidades SEO/seguridad/rendimiento, incluir advertencias de uso seguro.

Ejemplo (componente):

```
/**
 * Componente: ProductTabs
 * Propósito: Renderizar navegación por pestañas accesible y su contenido asociado.
 * Entradas: tabs (id/label/content), className opcional.
 * Comportamiento: Mantiene pestaña activa en estado local; oculta/ muestra el contenido correspondiente.
 * Accesibilidad: Usa botones y aria-current en la pestaña activa.
 */
```

Ejemplo (hook):

```
/**
 * Hook: useNavigationState
 * Propósito: Guardar/restaurar filtros, paginación y scroll de la tienda.
 * API: saveNavigationState, getNavigationState, returnToStore, clearNavigationState, clearFromProductPageFlag, isFromProductPage.
 */
```

Al contribuir, si creas un archivo nuevo o tocas uno existente sin encabezado, añade el encabezado siguiendo esta guía.

Herramienta opcional de normalización de acentos

- Incluimos `tools/normalize_spanish_text.ps1` para corregir mojibake frecuente en comentarios/etiquetas de archivos `.ts/.tsx`.
- Uso (PowerShell):

```
pwsh ./tools/normalize_spanish_text.ps1
```

## Notas importantes de testing y encoding

- Mock de animaciones (framer-motion): los tests usan un mock global en `vitest.setup.tsx` que expone `AnimatePresence` y `motion.<tag>` (conserva la etiqueta semántica y elimina props de animación). Mantener este mock evita flakiness y problemas de accesibilidad en pruebas.
- UTF‑8 sin BOM: asegúrate de que los archivos se guarden en UTF‑8 (sin BOM). Si ves caracteres extraños ("�" o acentos rotos):
  - Ejecuta `node scripts/strip-bom.cjs` para limpiar BOM/caracteres de reemplazo.
  - Ejecuta `npm run fix-encoding` para reparar mojibake evidente.
  - El hook `.husky/pre-commit` corre estos pasos y bloqueará commits con encoding sospechoso (`tools/check_encoding.cjs`).
- Aserciones robustas: prefiere `getByRole` con `name` o regex (`/…/i`) y normalizadores para evitar falsos negativos por espacios/diacríticos. Ejemplo:
  - `screen.getByRole('heading', { name: /información personal/i })`

Hace copias `.bak` de los archivos modificados y escribe con codificación UTF‑8.
## Prácticas para español y encoding

- Aserciones de texto: usa el helper `includesText` de `src/test/utils/text.ts` para que las búsquedas toleren tildes y diacríticos. Ejemplos:
  - `screen.getByRole('heading', { name: includesText('Método de Pago') })`
  - `screen.findByText(includesText('Resumen del Pedido'))`
- Elementos asíncronos: prefiere `findBy*` o `await waitFor(() => ...)` y evita agrupar múltiples condiciones con distinta latencia en el mismo `waitFor`.
- Evita pasar props desconocidas al DOM. Filtra props custom antes de delegar a elementos HTML (ej.: usa `onLoad`/`onError` en vez de `afterLoad`).
- Si detectas mojibake (Ã, Â, â, �):
  - Ejecuta `npm run fix-encoding` y revisa diffs.
  - Si persiste en archivos concretos, usa `node scripts/clean_specific_files.cjs` y vuelve a ejecutar el check.
  - El pre-commit y CI fallan si hay mojibake en `src/` o `test/`.

### Plantilla de Pull Request del repositorio

- Al abrir un PR, usa la plantilla en `.github/pull_request_template.md`.
- Checklist clave:
  - Ejecuta `npm run check:encoding`; si falla, usa `npm run fix-encoding` y, si persiste, `npm run clean:mojibake` y revisa diffs.
  - Tests y lint OK (`npm run test`, `npm run lint`, `npm run type-check`).
  - Aserciones en español usando `includesText` cuando aplique.
  - Evita props desconocidas en elementos DOM (por ejemplo, usar `onLoad`/`onError` en imágenes en lugar de props no estándar).
