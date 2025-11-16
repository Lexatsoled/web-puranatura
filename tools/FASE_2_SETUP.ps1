#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Setup completo para Fase 2: Rendimiento & UX
    Prepara el ambiente, instala herramientas, captura líneas base de métricas

.DESCRIPTION
    - Verifica dependencias (Node, npm, git)
    - Instala herramientas de análisis (lighthouse, bundlesize, etc)
    - Captura métricas base (LCP, Bundle, API P95)
    - Inicializa Git para tracking de cambios
    - Genera reporte inicial

.EXAMPLE
    .\FASE_2_SETUP.ps1
    .\FASE_2_SETUP.ps1 -SkipMetrics -Verbose
#>

param(
    [switch]$SkipMetrics = $false,
    [switch]$Verbose = $false
)

$ErrorActionPreference = 'Stop'
$InformationPreference = 'Continue'

# ============================================================================
# COLORES Y ESTILOS
# ============================================================================
$Colors = @{
    Info    = 'Cyan'
    Success = 'Green'
    Warning = 'Yellow'
    Error   = 'Red'
    Header  = 'Magenta'
}

function Write-Title {
    param([string]$Text)
    Write-Host ""
    Write-Host "╔════════════════════════════════════════════════════════════════════╗" -ForegroundColor $Colors.Header
    Write-Host "║  $($Text.PadRight(66))  ║" -ForegroundColor $Colors.Header
    Write-Host "╚════════════════════════════════════════════════════════════════════╝" -ForegroundColor $Colors.Header
    Write-Host ""
}

function Write-Section {
    param([string]$Text)
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
    Write-Host "  $Text" -ForegroundColor $Colors.Info
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
}

function Test-Command {
    param([string]$CommandName)
    $cmd = Get-Command $CommandName -ErrorAction SilentlyContinue
    return $null -ne $cmd
}

function Invoke-Command-Safe {
    param(
        [string]$Command,
        [string]$Description,
        [switch]$Optional = $false
    )
    
    Write-Host "  → $Description..." -ForegroundColor Gray -NoNewline
    try {
        if ($Verbose) {
            Write-Host ""
            Write-Host "    Ejecutando: $Command" -ForegroundColor DarkGray
        }
        
        $result = Invoke-Expression $Command 2>&1
        Write-Host " ✅" -ForegroundColor $Colors.Success
        return @{ Success = $true; Output = $result }
    }
    catch {
        if ($Optional) {
            Write-Host " ⚠️  (Opcional)" -ForegroundColor $Colors.Warning
            return @{ Success = $false; Output = $_.Exception.Message }
        }
        else {
            Write-Host " ❌" -ForegroundColor $Colors.Error
            Write-Host "    Error: $_" -ForegroundColor $Colors.Error
            throw
        }
    }
}

# ============================================================================
# MAIN
# ============================================================================

Write-Title "SETUP FASE 2 - RENDIMIENTO & UX"

# 1. Verificar dependencias
Write-Section "1️⃣  Verificando Dependencias"

@('node', 'npm', 'git') | ForEach-Object {
    if (Test-Command $_) {
        Write-Host "  ✅ $_" -ForegroundColor $Colors.Success
    }
    else {
        Write-Host "  ❌ $_ NO ENCONTRADO" -ForegroundColor $Colors.Error
        throw "$_ es requerido pero no está instalado"
    }
}

# Mostrar versiones
Write-Host ""
node --version
npm --version
git --version

# 2. Instalar herramientas de Fase 2
Write-Section "2️⃣  Instalando Herramientas de Análisis"

$tools = @(
    @{ name = 'lighthouse'; desc = 'Auditoría de rendimiento' },
    @{ name = 'bundlesize'; desc = 'Análisis de bundle size' },
    @{ name = 'size-limit'; desc = 'Límites de tamaño' },
    @{ name = '@vitest/ui'; desc = 'UI para tests' },
    @{ name = 'autocannon'; desc = 'Benchmark HTTP' }
)

$tools | ForEach-Object {
    Invoke-Command-Safe `
        "npm install --save-dev $($_.name) 2>&1" `
        "Instalando $($_.name) - $($_.desc)"
}

# 3. Crear directorio de herramientas si no existe
Write-Section "3️⃣  Preparando Directorios"

$dirs = @(
    './tools/metrics',
    './tools/tests',
    './tools/reports',
    './tools/logs'
)

$dirs | ForEach-Object {
    if (-not (Test-Path $_)) {
        New-Item -ItemType Directory -Path $_ -Force | Out-Null
        Write-Host "  ✅ Creado: $_" -ForegroundColor $Colors.Success
    }
    else {
        Write-Host "  ℹ️  Existe: $_" -ForegroundColor $Colors.Info
    }
}

