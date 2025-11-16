# Script de Setup del Backend
# Autor: Claude Sonnet 4.5
# Uso: .\scripts\setup_backend.ps1

param(
    [switch]$SkipInstall
)

Write-Host "`n🚀 SETUP BACKEND - FASE 0" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

$ErrorActionPreference = "Stop"
$projectRoot = "c:\Users\Usuario\Desktop\Web Puranatura\Pureza-Naturalis-V3"

# Navegar a raíz del proyecto
Set-Location $projectRoot

# PASO 1: Crear estructura de carpetas
Write-Host "📁 Creando estructura de carpetas..." -ForegroundColor Yellow

$folders = @(
    "backend\src\config",
    "backend\src\db\migrations",
    "backend\src\routes",
    "backend\src\middleware",
    "backend\src\services",
    "backend\src\types",
    "backend\tests"
)

foreach ($folder in $folders) {
    if (!(Test-Path $folder)) {
        New-Item -ItemType Directory -Force -Path $folder | Out-Null
        Write-Host "  ✓ Creado: $folder" -ForegroundColor Green
    } else {
        Write-Host "  ✓ Existe: $folder" -ForegroundColor Gray
    }
}

# PASO 2: Copiar templates
Write-Host "`n📋 Copiando templates..." -ForegroundColor Yellow

$templates = @{
    "templates\backend\package.json" = "backend\package.json"
    "templates\backend\tsconfig.json" = "backend\tsconfig.json"
    "templates\backend\.env.example" = "backend\.env"
}

foreach ($src in $templates.Keys) {
    $dest = $templates[$src]
    if (Test-Path $src) {
        Copy-Item $src $dest -Force
        Write-Host "  ✓ Copiado: $dest" -ForegroundColor Green
    } else {
        Write-Host "  ✗ Template no encontrado: $src" -ForegroundColor Red
        exit 1
    }
}

# PASO 3: Instalar dependencias (si no se omitió)
if (!$SkipInstall) {
    Write-Host "`n📦 Instalando dependencias..." -ForegroundColor Yellow
    Set-Location "backend"
    
    Write-Host "  Ejecutando npm install..." -ForegroundColor Gray
    npm install
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  ✗ Error al instalar dependencias" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "  ✓ Dependencias instaladas" -ForegroundColor Green
    Set-Location ..
} else {
    Write-Host "`n⏭️  Instalación de dependencias omitida" -ForegroundColor Gray
}

# PASO 4: Verificar Node.js y npm
Write-Host "`n🔍 Verificando entorno..." -ForegroundColor Yellow

$nodeVersion = node --version
$npmVersion = npm --version

Write-Host "  Node.js: $nodeVersion" -ForegroundColor Gray
Write-Host "  npm: $npmVersion" -ForegroundColor Gray

if ($nodeVersion -notmatch "v2[0-9]") {
    Write-Host "  ⚠️  Se recomienda Node.js 20+" -ForegroundColor Yellow
}

# PASO 5: Validar estructura
Write-Host "`n✅ Validando estructura..." -ForegroundColor Yellow

$requiredFiles = @(
    "backend\package.json",
    "backend\tsconfig.json",
    "backend\.env"
)

$allValid = $true
foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "  ✓ $file" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $file FALTA" -ForegroundColor Red
        $allValid = $false
    }
}

if (!$allValid) {
    Write-Host "`n❌ Setup incompleto" -ForegroundColor Red
    exit 1
}

# Resumen
Write-Host "`n================================" -ForegroundColor Cyan
Write-Host "✅ SETUP COMPLETADO" -ForegroundColor Green
Write-Host "================================`n" -ForegroundColor Cyan

Write-Host "Próximos pasos:" -ForegroundColor Yellow
Write-Host "  1. Implementar archivos según templates/" -ForegroundColor Gray
Write-Host "  2. Ejecutar: cd backend && npm run db:generate" -ForegroundColor Gray
Write-Host "  3. Ejecutar: npm run db:migrate" -ForegroundColor Gray
Write-Host "  4. Ejecutar: npm run db:seed" -ForegroundColor Gray
Write-Host "  5. Ejecutar: npm run dev" -ForegroundColor Gray
Write-Host "  6. Validar: .\scripts\validate_phase.ps1 -Phase 0`n" -ForegroundColor Gray
