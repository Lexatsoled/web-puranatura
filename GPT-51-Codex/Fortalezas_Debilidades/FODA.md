# Matriz FODA – Proyecto PuraNatura

---

version: 1.0  
updated: 2025-11-19  
owner: Dirección Técnica

| Tipo              | Elementos clave                                                                                                                                                                                  | Acciones recomendadas                                                                          |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| **Fortalezas**    | - Stack moderno (React 19, Vite 6, Zustand, Tailwind).<br>- Inventario completo (`inventory.json`) con hashes.<br>- Cobertura de datos estáticos rica (productos, servicios, testimonios).       | Capitalizar el pipeline moderno añadiendo bundling incremental y SSR ligero cuando exista BFF. |
| **Oportunidades** | - Implementar backend real (Express/Mongoose + JWT seguros).<br>- Automatizar optimización de imágenes y métricas RUM.<br>- Integrar pruebas e2e confiables para checkout y auth.                | Priorizar Fase 1–4 del [Plan Maestro](../Plan_Ejecucion/plan-maestro.md).                      |
| **Debilidades**   | - Autenticación ficticia y manejo inseguro de tokens.<br>- Workflows CI degradados (9 fallos).<br>- Strings con mojibake que dañan la UX.                                                        | Rediseñar auth, limpiar encoding y endurecer pipeline.                                         |
| **Amenazas**      | - Riesgo legal por almacenar datos sensibles en `localStorage`.<br>- Secretos públicos → posibilidad de ataques si se despliega sin rotación.<br>- Reputación dañada si PR #2 permanece en rojo. | Implementar controles de seguridad, rotar llaves y mantener regulares revisiones AppSec.       |

## Decisiones vinculadas

- **ADR-SEC-001:** Ningún dato PII permanecerá en `localStorage` después de Fase 1.
- **ADR-CI-001:** Todo PR debe pasar lint/unit/e2e/security-scan antes de merge.
- **ADR-DOC-001:** GPT-51-Codex es fuente única de verdad para documentación.

---

### Historial de cambios

- **2025-11-19 · v1.0** – Matriz inicial basada en auditoría Codex y reportes CI.
