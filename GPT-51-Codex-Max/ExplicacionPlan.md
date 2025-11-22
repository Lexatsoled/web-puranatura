# Explicación del Plan (para entenderlo fácil)

Esta guía explica qué vamos a hacer, cómo y por qué, con palabras sencillas. La idea es dejar la casa ordenada, segura y rápida, y que cualquiera pueda seguir los pasos.

## Lo más importante primero

Primero arreglamos la seguridad y lo básico. Si la puerta está abierta (fugas de secretos), nada más importa. Luego ordenamos los datos y la forma de hablar entre las partes (la API). Después hacemos la web más ligera y bonita. Más tarde añadimos “sensores” (logs, métricas) y una forma de publicar sin romper nada. Al final ponemos reglas para que el orden se mantenga siempre.

## Fase 0 – Preparar el terreno

- **Qué**: Revisar qué archivos hay, quitar llaves y bases de datos guardadas en el código, cambiar las llaves de seguridad, y pausar nuevas versiones hasta cerrar los problemas serios. Esto asegura que no haya información sensible al alcance de cualquiera y que no añadamos más cambios sobre una base insegura.
- **Cómo**: Mirar `inventory.json`, mover secretos a variables de entorno, actualizar `.gitignore` y avisar que no se despliega hasta arreglar lo crítico. Son acciones simples y ordenadas para que todo quede protegido y controlado.
- **Por qué**: Es como cerrar con llave la casa y guardar las copias en un lugar seguro antes de decorarla. Si alguien pudiera entrar libremente, cualquier mejora posterior no tendría sentido.

## Fase 1 – Seguridad y estabilidad

- **Qué**: Poner cascos y guantes al sistema: protección contra ataques web (CSRF), límites de peticiones, cabeceras de seguridad, permisos claros (solo admin crea productos), validar toda la información que entra y sale, y revisar librerías con fallos conocidos. Así reducimos los agujeros por donde podrían atacar.
- **Cómo**: Seguir `security-playbook.md`, añadir validadores (zod), roles, cabeceras (CSP, HSTS), y correr `npm run scan:security`. Son pasos concretos que blindan la aplicación sin dejar cabos sueltos.
- **Por qué**: Evita que gente malintencionada cambie precios, robe sesiones o meta código malicioso. Igual que en una tienda física, cerramos vitrinas y ponemos alarmas para que nada valioso se robe o altere.

## Fase 2 – Datos y API

- **Qué**: Definir el “idioma” entre frontend y backend (OpenAPI), crear y versionar la base de datos con migraciones, paginar el catálogo para que no pese, cachear respuestas y dar mensajes de error claros. Esto evita malentendidos y hace que las respuestas sean más rápidas.
- **Cómo**: Usar `api/openapi.yaml`, pruebas de contrato, migraciones Prisma, cache ETag, y validadores que limpien datos peligrosos. Cada acción garantiza que los datos viajen limpios y ordenados, como paquetes bien etiquetados.
- **Por qué**: Si todos hablan igual y los datos están ordenados, hay menos errores y la tienda carga más rápido. Es como tener un mismo plano para construir: todos saben dónde va cada pieza.

## Fase 3 – Web, accesibilidad y velocidad

- **Qué**: Unificar estados (un solo carrito y notificaciones), cargar partes pesadas solo cuando se necesitan (lazy load), optimizar imágenes, y asegurarse de que cualquier persona pueda usarla (foco visible, textos alternativos, buen contraste). Así evitamos confusiones y reducimos el peso de la página.
- **Cómo**: Refactors de estado (ver `refactor-roadmap.md`), dividir código, usar imágenes ligeras, y correr pruebas de accesibilidad y rendimiento (axe, Lighthouse). Son acciones para que la web sea rápida y cómoda para todos.
- **Por qué**: Menos errores de “se me perdió el carrito”, la página va más ligera, y más gente puede usarla sin problemas. Es como organizar un cuarto: menos trastos, más espacio y mejor iluminación.

## Fase 4 – Sensores y despliegue seguro

- **Qué**: Añadir registros claros (logs) y trazas para saber qué pasa, medir tiempos y errores (métricas y alertas), y publicar versiones poco a poco (canary/blue-green) con la opción de volver atrás si algo falla. Probar backups y restauraciones. Esto pone “sensores” y frenos de emergencia.
- **Cómo**: Seguir `observabilidad.md` y `ci-cd.md`, usar el pipeline que ya existe (`.github/workflows/ci.yml`), hacer backups cifrados y ensayos de restauración. Cada paso asegura que vemos los problemas, y si algo sale mal, revertimos o restauramos.
- **Por qué**: Si algo falla, lo ves rápido, despliegas sin dejar a los usuarios a oscuras, y puedes recuperar datos si hay un problema. Es como tener cámaras, alarmas y un plan de evacuación en un edificio.

## Fase 5 – Que el orden se mantenga

- **Qué**: Reglas antes de guardar cambios (hooks), revisión con checklist, bajar la complejidad del código, y guías para nuevos colaboradores. Así evitamos desorden futuro.
- **Cómo**: Usar los scripts de lint, tests y format en hooks; aplicar `checklists/`; seguir `refactor-roadmap.md`. Son pasos automáticos y listas para no olvidar nada.
- **Por qué**: Evita que el código se vuelva un caos de nuevo; los errores se detectan antes de llegar a producción. Igual que mantener la casa con rutinas de limpieza para que no se acumule el polvo.

## Controles (“Gates”) que no se pueden saltar

- En cada fase, si falla algo crítico, no se avanza. En PRs: lint, typecheck, tests unitarios, contrato, gitleaks y prueba rápida de rendimiento API. En la rama principal (main): además prueba de rendimiento web (LHCI) y revisión de vulnerabilidades (`npm audit`). Así se garantiza que nada roto llega al usuario.
- Esto es como no pasar al siguiente nivel hasta completar el anterior sin trampas: si el semáforo está en rojo, se detiene el avance hasta que sea seguro continuar.

## Comandos clave (ya listos en el proyecto)

- Instalar: `npm ci` y `npm --prefix backend ci`. Esto deja todas las dependencias listas, como preparar los materiales antes de construir.
- Revisar código: `npm run lint && npm run type-check` (en CI / bash) — en PowerShell local usa `;` o ejecuta cada comando por separado.
- Construir: `npm --prefix backend run build` y `npm run build`. Genera la versión lista para usar del backend y frontend.
- Probar: `npm run test:ci`, `npm run test:contract`, `npm run test:e2e`. Asegura que las piezas encajan (unidades), que hablamos bien con la API (contrato), y que los flujos completos funcionan (extremo a extremo).
- Seguridad: `npm run scan:security`. Detecta fugas de secretos o patrones peligrosos.
- Rendimiento: `npm run perf:api` (siempre); `npm run perf:web` en la rama principal. Comprueba que la app responde rápido.
- Revisar dependencias: `npm audit --production --audit-level=high`. Verifica que no haya librerías con fallos graves.

## Dónde está todo

- El plan y guías: carpeta `GPT-51-Codex-Max` (lee `prompt-inicial.md` y `execution-guide.md` para empezar).
- Pipeline real: `.github/workflows/ci.yml`.
- Scripts en `package.json` ya preparados.

Con esta explicación, incluso alguien de 10 años puede entender que primero aseguramos la casa, luego ordenamos los muebles y la forma de hablar entre habitaciones, después la hacemos bonita y rápida, más tarde ponemos alarmas y forma segura de cambiar cosas, y al final dejamos reglas para que nadie desordene de nuevo.
