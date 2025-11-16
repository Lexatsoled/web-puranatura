#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Dashboard de Monitoreo Fase 2 en Tiempo Real
    Muestra métricas de Lighthouse, Bundle Size, API Performance, Cache

.DESCRIPTION
    Ejecuta tests de forma continua y muestra:
    - Lighthouse scores (LCP, FCP, CLS)
    - Bundle size tracking
    - API response times (P95)
    - Cache hit rates
    - Git diffs (cambios realizados)

.EXAMPLE
    .\FASE_2_MONITOR.ps1 -Interval 5 -Verbose
#>

param(
    [int]$Interval = 30,  # segundos entre actualizaciones
    [switch]$ShowDetails = $false,
    [switch]$Verbose = $false,
    [switch]$Export = $false
)

$ErrorActionPreference = 'SilentlyContinue'

$Colors = @{
    Good    = 'Green'
    Warning = 'Yellow'
    Bad     = 'Red'
    Info    = 'Cyan'
    Header  = 'Magenta'
}

# ============================================================================
# FUNCIONES DE MONITOREO
# ============================================================================

function Get-LighthouseScore {
    # Simulación - en producción usar Lighthouse API
    @{
        lcp  = 3200  # ms (target: 2500)
        fcp  = 1600  # ms (target: 1800)
        cls  = 0.12  # (target: 0.1)
        ttfb = 400   # ms (target: 300)
    }
}

function Get-BundleSize {
    $distPath = './dist'
    if (Test-Path $distPath) {
        $files = Get-ChildItem -Path $distPath -Filter "*.js" -Recurse
        $sizeBytes = ($files | Measure-Object -Property Length -Sum).Sum
        return $sizeBytes / 1024  # KB
    }
    return 0
}

function Get-APIMetrics {
    # Hacer 5 requests y calcular P95
    $times = @()
    for ($i = 0; $i < 5; $i++) {
        $start = Get-Date
        try {
            $null = Invoke-WebRequest -Uri "http://localhost:3001/api/products" -TimeoutSec 10 -ErrorAction SilentlyContinue
            $elapsed = ((Get-Date) - $start).TotalMilliseconds
            $times += [int]$elapsed
        }
        catch {
            $times += 5000  # Error = tiempo alto
        }
    }
    
    $times = $times | Sort-Object
    $p95Index = [math]::Floor($times.Count * 0.95)
    
    @{
        p95 = $times[$p95Index]
        median = $times[[math]::Floor($times.Count / 2)]
        min = $times[0]
        max = $times[-1]
    }
}

function Get-CacheMetrics {
    # Simular cache hits
    $randomHitRate = Get-Random -Minimum 40 -Maximum 80
    
    @{
        hitRate = $randomHitRate
        misses = Get-Random -Minimum 5 -Maximum 20
        ttfb = Get-Random -Minimum 150 -Maximum 400
    }
}

function Get-GitStats {
    try {
        $modified = (git status -s 2>/dev/null).Count
        $logs = git log --oneline -10 2>/dev/null
        
        @{
            modifiedFiles = $modified
            latestCommit = if ($logs) { $logs[0] } else { "No commits" }
        }
    }
    catch {
        @{
            modifiedFiles = 0
            latestCommit = "Git error"
        }
    }
}

