# Guía breve de estilo (TS/React/Node/Prisma)

## General

- Idioma: comentarios y mensajes en español claro.
- Nombres: lowerCamelCase (vars/fns), PascalCase (componentes/clases), SCREAMING_SNAKE (const global).
- Imports: librerías → alias → relativos; evitar paths profundos (usar alias `@`).
- Comentarios: sólo donde aporten (decisiones, efectos secundarios); no narrativos.

## TypeScript / Node

- Sin `any`; preferir tipos inferidos o derivados de Zod/OpenAPI.
- Manejo de errores: usar helpers (`sendErrorResponse`); no silenciar catch.
- Async: siempre await/return; abortController para timeouts externos.
- Logger: usar logger estructurado; no `console.*` en código de prod.

## React

- Hooks: deps completas; cleanup en useEffect; no side effects en render.
- Componentes: funciones puras; props tipadas; evitar rerenders pesados (memo si aplica).
- A11y: role/aria correctos; focus manejado; labels en formularios; imágenes con alt.
- Estado: providers únicos; no duplicar estados derivables de props/api.

## Prisma / SQL

- Nombres consistentes (snake o camel) según convención actual; slugs únicos.
- Selects explícitos; evitar `include` innecesario; índices para consultas críticas.
- Migraciones versionadas con rollback documentado; seeds idempotentes.
