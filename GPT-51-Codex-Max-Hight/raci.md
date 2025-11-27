# RACI por Fase y Dominio

## Roles
- FE: Frontend
- BE: Backend
- SRE: Infra/CI/CD/observabilidad
- SEC: Seguridad
- QA: Calidad/Testing
- PM/PO: Producto

## Fase 0
- Inventario/secretos/CSP report-only: R(SRE/SEC), A(SRE), C(FE/BE), I(QA/PO)

## Fase 1 (Seguridad)
- Hardening helmet/CORS/rate-limit/CSRF: R(BE), A(SEC), C(SRE), I(QA)
- Zod/validación rutas: R(BE), A(BE), C(QA/SEC)
- IA segura: R(BE), A(SEC), C(SRE)
- SAST/DAST/gitleaks: R(SEC), A(SEC), C(SRE), I(PO)

## Fase 2 (API/Datos)
- OpenAPI + contrato: R(BE), A(BE), C(QA/SEC), I(FE)
- Migraciones Prisma: R(BE), A(BE), C(SRE), I(QA)
- Catálogo paginado/cache: R(BE), A(BE), C(FE), I(QA)
- Analytics endpoint: R(BE), A(BE), C(FE/SEC), I(QA)

## Fase 3 (UX/A11y/Perf)
- Lazy/catalog/modales: R(FE), A(FE), C(BE/QA)
- A11y WCAG: R(FE), A(FE), C(QA)
- LHCI/bundles: R(FE), A(FE), C(QA/SRE)

## Fase 4 (Obs/CI/CD/Resiliencia)
- Tracing/logs/métricas: R(SRE/BE), A(SRE), C(QA/SEC)
- Pipeline CI/CD: R(SRE), A(SRE), C(BE/FE/QA/SEC)
- Backups/DR: R(SRE), A(SRE), C(SEC), I(PO)

## Fase 5 (Refactor/Deuda)
- Complejidad/patrones: R(FE/BE), A(FE/BE leads), C(QA)
- Pre-commit/estilo: R(FE/BE), A(SRE), C(QA)
- ADRs: R(owners), A(Arquitectura), C(PO/SEC)
