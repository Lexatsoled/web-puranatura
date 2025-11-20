# Indices Optimizados de SQLite

Esta referencia resume los indices creados en la migracion `0005_query_indexes.sql` para las tablas criticas. Todos los indices utilizan `CREATE INDEX IF NOT EXISTS` para permitir reprovisionamientos seguros.

| Tabla         | Indice                        | Columnas                                       | Proposito                                               |
| ------------- | ----------------------------- | ---------------------------------------------- | ------------------------------------------------------- |
| `products`    | `idx_products_category`       | `category`                                     | Filtro primario de catalogo                             |
| `products`    | `idx_products_price`          | `price`                                        | Ordenamientos y filtros por precio                      |
| `products`    | `idx_products_stock`          | `stock`                                        | Auditorias de inventario                                |
| `products`    | `idx_products_created_at`     | `created_at DESC`                              | Listas cronologicas                                     |
| `products`    | `idx_products_category_price` | `(category, price)`                            | Listados segmentados por categoria y rango de precio    |
| `orders`      | `idx_orders_user_id`          | `user_id`                                      | Historial por usuario                                   |
| `orders`      | `idx_orders_status`           | `status`                                       | Paneles administrativos por estado                      |
| `orders`      | `idx_orders_created_at`       | `created_at DESC`                              | Linea de tiempo de ordenes                              |
| `orders`      | `idx_orders_user_status`      | `(user_id, status)`                            | Consultas combinadas para soporte                       |
| `order_items` | `idx_order_items_order_id`    | `order_id`                                     | Join inmediato contra `orders`                          |
| `order_items` | `idx_order_items_product_id`  | `product_id`                                   | Auditorias de SKU y analitica                           |
| `sessions`    | `idx_sessions_user_id`        | `user_id`                                      | Revocacion rapida por usuario                           |
| `sessions`    | `idx_sessions_expires_at`     | `expires_at`                                   | Limpieza automatica y cron jobs                         |
| `sessions`    | `idx_sessions_token_hash`     | `token_hash`                                   | Garantizar unicidad y busquedas por token               |
| `sessions`    | `idx_sessions_user_active`    | `(user_id, expires_at)` donde `is_revoked = 0` | Busqueda de sesiones activas sin escanear toda la tabla |

> Para revisar los indices en una base existente: `sqlite3 backend/database.sqlite ".indexes"`.
