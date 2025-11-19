# Checklist de Accesibilidad

## Estructura Semántica

- [ ] HTML semántico (header, nav, main, footer, article, section)
- [ ] Jerarquía de headings correcta (h1 → h2 → h3, sin saltos)
- [ ] Un solo h1 por página
- [ ] Landmarks ARIA si es necesario (role="navigation", etc.)
- [ ] Idioma declarado (`<html lang="es">`)

## Navegación por Teclado

- [ ] Tab order lógico y predecible
- [ ] Focus visible en todos los elementos interactivos
- [ ] Skip links ("Saltar al contenido") implementados
- [ ] Modales atrapan el foco (focus trap)
- [ ] Escape cierra modales/dropdowns
- [ ] Enter/Space activan botones
- [ ] Flechas navegan en menus/dropdowns
- [ ] No hay keyboard traps

## Contraste y Colores

- [ ] Contraste texto/fondo ≥ 4.5:1 (texto normal)
- [ ] Contraste texto/fondo ≥ 3:1 (texto grande ≥ 18pt)
- [ ] Contraste en componentes interactivos ≥ 3:1
- [ ] No transmitir información SOLO por color
- [ ] Indicadores visuales para estados (hover, focus, disabled)

## Imágenes y Multimedia

- [ ] Alt text descriptivo en todas las imágenes
- [ ] Alt="" en imágenes decorativas
- [ ] Transcripciones para audio (si aplica)
- [ ] Subtítulos para video (si aplica)
- [ ] No hay GIFs con flasheo > 3 veces/segundo

## Formularios

- [ ] Labels asociados a inputs (for="id")
- [ ] Placeholders NO como único indicador
- [ ] Mensajes de error descriptivos y accesibles
- [ ] aria-invalid y aria-describedby en errores
- [ ] Fieldsets y legends en grupos de inputs
- [ ] Required fields claramente indicados
- [ ] Autocompletado habilitado (autocomplete)

## ARIA (solo si HTML nativo no es suficiente)

- [ ] aria-label en iconos sin texto
- [ ] aria-expanded en elementos colapsables
- [ ] aria-live para notificaciones dinámicas
- [ ] aria-hidden en elementos decorativos
- [ ] aria-current en navegación activa
- [ ] No sobrecargar con ARIA innecesario

## Lectores de Pantalla

- [ ] Testeado con NVDA (Windows) o JAWS
- [ ] Testeado con VoiceOver (macOS/iOS)
- [ ] Testeado con TalkBack (Android)
- [ ] Textos rotos/mojibake corregidos (UTF-8)
- [ ] Orden de lectura lógico
- [ ] Anuncios de carga/loading (aria-live)

## Interacción

- [ ] Botones usan `<button>` (no `<div onclick>`)
- [ ] Links usan `<a href>` (no `<span onclick>`)
- [ ] Click targets ≥ 44x44px (móvil)
- [ ] Espaciado suficiente entre elementos interactivos
- [ ] No requiere mouse hover exclusivo
- [ ] Timeouts son configurables o no existen

## Responsive y Zoom

- [ ] Funciona correctamente con zoom 200%
- [ ] No hay scroll horizontal al hacer zoom
- [ ] Texto no truncado al hacer zoom
- [ ] Viewport meta tag correcta
- [ ] No desactivar zoom en móvil

## Contenido

- [ ] Lenguaje claro y conciso
- [ ] Instrucciones no dependen de forma/posición ("botón verde", "a la derecha")
- [ ] Links descriptivos (no "click aquí")
- [ ] Errores específicos y constructivos
- [ ] Textos de carga/loading informativos

## Problemas Comunes a Corregir

### ❌ Mojibake en textos

```tsx
// MAL
<label>Contrase���a</label>

// BIEN
<label>Contraseña</label>
```

**Solución:** Asegurar UTF-8 en todo el stack

### ❌ Iconos sin descripción

```tsx
// MAL
<button>??</button>

// BIEN
<button aria-label="Carrito de compras">
  <CartIcon />
</button>
```

### ❌ Focus no visible

```css
/* MAL */
button:focus {
  outline: none;
}

/* BIEN */
button:focus-visible {
  outline: 2px solid #4a90e2;
  outline-offset: 2px;
}
```

## Testing Tools

- [ ] Lighthouse Accessibility audit (≥ 90/100)
- [ ] axe DevTools
- [ ] WAVE browser extension
- [ ] Firefox Accessibility Inspector
- [ ] Chrome DevTools Accessibility panel
- [ ] Keyboard only testing manual
- [ ] Screen reader testing manual

## Métricas Objetivo

| Aspecto                  | Objetivo       |
| ------------------------ | -------------- |
| Lighthouse Accessibility | ≥ 90/100       |
| Contraste mínimo         | 4.5:1          |
| Navegación por teclado   | 100% funcional |
| Alt text coverage        | 100%           |
| Headings jerárquicos     | Sin saltos     |

## Estándares

- [ ] WCAG 2.1 Level AA compliant
- [ ] WAI-ARIA 1.2 best practices
- [ ] Section 508 compliant (si aplica)

## Notas

- **Prioridad crítica:** Contraste, teclado, alt text, headings
- **Quick wins:** Corregir encoding, añadir aria-labels, fix focus
- **Revisar con cada nueva feature**