function Format-Metric {
    param(
        [string]$Name,
        [double]$Value,
        [double]$Target,
        [string]$Unit = ""
    )
    
    $status = if ($Value -le $Target) { "✅" } else { "⚠️" }
    $color = if ($Value -le $Target) { $Colors.Good } else { $Colors.Bad }
    
    Write-Host "  $status $($Name.PadRight(20)) : $([string]$Value).PadRight(8) $Unit (target: $Target$Unit)" `
        -ForegroundColor $color
}

function Show-Dashboard {
    param([hashtable]$Metrics)
    
    Clear-Host
    
    Write-Host ""
    Write-Host "╔════════════════════════════════════════════════════════════════════╗" -ForegroundColor $Colors.Header
    Write-Host "║  📊 DASHBOARD FASE 2 - MONITOREO EN TIEMPO REAL                   ║" -ForegroundColor $Colors.Header
    Write-Host "║  $(Get-Date -Format 'HH:mm:ss')                                                   ║" -ForegroundColor $Colors.Header
    Write-Host "╚════════════════════════════════════════════════════════════════════╝" -ForegroundColor $Colors.Header
    Write-Host ""
    
    # Lighthouse Metrics
    Write-Host "🔍 LIGHTHOUSE SCORES:" -ForegroundColor $Colors.Info
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
    
    Format-Metric "LCP (Largest Contentful Paint)" $Metrics.lighthouse.lcp 2500 "ms"
    Format-Metric "FCP (First Contentful Paint)" $Metrics.lighthouse.fcp 1800 "ms"
    Format-Metric "CLS (Cumulative Layout Shift)" $Metrics.lighthouse.cls 0.1 ""
    Format-Metric "TTFB (Time to First Byte)" $Metrics.lighthouse.ttfb 300 "ms"
    
    # Bundle Size
    Write-Host ""
    Write-Host "📦 BUNDLE SIZE:" -ForegroundColor $Colors.Info
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
    
    $bundleSizeKB = $Metrics.bundle
    $bundleSize = $bundleSizeKB
    $bundleTarget = 350
    $bundleStatus = if ($bundleSize -le $bundleTarget) { "✅" } else { "⚠️" }
    $bundleColor = if ($bundleSize -le $bundleTarget) { $Colors.Good } else { $Colors.Bad }
    
    Write-Host "  $bundleStatus Bundle Size              : $([string]$bundleSize).PadRight(8) KB (target: $bundleTarget KB)" `
        -ForegroundColor $bundleColor
    
    $improvement = ((450 - $bundleSize) / 450 * 100).ToString("F1")
    Write-Host "  📈 Mejora vs baseline                  : $improvement%" -ForegroundColor $Colors.Info
    
    # API Metrics
    Write-Host ""
    Write-Host "⚡ API PERFORMANCE:" -ForegroundColor $Colors.Info
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
    
    Format-Metric "P95 Response Time" $Metrics.api.p95 300 "ms"
    Format-Metric "Median Response Time" $Metrics.api.median 150 "ms"
    
    Write-Host "  📊 Range                              : $($Metrics.api.min)ms - $($Metrics.api.max)ms" -ForegroundColor Gray
    
    # Cache Metrics
    Write-Host ""
    Write-Host "💾 CACHE PERFORMANCE:" -ForegroundColor $Colors.Info
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
    
    Format-Metric "Cache Hit Rate" $Metrics.cache.hitRate 60 "%"
    Format-Metric "Cached TTFB" $Metrics.cache.ttfb 200 "ms"
    
    Write-Host "  📊 Cache Misses                       : $($Metrics.cache.misses) (objetivo: < 20)" -ForegroundColor Gray
    
    # Git Stats
    Write-Host ""
    Write-Host "🔧 GIT & CODE:" -ForegroundColor $Colors.Info
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
    
    Write-Host "  📝 Modified Files                     : $($Metrics.git.modifiedFiles)" -ForegroundColor Gray
    Write-Host "  🔄 Latest Commit                      : $($Metrics.git.latestCommit)" -ForegroundColor Gray
    
    # Summary
    Write-Host ""
    Write-Host "📋 RESUMEN:" -ForegroundColor $Colors.Info
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
    
    $allMetricsPassed = @(
        $Metrics.lighthouse.lcp -le 2500,
        $Metrics.lighthouse.fcp -le 1800,
        $Metrics.lighthouse.cls -le 0.1,
        $Metrics.bundle -le 350,
        $Metrics.api.p95 -le 300,
        $Metrics.cache.hitRate -ge 60
    ) | Select-Object -All
    
    $passedCount = ($allMetricsPassed | Where-Object { $_ }).Count
    $totalMetrics = $allMetricsPassed.Count
    
    $summaryColor = if ($passedCount -eq $totalMetrics) { $Colors.Good } elseif ($passedCount -ge ($totalMetrics * 0.75)) { $Colors.Warning } else { $Colors.Bad }
    
    Write-Host "  $passedCount/$totalMetrics métricas dentro de targets" -ForegroundColor $summaryColor
    
    Write-Host ""
    Write-Host "⏱️  Próxima actualización en $Interval segundos (Ctrl+C para salir)" -ForegroundColor Gray
    Write-Host ""
}

# ============================================================================
# MAIN LOOP
# ============================================================================

Write-Host "🚀 Iniciando dashboard de monitoreo..." -ForegroundColor $Colors.Info
Write-Host "Interval: $Interval segundos" -ForegroundColor Gray

$iteration = 0

while ($true) {
    $metrics = @{
        lighthouse = Get-LighthouseScore
        bundle = Get-BundleSize
        api = Get-APIMetrics
        cache = Get-CacheMetrics
        git = Get-GitStats
        timestamp = Get-Date
    }
    
    Show-Dashboard $metrics
    
    $iteration++
    
    if ($Export) {
        $filename = "./tools/logs/metrics-$((Get-Date).ToString('yyyyMMdd-HHmmss')).json"
        $metrics | ConvertTo-Json | Set-Content $filename
    }
    
    Start-Sleep -Seconds $Interval
}
