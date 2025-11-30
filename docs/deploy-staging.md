# Despliegue a Staging (CSP report-only)

Este documento describe los pasos para desplegar la app en un entorno de staging con CSP en modo report-only y recoger datos durante 48h.

Requisitos previos (acceso/secretos):

Un target de despliegue a tu elección (GitHub Environments, Docker host, Azure WebApp, ECS, etc.).
Manifiestos de ejemplo se encuentran en `infra/examples/manifests/` (por ejemplo `infra/examples/manifests/staging-deployment.yaml`) — son opcionales. Si no usas un orquestador, ignora los manifiestos y despliega con tu proveedor preferido.

- Revisar el estado de tu despliegue en la plataforma que uses (por ejemplo: consulta la consola/CLI de tu proveedor para ver deployments, services o sus equivalentes).
- Si usas Prometheus/Grafana, aplica/ajusta los ficheros de ejemplo en `infra/prometheus` y `infra/grafana` según tu plataforma.
- Los reports se persistirán en `backend/reports/csp-reports.ndjson` según cómo deployes la app. Si tu proveedor utiliza pods/containers efímeros, asegúrate de tener persistencia adecuada (por ejemplo un volume / object storage) si quieres retención entre restarts.
- `infra/prometheus/prometheus-scrape.yaml` → ejemplo de scrape para Prometheus apuntando a `puranatura-backend-staging:80`
- `infra/grafana/csp-alerts.yaml` → ejemplo de reglas para alertas (blocked ratio >1% en 48h)
- `.github/workflows/deploy-staging.yml` → workflow manual (workflow_dispatch) que construye imagen y, si tiene credenciales, puede push la imagen; la aplicación de manifiestos de ejemplo es opcional y depende de tu plataforma/target.

Despliegue paso-a-paso (uso del workflow GitHub Actions):

1. Crear una rama con los cambios y abrir PR (esto también ejecutará el pipeline de quality en CI):
   - git checkout -b feat/deploy-staging
   - git add . && git commit -m "feat: infra + workflow for staging deploy (CSP report-only)"
   - git push origin feat/deploy-staging

2. En GitHub, abre la pestaña Actions y ejecuta manualmente `Deploy to staging` (workflow*dispatch). Si no tienes credenciales de despliegue (por ejemplo `DOCKERHUB*\*`), el job terminará en modo dry-run.

3. Valida que el deployment se ha creado y que el Service expone la app:
   - Consultar el estado de tus deployments / servicios desde la consola o CLI de la plataforma de despliegue que uses.
   - comprobar la URL externa (LoadBalancer) y probar `GET /` y `POST /api/security/csp-report` con un `csp-report` valido.

4. Habilitar Prometheus scraping de la `infra/prometheus/prometheus-scrape.yaml` y aplicar las reglas de alerta (Grafana/Prometheus) con `infra/grafana/csp-alerts.yaml`.

5. Recoger reports durante 48 horas:
   - Los reports se persistirán en `backend/reports/csp-reports.ndjson` según cómo deployes la app. Por defecto el manifiesto de ejemplo usa almacenamiento efímero — para retención entre reinicios, configura almacenamiento persistente en tu proveedor (PVC u object storage) y ajusta la manifest en `infra/` si procede.
   - Opcionalmente enviar los reports a un endpoint centralizado o object storage para persistencia a largo plazo.
   - Ejecutar `node scripts/compute-csp-metrics.cjs` para obtener resumen localmente (si puedes acceder al archivo ndjson) o usar Prometheus/Grafana para chequear métricas.

6. Policy decision: si ratio < 1% durante 48h, preparar canary rollout a `enforce` con `docs/canary-rollout.md`.
