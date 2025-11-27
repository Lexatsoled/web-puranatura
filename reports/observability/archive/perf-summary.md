# Resumen de sondas HTTP

| Endpoint | Ruta | Estado | Duracion (ms) |
| --- | --- | --- | --- |
| GET / | / | 200 | 11.08 |
| GET /api/health | /api/health | 200 | 3.30 |
| GET /api/products?page=1&pageSize=5 | /api/products?page=1&pageSize=5 | 200 | 5.93 |
| GET /api/products (etag) | /api/products?page=1&pageSize=5 | 304 | 9.96 |
| GET /metrics | /metrics | 200 | 18.00 |

Generado: 2025-11-27T13:42:12-04:00
