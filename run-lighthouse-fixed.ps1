#!/usr/bin/env pwsh

# Script para ejecutar Lighthouse en modo headless
# Requiere: npm install -g lighthouse o local lighthouse

$url = $args[0] -or "http://localhost:3000"
$reportDir = ".\lighthouse-reports"
$timestamp = Get-Date -Format "yyyy-MM-dd_HHmmss"

# Crear directorio de reportes
if (-not (Test-Path $reportDir)) {
    New-Item -ItemType Directory -Path $reportDir | Out-Null
}

Write-Host "`n🚀 Iniciando análisis Lighthouse..." -ForegroundColor Cyan
Write-Host "URL: $url" -ForegroundColor Gray
Write-Host "Esta prueba toma 2-3 minutos. Por favor espera...`n" -ForegroundColor Yellow

# Ejecutar Lighthouse con CLI
$reportFile = "$reportDir\lighthouse-$timestamp"

# Usar variable de entorno para usar directorio seguro para temporales
$env:TEMP = "$reportDir\.tmp"
if (-not (Test-Path $env:TEMP)) {
    New-Item -ItemType Directory -Path $env:TEMP -Force | Out-Null
}

npx lighthouse `
    "$url" `
    --output=json `
    --output=html `
    --output-path="$reportFile" `
    --chrome-flags="--headless --no-sandbox --disable-gpu" `
    --emulated-form-factor=mobile `
    --throttling-method=simulate `
    --quiet

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Análisis completado exitosamente!" -ForegroundColor Green
    Write-Host "`n📊 Reporte HTML guardado en:" -ForegroundColor Cyan
    Write-Host "   $reportFile.html`n" -ForegroundColor White
    
    # Intentar abrir el reporte en navegador
    try {
        Start-Process "$reportFile.html"
        Write-Host "📖 Abriendo reporte en navegador..." -ForegroundColor Green
    } catch {
        Write-Host "⚠️  No se pudo abrir automáticamente. Abre manualmente: $reportFile.html" -ForegroundColor Yellow
    }
    Write-Host ""
} else {
    Write-Host "`n❌ Error ejecutando Lighthouse" -ForegroundColor Red
    Write-Host "Código de error: $LASTEXITCODE`n" -ForegroundColor Gray
    exit 1
}
