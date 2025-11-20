# Estándar de Comentarios y Notas

---

version: 1.0  
updated: 2025-11-19  
owner: Tech Writing

## Objetivo

Todo comentario debe ayudar a que cualquier persona (estudiante, junior, senior o IA) entienda el _por qué_ del código sin leerlo de arriba a abajo. El idioma oficial es **español**.

## Tipos de comentarios

| Tipo                 | Dónde se usa                                                        | Ejemplo                                                                    |
| -------------------- | ------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Encabezado de módulo | Inicio de archivos complejos (`contexts/`, `hooks/`, `services/`)   | `// Maneja la sesión del usuario y sincroniza tokens con el backend.`      |
| Bloque explicativo   | Antes de lógica no obvia (algoritmos, caching, trabajos asíncronos) | `// Calcula la ventana de rate limiting para evitar 429 en la API.`        |
| Inline puntual       | Dentro de una función cuando una línea parece contraintuitiva       | `result.current[1]('valor'); // Forzamos re-render para hidratar Zustand.` |
| TODO/FIXME           | Tareas pendientes con referencia a backlog                          | `// TODO(T2.1): mover a lazy loader una vez que exista el backend.`        |

## Buenas prácticas

- **Idiomas:** solo español (salvo nombres de API). Si un comentario está en inglés, tradúcelo y mantén el original entre paréntesis si aporta contexto histórico.
- **Intención, no reiteración:** explica _por qué_ se hace, no _qué_ hace una línea evidente.
- **Formato:** usa letras minúsculas con mayúscula inicial, termina con punto; para bloques, emplea `/** ... */` en TypeScript.
- **Actualización obligatoria:** cualquier PR que modifique lógica debe revisar/actualizar los comentarios afectados.

## Checklist de revisión

1. ¿Todos los archivos críticos tienen encabezado descriptivo? (contextos, hooks, servicios, scripts)
2. ¿Hay comentarios en español en cada sección compleja?
3. ¿Se eliminaron comentarios redundantes o desactualizados?
4. ¿Los TODOs hacen referencia a IDs del backlog (`T1.1`, `IMPR-002`, etc.)?

## Integración en procesos

- Añadido como requisito en [`Plan_Ejecucion/plan-maestro.md`](../Plan_Ejecucion/plan-maestro.md) – ver Fase 6.
- Tarea dedicada: `T1.4 Normalizar comentarios en español` (ver [`ToDo/backlog.md`](../ToDo/backlog.md)).
- QA + reviewers deben marcar PRs que no cumplan con este estándar.

---

### Historial de cambios

- **2025-11-19 · v1.0** – Documento inicial creado según nueva política.
