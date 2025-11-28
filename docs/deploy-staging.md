# Despliegue a Staging (CSP report-only)

Este documento describe los pasos para desplegar la app en un entorno de staging con CSP en modo report-only y recoger datos durante 48h.

Requisitos previos (acceso/secretos):

- Un clúster Kubernetes reachable con `kubectl` (o un target de despliegue que prefieras: Docker Swarm, Azure WebApp, etc.).
- Secrets configurados en GitHub Actions (opcional): `KUBECONFIG`, `DOCKERHUB_USERNAME`, `DOCKERHUB_PASSWORD`.

Qué hay en este repo para staging:

- `infra/k8s/staging-deployment.yaml` → Deployment + Service (ejemplo) con env var CSP_REPORT_ONLY=true
- `infra/prometheus/prometheus-scrape.yaml` → ejemplo de scrape para Prometheus apuntando a `puranatura-backend-staging:80`
- `infra/grafana/csp-alerts.yaml` → ejemplo de reglas para alertas (blocked ratio >1% en 48h)
- `.github/workflows/deploy-staging.yml` → workflow manual (workflow_dispatch) que construye imagen y, si encuentra secretos, hace push y aplica manifests en el cluster.

Despliegue paso-a-paso (uso del workflow GitHub Actions):

1. Crear una rama con los cambios y abrir PR (esto también ejecutará el pipeline de quality en CI):
   - git checkout -b feat/deploy-staging
   - git add . && git commit -m "feat: infra + workflow for staging deploy (CSP report-only)"
   - git push origin feat/deploy-staging

2. En GitHub, abre la pestaña Actions y ejecuta manualmente `Deploy to staging` (workflow_dispatch). Si no tienes `KUBECONFIG`/docker credentials, el job terminará en modo dry-run.

3. Valida que el deployment se ha creado y que el Service expone la app:
   - kubectl get deploy,svc -n <staging-namespace>
   - comprobar la URL externa (LoadBalancer) y probar `GET /` y `POST /api/security/csp-report` con un `csp-report` valido.

4. Habilitar Prometheus scraping de la `infra/prometheus/prometheus-scrape.yaml` y aplicar las reglas de alerta (Grafana/Prometheus) con `infra/grafana/csp-alerts.yaml`.

5. Recoger reports durante 48 horas:
   - Los reports se persistirán en `backend/reports/csp-reports.ndjson` dentro del pod (o donde configures el volumen). Opcionalmente enviar a un endpoint centralizado.
   - Ejecutar `node scripts/compute-csp-metrics.cjs` para obtener resumen localmente (si puedes acceder al archivo ndjson) o usar Prometheus/Grafana para chequear métricas.

6. Policy decision: si ratio < 1% durante 48h, preparar canary rollout a `enforce` con `docs/canary-rollout.md`.
