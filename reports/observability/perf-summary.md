# Resumen de sondas HTTP

| Endpoint | Ruta | Estado | Duracion (ms) |
| --- | --- | --- | --- |
| GET / | / | 200 | 40.24 |
| GET /api/health | /api/health | 200 | 135.20 |
| GET /api/products?page=1&pageSize=5 | /api/products?page=1&pageSize=5 | 200 | 23.88 |
| GET /api/products (etag) | /api/products?page=1&pageSize=5 | 304 | 14.54 |
| GET /metrics | /metrics | 200 | 14.67 |

Generado: 2025-12-04T15:49:20-04:00
