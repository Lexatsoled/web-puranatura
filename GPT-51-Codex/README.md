# GPT-51 Codex – Índice Maestro

---

version: 1.0  
updated: 2025-11-19  
owner: Codex PMO

Bienvenido al centro de documentación operativa para el proyecto **web-puranatura---terapias-naturales**. Aquí se controla cada decisión de ingeniería, el estado real del código y el plan para llevarlo a producción con calidad de clase mundial.

## Cómo navegar

| Carpeta                                             | Propósito                                                    | Vínculos clave                                                                     |
| --------------------------------------------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| [`Arquitectura/`](Arquitectura)                     | Modelos, diagramas y límites de confianza                    | [Mapa del sistema](Arquitectura/vision-sistema.md)                                 |
| [`Estado_Actual/`](Estado_Actual)                   | Instantáneas con fecha del estado del proyecto               | [Reporte actual](Estado_Actual/estado-proyecto.md)                                 |
| [`Hallazgos/`](Hallazgos)                           | Bitácora de debugging, evidencias y txt importados de GitHub | [Log general](Hallazgos/log-debug.md) • [Índice de problemas](Hallazgos/_index.md) |
| [`Fortalezas_Debilidades/`](Fortalezas_Debilidades) | Matriz FODA + decisiones estratégicas                        | [FODA 2025Q4](Fortalezas_Debilidades/FODA.md)                                      |
| [`Mejoras/`](Mejoras)                               | Roadmap de optimización                                      | [Backlog de mejoras](Mejoras/roadmap.md)                                           |
| [`Tests/`](Tests)                                   | Suites automatizadas/manuales y scripts                      | [Plan de pruebas](Tests/matriz-tests.md)                                           |
| [`Herramientas_Debug/`](Herramientas_Debug)         | Catálogo de utilidades, comandos y pseudocódigo              | [Toolbox](Herramientas_Debug/catalogo.md)                                          |
| [`Plan_Ejecucion/`](Plan_Ejecucion)                 | Plan maestro por fases con criterios de aceptación           | [Plan 7 fases](Plan_Ejecucion/plan-maestro.md)                                     |
| [`ToDo/`](ToDo)                                     | Tareas priorizadas, due dates y asignaciones                 | [Tablero Kanban](ToDo/backlog.md)                                                  |

## Convenciones

- Cada archivo `.md` inicia con un **front-matter ligero** (`version`, `updated`, `owner`) y finaliza con un bloque “Historial de cambios”.
- Los hallazgos se referencian usando el ID `MOD-AREA-###` y apuntan a archivos fuente (`../src/...:línea`).
- Las capturas importadas desde GitHub se depositan en [`Hallazgos/Evidencias/`](Hallazgos/Evidencias) y se enlazan con rutas relativas.
- Los 9 informes de GitHub Copilot viven en [`Hallazgos/Problemas_GitHub/`](Hallazgos/Problemas_GitHub) y cada uno tiene una tarjeta de seguimiento en el `log-debug`.

## Próximos pasos inmediatos

1. Completar la **Fase 1** del [Plan Maestro](Plan_Ejecucion/plan-maestro.md).
2. Registrar nuevos hallazgos siguiendo la plantilla en [`Hallazgos/_index.md`](Hallazgos/_index.md).
3. Mantener actualizado este índice tras cada sesión de trabajo.

---

### Historial de cambios

- **2025-11-19 · v1.0** – Creación inicial del índice, definición de convenciones y enlaces cruzados.