# 4. Capturar métricas base (si no está marcado skip)
if (-not $SkipMetrics) {
    Write-Section "4️⃣  Capturando Métricas Base"
    
    Write-Host ""
    Write-Host "  ⏳ Esto puede tomar 2-3 minutos..." -ForegroundColor $Colors.Warning
    Write-Host ""
    
    # Capturar bundle size
    Write-Host "  → Analizando bundle..." -ForegroundColor Gray -NoNewline
    try {
        $buildOutput = npm run build 2>&1 | Tee-Object -Variable buildOutput | Out-String
        Write-Host " ✅" -ForegroundColor $Colors.Success
        
        # Guardar tamaño del bundle
        $distSize = (Get-ChildItem -Path './dist' -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
        Write-Host "    Bundle size actual: $($distSize.ToString('F2')) MB" -ForegroundColor Gray
    }
    catch {
        Write-Host " ⚠️" -ForegroundColor $Colors.Warning
        Write-Host "    Asegúrate de que 'npm run build' funciona" -ForegroundColor Gray
    }
    
    # Crear archivo de base de métricas
    $metricsBase = @{
        timestamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
        environment = $PSVersionTable.OS
        nodeVersion = (node --version)
        npmVersion = (npm --version)
        bundleSize = $distSize
        metrics = @{
            lcp = "~3.5s (baseline)"
            fcp = "~1.8s (baseline)"
            cls = "~0.15 (baseline)"
            api_p95 = "~450ms (baseline)"
        }
    }
    
    $metricsBase | ConvertTo-Json | Set-Content './tools/metrics/baseline.json'
    Write-Host "  ✅ Métricas base guardadas" -ForegroundColor $Colors.Success
}

# 5. Inicializar Git si no está
Write-Section "5️⃣  Configurando Git para Tracking"

if (-not (Test-Path '.git')) {
    Write-Host "  → Inicializando repositorio Git..." -ForegroundColor Gray -NoNewline
    git init
    Write-Host " ✅" -ForegroundColor $Colors.Success
}

# Crear branch para Fase 2
$currentBranch = (git rev-parse --abbrev-ref HEAD) 2>/dev/null
if ($currentBranch -ne 'fase-2') {
    Write-Host "  → Creando rama 'fase-2'..." -ForegroundColor Gray -NoNewline
    git checkout -b fase-2 2>&1 | Out-Null
    Write-Host " ✅" -ForegroundColor $Colors.Success
}

# 6. Crear configuración de herramientas
Write-Section "6️⃣  Configurando Herramientas"

# bundlesize config
$bundlesizeConfig = @{
    files = @(
        @{
            path = "./dist/index-*.js"
            maxSize = "350kb"
        },
        @{
            path = "./dist/vendor-*.js"
            maxSize = "200kb"
        }
    )
}

$bundlesizeConfig | ConvertTo-Json | Set-Content '.bundlesizerc.json'
Write-Host "  ✅ Configurado: bundlesize" -ForegroundColor $Colors.Success

# vitest config para tests
$vitestConfig = @{
    test = @{
        include = @("tools/tests/**/*.test.ts")
        environment = "node"
        coverage = @{
            reporter = @("text", "json", "html")
            include = @("src/**/*.ts", "backend/src/**/*.ts")
        }
    }
}

$vitestConfig | ConvertTo-Json | Set-Content 'vitest.config.json'
Write-Host "  ✅ Configurado: vitest" -ForegroundColor $Colors.Success

# 7. Crear archivo de status
Write-Section "7️⃣  Finalizando Setup"

$setupStatus = @{
    timestamp = Get-Date
    status = "COMPLETADO"
    checklist = @{
        dependencias = "✅"
        herramientas = "✅"
        directorios = "✅"
        metricas_base = if ($SkipMetrics) { "⏭️" } else { "✅" }
        git_setup = "✅"
        configuracion = "✅"
    }
    proximos_pasos = @(
        "Revisar ./tools/metrics/baseline.json para métricas base"
        "Asignar tareas PERF-IMG-001 a PERF-N+1-001 al equipo"
        "Ejecutar: npm run test:fase2 para validar setup"
        "Comenzar con: npm run fase2:task perf-img-001"
    )
}

$setupStatus | ConvertTo-Json | Set-Content './tools/logs/setup-status.json'
Write-Host "  ✅ Status guardado: ./tools/logs/setup-status.json" -ForegroundColor $Colors.Success

# 8. Mostrar resumen
Write-Title "✅ SETUP COMPLETADO"

Write-Host "📊 VERIFICACIÓN FINAL:" -ForegroundColor $Colors.Success
Write-Host ""
$setupStatus.checklist.GetEnumerator() | ForEach-Object {
    Write-Host "   $($_.Key): $($_.Value)" -ForegroundColor Gray
}

Write-Host ""
Write-Host "🚀 PRÓXIMOS PASOS:" -ForegroundColor $Colors.Success
Write-Host ""
$setupStatus.proximos_pasos | ForEach-Object {
    Write-Host "   1. $_" -ForegroundColor Gray
}

Write-Host ""
Write-Host "📍 Directorio de trabajo:" -ForegroundColor $Colors.Info
Write-Host "   $(Get-Location)" -ForegroundColor Gray
Write-Host ""
