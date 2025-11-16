# API Rate Limits

## Limites globales

### Usuarios anonimos
- **Maximo:** 100 solicitudes por minuto
- **Identificador:** direccion IP (`anon:<ip>`)

### Usuarios autenticados
- **Maximo:** 200 solicitudes por minuto
- **Identificador:** ID de usuario (`user:<id>`)
- **Deteccion:** token `accessToken` en cookie o header `Authorization`

## Limites por endpoint

| Endpoint | Regla | Limite | Ventana | Comentario |
| --- | --- | --- | --- | --- |
| `POST /api/auth/login` | `login` | 5 req | 15 min | Defensa contra fuerza bruta |
| `POST /api/auth/signup` | `register` | 3 req | 1 h | Protege spam de registros |
| `POST /api/orders` | `checkout` | 10 req | 10 min | Requiere autenticacion opcional |
| `GET /api/products/search` | `search` | 60 req | 1 min | Pensado para autosuggest |
| `GET /api/products/*` | `publicApi` | 100 req | 1 min | Catalogo y detalle |
| `GET /api/admin/rate-limit-stats` | `admin` | 300 req | 1 min | Solo cuentas admin |
| `DELETE /api/admin/rate-limit-reset/:id` | `admin` | 300 req | 1 min | Solo cuentas admin |

> Nota: Si Redis esta activo, los contadores son compartidos entre instancias. En memoria se reinician al reiniciar el proceso.

## Headers informativos

Todas las respuestas incluyen:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1699999999
```

- `X-RateLimit-Limit`: maximo permitido en la ventana
- `X-RateLimit-Remaining`: solicitudes restantes antes de 429
- `X-RateLimit-Reset`: timestamp UNIX del reseteo

## Error 429

```json
{
  "statusCode": 429,
  "error": "Too Many Requests",
  "message": "Rate limit exceeded. Try again in 45 seconds.",
  "retryAfter": 45
}
```

### Que hacer como cliente
1. Leer `retryAfter` y reintentar despues de ese tiempo
2. Implementar backoff exponencial
3. Reducir frecuencia de pooling y cachear respuestas

## Whitelist

IPs listadas en `RATE_LIMIT_WHITELIST` (por defecto `127.0.0.1,::1`) saltan el limite global. Para agregar nuevas IPs:
1. Editar la variable en `.env`
2. Reiniciar el backend

Usar whitelist solo para bots confiables o health checks.

## Monitoreo y administracion

- **Stats:** `GET /api/admin/rate-limit-stats` (requiere correo admin en `ADMIN_EMAILS`)
- **Reset individual:** `DELETE /api/admin/rate-limit-reset/:identifier`
- **Logs:** cada respuesta 429 genera `fastify.log.warn` con IP, usuario y ruta

## Mejores practicas para clientes
1. Autenticarse para obtener doble capacidad
2. Cachear catalogos y usar filtros locales cuando sea posible
3. Migrar actualizaciones en tiempo real a WebSockets en vez de polling agresivo
4. Implementar backoff exponencial ante 429
5. Supervisar `X-RateLimit-*` para ajustar la cadencia automaticamente

## FAQ

**Por que recibo 429?**  
Superaste el limite configurado para tu IP o usuario. Revisa los headers para saber cuando reintentar.

**Como obtengo mas capacidad?**  
Inicia sesion (dobla el limite global) o solicita inclusion en la whitelist/admin.

**El limite es por IP o usuario?**  
Anonimos: por IP. Autenticados: por ID de usuario.

**Redis es obligatorio?**  
No en desarrollo. En produccion y entornos con multiples instancias es altamente recomendado para consistencia.
