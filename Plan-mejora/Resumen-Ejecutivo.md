# Resumen Ejecutivo (Plan de Mejora PuraNatura)

## Objetivo

Refuerzo integral de seguridad, resiliencia, UX/A11y, rendimiento y CI/CD sin SaaS ni Docker/K8s en esta fase. Preparar el terreno para contenedores en el futuro.

## Orden de uso (para agentes)

1. Leer Resumen Ejecutivo (este documento).
2. Leer `Plan-Maestro.md` (fases y métricas).
3. Ejecutar con `Checklist-Plan-Maestro.md`.
4. Consultar playbooks específicos cuando el checklist lo pida.
5. Skeletons en `Plan-mejora/scripts/*.skeleton.*` son plantillas: copiar/adaptar fuera antes de usarlos.

## Priorización global (P0/P1/P2)

- **P0 (crítico)**: Secretos/estructura; escaneo de secretos; hardening base (/metrics, trust proxy, cookies Secure); CSP nonces (sin romper UI); healthcheck; referencias a findings.
- **P1 (alto)**: Rate-limit por usuario; breaker (básico→completo); backups automatizados; CSP enforce tras pruebas; k6 en PRs críticos; gates OpenAPI.
- **P2 (medio)**: A11y refinada y budgets de bundle; mojibake; documentación README/Changelog; mantenimiento (TODOs, deprecations).

## Pre-reqs (Fase -1)

- Node >= 20, npm; sin Docker/K8s en esta fase.
- Binarios locales: gitleaks, k6, Playwright browsers, LHCI/Chrome headless.
- Carpeta `Secretos/` en raíz (gitignored) con `backend.env.local`, `frontend.env.local`, `.required.json`.

## Métricas clave (salida por fase)

- F1 (Seguridad): CSP sin unsafe-inline + nonces; tests 401/403/429 OK; 0 high/critical; CSP viol/1k < 1.
- F2 (Resiliencia): breaker abre/cierra correcto; p95 /products < 300ms; 0 reseeds en request; backup+restore verificados.
- F3 (UX/A11y/Perf): bundle < 200KB gzip; LCP móvil < 2.5s; CLS < 0.1; axe/playwright ≥ 90; no bloqueos teclado.
- F4 (CI/CD): gates OpenAPI activos; check-secret-drift OK; k6 en PRs críticos; pipeline < 10m; mojibake limpio.

## Riesgos rápidos / rollback

- CSP rompe UI → volver a reportOnly con nonce; revisar inline.
- Breaker falsos positivos → subir umbral o `BREAKER_ENABLED=false`.
- /metrics inaccesible → ajustar allowlist/token, no reabrir público.
- Bundles > budget → splitting/lazy; revertir dependencia pesada.
- Mojibake → convertir a UTF-8 (ver playbook) y re-lint/test.

## Notas de esfuerzo

- Añadir buffer ~30% sobre las estimaciones por iteraciones y pruebas.
