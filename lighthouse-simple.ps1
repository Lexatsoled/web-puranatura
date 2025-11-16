#!/usr/bin/env pwsh

$url = $args[0] -or "http://localhost:3000"
$reportDir = "lighthouse-reports"
$timestamp = Get-Date -Format "yyyy-MM-dd_HHmmss"

if (-not (Test-Path $reportDir)) {
    New-Item -ItemType Directory -Path $reportDir -Force | Out-Null
}

$reportFile = "$reportDir\lighthouse-$timestamp"

Write-Host "`n🚀 Iniciando análisis Lighthouse..." -ForegroundColor Cyan
Write-Host "URL: $url" -ForegroundColor Gray
Write-Host "Tiempo estimado: 2-3 minutos`n" -ForegroundColor Yellow

npx lighthouse "$url" --output=html --output=json --output-path="$reportFile" --chrome-flags="--headless --no-sandbox"

Write-Host "`n✅ Análisis completado!" -ForegroundColor Green
Write-Host "Reporte: $reportFile.html`n" -ForegroundColor Cyan

Start-Process "$reportFile.html" 2>$null
