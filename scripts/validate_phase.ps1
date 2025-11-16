# Script de Validación por Fase
# Autor: Claude Sonnet 4.5
# Uso: .\scripts\validate_phase.ps1 -Phase 0

param(
    [Parameter(Mandatory=$true)]
    [ValidateRange(0,5)]
    [int]$Phase
)

Write-Host "`n🔍 VALIDACIÓN FASE $Phase" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

$ErrorActionPreference = "Continue"
$projectRoot = "c:\Users\Usuario\Desktop\Web Puranatura\Pureza-Naturalis-V3"
Set-Location $projectRoot

$errors = 0
$warnings = 0

function Test-FileExists {
    param([string]$Path)
    if (Test-Path $Path) {
        Write-Host "  ✓ $Path" -ForegroundColor Green
        return $true
    } else {
        Write-Host "  ✗ $Path FALTA" -ForegroundColor Red
        $script:errors++
        return $false
    }
}

function Test-Command {
    param(
        [string]$Command,
        [string]$Description,
        [string]$WorkingDir = $projectRoot
    )
    Write-Host "  Ejecutando: $Description..." -ForegroundColor Gray
    Push-Location $WorkingDir
    Invoke-Expression $Command | Out-Null
    Pop-Location
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✓ $Description" -ForegroundColor Green
        return $true
    } else {
        Write-Host "  ✗ $Description FALLÓ" -ForegroundColor Red
        $script:errors++
        return $false
    }
}

# FASE 0: Setup Backend
if ($Phase -eq 0) {
    Write-Host "📋 Validando estructura básica..." -ForegroundColor Yellow
    
    Test-FileExists "backend\package.json"
    Test-FileExists "backend\tsconfig.json"
    Test-FileExists "backend\.env"
    Test-FileExists "backend\src\index.ts"
    Test-FileExists "backend\src\config\index.ts"
    Test-FileExists "backend\src\db\schema.ts"
    Test-FileExists "backend\src\db\client.ts"
    
    Write-Host "`n📦 Validando dependencias..." -ForegroundColor Yellow
    Test-FileExists "backend\node_modules"
    
    Write-Host "`n🗄️  Validando base de datos..." -ForegroundColor Yellow
    Test-FileExists "backend\database.sqlite"
    
    if (Test-Path "backend\database.sqlite") {
        # Contar productos
        $productCount = sqlite3 backend\database.sqlite "SELECT COUNT(*) FROM products;" 2>$null
        if ($productCount -eq 167) {
            Write-Host "  ✓ 167 productos en DB" -ForegroundColor Green
        } else {
            Write-Host "  ⚠️  Productos en DB: $productCount (esperado: 167)" -ForegroundColor Yellow
            $script:warnings++
        }
    }
    
    Write-Host "`n🔧 Validando compilación..." -ForegroundColor Yellow
    Test-Command "npm run type-check" "Type-check" "backend"
    
    Write-Host "`n🧪 Validando tests..." -ForegroundColor Yellow
    Test-Command "npm run test:once" "Tests unitarios" "backend"
    
    Write-Host "`n🌐 Validando servidor..." -ForegroundColor Yellow
    Write-Host "  (Omitido - requiere servidor corriendo)" -ForegroundColor Gray
}

# FASE 1: Autenticación
if ($Phase -eq 1) {
    Write-Host "📋 Validando archivos de auth..." -ForegroundColor Yellow
    
    Test-FileExists "backend\src\types\auth.ts"
    Test-FileExists "backend\src\types\validation.ts"
    Test-FileExists "backend\src\services\authService.ts"
    Test-FileExists "backend\src\middleware\auth.ts"
    Test-FileExists "backend\src\middleware\validate.ts"
    Test-FileExists "backend\src\routes\auth.ts"
    Test-FileExists "backend\tests\auth.test.ts"
    
    Write-Host "`n📋 Validando frontend..." -ForegroundColor Yellow
    Test-FileExists "src\services\apiClient.ts"
    
    # Verificar que no existan archivos obsoletos
    if (Test-Path "src\services\authService.ts") {
        Write-Host "  ⚠️  authService.ts obsoleto aún existe (debería eliminarse)" -ForegroundColor Yellow
        $script:warnings++
    }
    
    if (Test-Path "src\utils\secureStorage.ts") {
        Write-Host "  ⚠️  secureStorage.ts obsoleto aún existe" -ForegroundColor Yellow
        $script:warnings++
    }
    
    Write-Host "`n🔧 Validando compilación..." -ForegroundColor Yellow
    Test-Command "npm run type-check" "Type-check backend" "backend"
    Test-Command "npm run type-check" "Type-check frontend" "."
    
    Write-Host "`n🧪 Validando tests..." -ForegroundColor Yellow
    Test-Command "npm run test:once" "Tests backend" "backend"
    Test-Command "npm run test" "Tests frontend" "."
}

