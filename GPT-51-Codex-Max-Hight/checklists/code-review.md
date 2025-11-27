# Checklist de Code Review (v2)

- Seguridad: sin secretos/DB en repo; rutas con zod + authz + rate-limit; logs sin PII; CSP/CORS revisados.
- Contratos: OpenAPI actualizado; códigos de error documentados; cambios de esquema con migración + rollback plan.
- Tests: unit/integration/e2e/contract relevantes; coverage no baja; reportes adjuntos.
- Rendimiento: sin N+1; sin payloads grandes; lazy en módulos pesados; bundle diff revisado.
- A11y: foco, aria, labels, contraste; modales con role + escape + trap.
- Observabilidad: traceId en respuestas; logs estructurados; métricas si aplica; flags para cambios riesgosos.
- Calidad: complejidad <10; nombres claros; sin código muerto; comentarios solo donde aportan.
- Docs: changelog/ADR si decisión; checklist cumplido; instrucciones reproducibles.
