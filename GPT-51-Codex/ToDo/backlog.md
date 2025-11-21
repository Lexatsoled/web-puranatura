# Backlog y Sistema de Tareas

---

version: 2.0
updated: 2025-11-22
owner: PM Técnico

| T0.1 | 🔷 Media | Limpieza documental (Análisis GPT 51, docs, reports)                    | DevOps/PMO          | 2025-11-19 | ✅ Hecho    | Inventario docs_inventory.json |
| ---- | -------- | ----------------------------------------------------------------------- | ------------------- | ---------- | ----------- | ------------------------------ |
| T1.1 | 🔴 Alta  | Backend auth + tokens seguros (SEC-AUTH-002)                            | Backend Team        | 2025-11-25 | ✅ Hecho    | Integrado con BFF y JWT        |
| T1.2 | 🔴 Alta  | Rotar secretos y crear `.env.example` (SEC-SECRETS-004)                 | DevOps              | 2025-11-22 | ✅ Hecho    | T1.1 parcial                   |
| T1.3 | 🔴 Alta  | Sanitizar contenido blog/productos (SEC-XSS-003)                        | Frontend            | 2025-11-23 | ✅ Hecho    | T1.1                           |
| T1.4 | 🔴 Alta  | Normalizar comentarios (es/en) según estándar                           | Tech Writing + Devs | 2025-11-26 | ✅ Hecho    | T1.1                           |
| T1.5 | 🔴 Alta  | Inicializar BFF en `backend/` (package.json + Express) usando plantilla | Backend Team        | 2025-11-24 | ✅ Hecho    | T1.1                           |
| T1.6 | 🔴 Alta  | Definir ORM/migraciones SQLite + endpoints `/auth,/products,/orders`    | Backend/DevOps      | 2025-11-28 | ✅ Hecho    | T1.5                           |
| T2.1 | 🔷 Media | Refactor `withLazyLoading` (PERF-LAZY-005)                              | Frontend            | 2025-11-27 | ✅ Hecho    | T1.1                           |
| T2.2 | 🔷 Media | Reescribir `optimizeImages.ts` (OPS-SCRIPT-008)                         | DevOps              | 2025-11-28 | ✅ Hecho    | T1.1                           |
| T2.3 | 🔷 Media | Gatear `useAnalytics` por consentimiento (OBS-ANA-006)                  | Frontend            | 2025-11-29 | ✅ Hecho    | T1.1                           |
| T2.4 | 🔷 Media | Generar manifest de imágenes + alinear dataset (IMG-ASSET-010)          | Frontend/DevOps     | 2025-11-29 | ✅ Hecho    | T2.2                           |
| T3.1 | 🔷 Media | Normalizar encoding/i18n (I18N-ENC-009)                                 | UX                  | 2025-12-02 | ✅ Hecho    | T2.1                           |
| T4.1 | ?? Media | Refactor pruebas Playwright y helper (QA-E2E-007)                       | QA                  | 2025-12-03 | Hecho           | T2.2                           |
| T4.2 | ?? Media | Reparar workflows CI (CI-SEC-001 ?)                                     | DevOps              | 2025-11-24 | Hecho           | T1.2, T1.5                     |
| T5.1 | ? Baja  | Dashboard metricas automatizado                                         | PM/QA               | 2025-12-05 | Hecho           | T2.x + T4.x                    |

## Notas operativas

- Actualiza esta tabla tras cada daily standup.
- Utiliza emojis 🔴/🔷/⚪/✅ para reflejar urgencia y estado.
- Cuando una tarea cambie de estado, añade comentario en Historial de cambios.

---

### Historial de cambios

- **2025-11-22 - v2.0** - T5.1 marcado como Hecho tras crear dashboard de m�tricas (/metricas) y actualizar metrics-dashboard.md.
- **2025-11-22 - v1.9** - T4.1 marcado como Hecho tras endurecer fixtures Playwright (rutas `/api/*`, datasets seguros) y limpiar errores de observer.
- **2025-11-22 - v1.8** - T4.2 marcado como Hecho tras validar lint/test/build/e2e en local (Node 20) y ajustar sanitizaci��n de im��genes.
- **2025-11-21 - v1.7** - T2.3 cerrada: `useAnalytics` consulta consentimiento y evita cargar GA/FB sin permiso.
- **2025-11-21 - v1.6** - T2.1 completada: `withLazyLoading` consume loaders reales y habilita code-splitting.
- **2025-11-21 - v1.5** - T2.2 completada: `scripts/optimizeImages.ts` ahora ejecuta `processProductImages` y valida resultados.
- **2025-11-21 - v1.4** - T2.4 completada: manifest automático y dataset alineado contra public/Jpeg.
- **2025-11-21 - v1.3** - T1.2 cerrada: .env\* ignorado globalmente, ejemplos de entorno añadidos y secretos dev rotados/documentados.
- **2025-11-21 - v1.2** - T1.6 completada: ORM Prisma y endpoints `/api/*` listos; build TypeScript vuelve a pasar.
- **2025-11-20 - v1.1** - T1.5 finalizada: backend Express+Prisma inicializado, scripts npm listos.
- **2025-11-20 - v1.1** - T1.4 completada tras normalizar hooks, servicios y scripts principales.
- **2025-11-20 - v1.1** - T1.3 completada: sanitización total de datasets, componentes y pruebas.
- **2025-11-19 - v1.1** - Se añadieron T1.5/T1.6 y se limpió el formato.
- **2025-11-19 - v1.0** - Creación del backlog inicial enlazado a los hallazgos.
  \*\*\* End Patch
