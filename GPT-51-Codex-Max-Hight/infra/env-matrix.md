# Matriz de Configuración por Entorno

| Clave                | Dev                     | Stage                          | Prod                          |
|----------------------|-------------------------|--------------------------------|-------------------------------|
| NODE_ENV             | development             | staging                        | production                    |
| ALLOWED_ORIGINS      | http://localhost:5173   | https://stage.puranatura.test  | https://puranatura.com        |
| DATABASE_URL         | file:./database.sqlite  | postgres://stage/...           | postgres://prod/...           |
| JWT_SECRET           | dev-secret (random)     | secret stage (vault)           | secret prod (vault)           |
| JWT_REFRESH_SECRET   | dev-refresh (random)    | secret stage (vault)           | secret prod (vault)           |
| GEMINI_API_KEY       | (vacío)                 | stage key (vault)              | prod key (vault)              |
| ADMIN_EMAILS         | dev admin               | stage admins                   | prod admins                   |
| RATE_LIMIT_MAX       | 300                     | 200                            | 150                           |
| RATE_LIMIT_WINDOW    | 15m                     | 15m                            | 15m                           |
| CSP_MODE             | report-only             | enforce                        | enforce                       |
| LOG_LEVEL            | debug                   | info                           | info                          |
| TRACING_SAMPLE       | 1.0                     | 0.5                            | 0.05                          |
| BACKUP_ENABLED       | opcional                | sí                             | sí                            |