# FASE 2: Productos API
if ($Phase -eq 2) {
    Write-Host "📋 Validando archivos de productos..." -ForegroundColor Yellow
    
    Test-FileExists "backend\src\routes\products.ts"
    Test-FileExists "backend\src\services\productService.ts"
    Test-FileExists "backend\tests\products.test.ts"
    
    Write-Host "`n📋 Validando frontend..." -ForegroundColor Yellow
    
    # Verificar que productos ya no estén en bundle
    if (Test-Path "src\data\products.ts") {
        Write-Host "  ⚠️  products.ts aún existe (debería estar en backend)" -ForegroundColor Yellow
        $script:warnings++
    }
    
    Write-Host "`n📦 Validando bundle size..." -ForegroundColor Yellow
    Test-Command "npm run build" "Build frontend" "."
    
    if (Test-Path "dist\assets\js") {
        $largestBundle = Get-ChildItem "dist\assets\js\*.js" | Sort-Object Length -Descending | Select-Object -First 1
        $sizeKB = [math]::Round($largestBundle.Length / 1KB, 2)
        
        if ($sizeKB -lt 300) {
            Write-Host "  ✓ Bundle principal: $sizeKB KB (< 300KB)" -ForegroundColor Green
        } else {
            Write-Host "  ✗ Bundle principal: $sizeKB KB (> 300KB)" -ForegroundColor Red
            $script:errors++
        }
    }
    
    Write-Host "`n🧪 Validando tests E2E..." -ForegroundColor Yellow
    Write-Host "  (Omitido - requiere Playwright configurado)" -ForegroundColor Gray
}

# FASE 3: Inventario
if ($Phase -eq 3) {
    Write-Host "📋 Validando archivos de inventario..." -ForegroundColor Yellow
    
    Test-FileExists "backend\src\routes\cart.ts"
    Test-FileExists "backend\src\routes\orders.ts"
    Test-FileExists "backend\src\services\inventoryService.ts"
    Test-FileExists "backend\tests\inventory.test.ts"
    
    Write-Host "`n🔧 Validando tests de transacciones..." -ForegroundColor Yellow
    Test-Command "npm run test:once" "Tests inventario" "backend"
}

# FASE 4: Seguridad
if ($Phase -eq 4) {
    Write-Host "📋 Validando configuración de seguridad..." -ForegroundColor Yellow
    
    # Verificar que no haya secretos en frontend
    Write-Host "  Buscando secretos en frontend..." -ForegroundColor Gray
    $secretPatterns = @("JWT_SECRET", "password.*:", "secret.*:", "api.*key")
    $foundSecrets = $false
    
    foreach ($pattern in $secretPatterns) {
        $results = Select-String -Path "src\**\*.ts","src\**\*.tsx" -Pattern $pattern -SimpleMatch -ErrorAction SilentlyContinue
        if ($results) {
            Write-Host "  ⚠️  Posible secreto encontrado: $pattern" -ForegroundColor Yellow
            $script:warnings++
            $foundSecrets = $true
        }
    }
    
    if (!$foundSecrets) {
        Write-Host "  ✓ No se encontraron secretos en frontend" -ForegroundColor Green
    }
    
    Write-Host "`n🔒 Validando headers de seguridad..." -ForegroundColor Yellow
    Write-Host "  (Omitido - requiere servidor corriendo)" -ForegroundColor Gray
    
    Write-Host "`n🛡️  Validando auditoría npm..." -ForegroundColor Yellow
    Test-Command "npm audit --audit-level=high" "npm audit backend" "backend"
    Test-Command "npm audit --audit-level=high" "npm audit frontend" "."
}

# FASE 5: Deploy
if ($Phase -eq 5) {
    Write-Host "📋 Validando archivos de deploy..." -ForegroundColor Yellow
    
    Test-FileExists "Dockerfile"
    Test-FileExists "docker-compose.yml"
    Test-FileExists ".github\workflows\ci.yml"
    
    Write-Host "`n🏗️  Validando build de producción..." -ForegroundColor Yellow
    Test-Command "npm run build" "Build backend" "backend"
    Test-Command "npm run build" "Build frontend" "."
    
    Write-Host "`n📦 Validando Docker..." -ForegroundColor Yellow
    Write-Host "  (Omitido - requiere Docker instalado)" -ForegroundColor Gray
}

# Resumen
Write-Host "`n================================" -ForegroundColor Cyan
if ($errors -eq 0 -and $warnings -eq 0) {
    Write-Host "✅ FASE $Phase VALIDADA - SIN ERRORES" -ForegroundColor Green
} elseif ($errors -eq 0) {
    Write-Host "⚠️  FASE $Phase VALIDADA - $warnings WARNINGS" -ForegroundColor Yellow
} else {
    Write-Host "❌ FASE $Phase FALLÓ - $errors ERRORES, $warnings WARNINGS" -ForegroundColor Red
    exit 1
}
Write-Host "================================`n" -ForegroundColor Cyan
