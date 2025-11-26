#!/usr/bin/env pwsh
# Collect observability metrics (CI helper)
# This is a lightweight no-op script used by CI to avoid failing when
# the environment has no specialized collector. It intentionally exits 0.

Write-Host "[collect-metrics.ps1] Running CI helper — collecting metrics (no-op)."
Write-Host "[collect-metrics.ps1] If you want to enable real collection, add steps here."
exit 0
