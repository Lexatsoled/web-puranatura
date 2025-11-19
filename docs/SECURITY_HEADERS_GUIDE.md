# Guía de Headers de Seguridad

## Introducción

El backend aplica headers de seguridad avanzados mediante `@fastify/helmet` y un plugin dedicado (`backend/src/plugins/securityHeaders.ts`). Esta configuración endurece el navegador frente a XSS, clickjacking, sniffing y abuso de APIs del navegador.

## Headers Implementados

| Header                      | Propósito                      | Valor                                          |
| --------------------------- | ------------------------------ | ---------------------------------------------- |
| `Content-Security-Policy`   | Limitar orígenes permitidos    | `default-src 'self'; script-src 'self' …`      |
| `Strict-Transport-Security` | Forzar HTTPS                   | `max-age=31536000; includeSubDomains; preload` |
| `X-Frame-Options`           | Prevenir clickjacking          | `DENY`                                         |
| `X-Content-Type-Options`    | Bloquear MIME sniffing         | `nosniff`                                      |
| `Permissions-Policy`        | Bloquear APIs sensibles        | `geolocation=(), camera=(), …`                 |
| `Referrer-Policy`           | Reducir fuga de datos          | `strict-origin-when-cross-origin`              |
| `Clear-Site-Data`           | Limpiar cachés en logout       | `"cache", "cookies", "storage"`                |
| `Report-To` (prod)          | Recolección de violaciones CSP | `{"group":"csp-endpoint",...}`                 |

## Content Security Policy

- **Scripts**: solo `self`, GA/GTM y nonces (dev permite `unsafe-inline`).
- **Estilos**: `self` + `unsafe-inline` (Tailwind) + Google Fonts.
- **Imágenes**: `self`, `data:`, `blob:`, CDN configurado.
- **Connect**: API propia + GA; en dev se permite `localhost` y WS de Vite.
- **Frames y base URI**: restringidos a `self`/`none`.
- **Reportes**: `report-uri` y `Report-To` apuntan a `/api/csp-report`.

## HSTS

- Max-age de 1 año.
- `includeSubDomains` para propagar a todo el dominio.
- `preload` habilitado solo en producción.
- Guía detallada en `docs/HSTS_PRELOAD_GUIDE.md`.

## Permissions Policy

Todas las APIs del navegador se deshabilitan (`()`), salvo:

- `fullscreen=(self)`
- `payment=(self)`

Esto evita que iframes externos abusen de sensores, cámara o micro.

## Testing

1. **Automático**: `npm run test -- securityHeaders.test.ts`
2. **Manual**:
   - `./scripts/validate-security-headers.sh https://tu-dominio`
   - https://securityheaders.com
   - https://observatory.mozilla.org

## Troubleshooting

- **Inline script bloqueado**: añade nonce válido (`'nonce-<valor>'`) o mueve script a archivo externo.
- **CDN nuevo**: agrega su origen a `CDN_URL` o actualiza `imgSrc`/`fontSrc`.
- **Integraciones de terceros**: autoriza dominios necesarios en la directiva correspondiente (mantener lista mínima).
- **Modo Report Only**: establece `CSP_REPORT_ONLY=true` en `.env` para activar `Content-Security-Policy-Report-Only`.
