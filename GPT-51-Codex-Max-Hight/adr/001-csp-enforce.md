# ADR-001: CSP Enforce con dominios de terceros controlados

- Estado: aceptada
- Fecha: 2025-11-24
- Contexto: CSP actual useDefaults:false sin script-src/style-src/connect-src; GA/FB/Maps necesitan dominios permitidos y XSS requiere defensa.
- Decisión: Definir CSP explícita (script/style/connect/frame/img/base/font) con allowlist de dominios requeridos (self, googletagmanager.com, google-analytics.com, connect.facebook.net, google.com maps). Desplegar en report-only → enforce con flag `cspEnforce`.
- Consecuencias: Reduce superficie XSS/inline; riesgo de romper cargas de terceros si no están listados.
- Plan de implementación:
  1. Añadir directivas CSP en helmet (backend).
  2. Activar report-only primero; revisar reports 48h.
  3. Enforce detrás de flag `cspEnforce`; canary UI 5%-25%-50%-100%.
  4. Validar con LHCI y revisar consola de errores.
- Revisión futura: revaluar dominios cuando se añadan nuevas integraciones (ej. Sentry, APM).
