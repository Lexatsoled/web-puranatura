# Blueprint de Infraestructura como Código

## Objetivos

- Reproducibilidad de entornos (dev/stage/prod) con Terraform/Ansible (o equivalente).
- Separación de concerns: red, compute, storage, observabilidad, secrets.

## Componentes sugeridos

- Compute: contenedores (Docker) orquestados (opcional k8s) o VM con systemd.
- Red: HTTPS terminación (NGINX/ALB), WAF opcional, rate-limit en edge.
- Storage: DB gestionada (Postgres) para prod; volúmenes cifrados.
- Secrets: vault o secret manager; inyección en runtime (no en imágenes).
- Observabilidad: Prometheus/Grafana stack; Loki/ELK para logs; Tempo/Jaeger para trazas.
- CI/CD: runners con permisos mínimos; deploy canary/blue-green soportado.

## Módulos (Terraform)

- vpc + subnets + sg
- db (postgres) + parameter group (timeouts, connections)
- ecs/k8s deployment (imagen backend/frontend)
- lb + certs + waf rules
- prom/grafana stack (o uso de SaaS APM)
- secrets (JWT, GEMINI, DB)

## Configuración mínima NGINX (si aplica)

- TLS 1.2/1.3, HSTS, gzip/br, proxy /api a backend, servir frontend estático.
- CSP headers si se termina en edge; `X-Frame-Options DENY`, `Referrer-Policy no-referrer`.
