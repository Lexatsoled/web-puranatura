#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Script de Validación Post-Auditoría - Pureza Naturalis V3
.DESCRIPTION
    Verifica que todos los fixes de Fase 1 estén correctamente aplicados.
    Ejecuta: .\validate-audits.ps1 -ProjectPath "C:\Users\Usuario\Desktop\Web Puranatura\Pureza-Naturalis-V3"
#>

param(
    [string]$ProjectPath = (Get-Location).Path
)

$ErrorActionPreference = "Stop"
$ValidationResults = @()

function Write-CheckResult($testName, $passed, $details = "") {
    $icon = if ($passed) { "✅" } else { "❌" }
    $status = if ($passed) { "PASS" } else { "FAIL" }
    $color = if ($passed) { "Green" } else { "Red" }
    
    Write-Host "$icon [$status] $testName" -ForegroundColor $color
    if ($details) { Write-Host "    └─ $details" -ForegroundColor Gray }
    
    $ValidationResults += @{
        Name = $testName
        Status = $status
        Details = $details
    }
}

function Test-CspInHtml {
    Write-Host "`n📋 [TEST 1/7] Validando CSP en index.html..." -ForegroundColor Cyan
    
    $htmlPath = Join-Path $ProjectPath "index.html"
    if (-not (Test-Path $htmlPath)) {
        Write-CheckResult "CSP Meta Tag" $false "index.html no encontrado en $ProjectPath"
        return
    }
    
    $content = Get-Content $htmlPath -Raw
    $hasCsp = $content -match "Content-Security-Policy"
    $hasImgSrc = $content -match "img-src"
    $hasScriptSrc = $content -match "script-src"
    
    $passed = $hasCsp -and $hasImgSrc -and $hasScriptSrc
    Write-CheckResult "CSP Meta Tag en HTML" $passed "Directivas encontradas: img-src=$($hasImgSrc), script-src=$($hasScriptSrc)"
}

function Test-SecurityHeaders {
    Write-Host "`n📋 [TEST 2/7] Validando Security Headers en backend..." -ForegroundColor Cyan
    
    $securityHeadersPath = Join-Path $ProjectPath "backend/src/plugins/securityHeaders.ts"
    if (-not (Test-Path $securityHeadersPath)) {
        Write-CheckResult "Security Headers Plugin" $false "Archivo no encontrado: $securityHeadersPath"
        return
    }
    
    $content = Get-Content $securityHeadersPath -Raw
    $tests = @{
        "X-Frame-Options" = $content -match "X-Frame-Options"
        "X-Content-Type-Options" = $content -match "X-Content-Type-Options"
        "Strict-Transport-Security" = $content -match "Strict-Transport-Security"
    }
    
    $allPassed = $tests.Values | Where-Object { $_ -eq $false } | Measure-Object | Select-Object -ExpandProperty Count
    $passed = $allPassed -eq 0
    
    Write-CheckResult "Security Headers" $passed "Headers configurados: $($tests.Count)"
}

function Test-SeedPassword {
    Write-Host "`n📋 [TEST 3/7] Validando Seed Password Segura..." -ForegroundColor Cyan
    
    $seedPath = Join-Path $ProjectPath "backend/src/db/seed.ts"
    if (-not (Test-Path $seedPath)) {
        Write-CheckResult "Seed Password" $false "Archivo no encontrado: $seedPath"
        return
    }
    
    $content = Get-Content $seedPath -Raw
    
    # Verificar que NO tiene hardcoded 'test123'
    $hasWeakPassword = $content -match "password_hash:.*['\"]test123['\"]"
    $hasRandomPassword = $content -match "randomBytes|crypto\.randomBytes" -and $content -match "toString\(['\"]hex['\"]"
    
    $passed = (-not $hasWeakPassword) -and $hasRandomPassword
    Write-CheckResult "Seed Password Segura" $passed "Random generation: $($hasRandomPassword), No hardcoded: $(-not $hasWeakPassword)"
}

function Test-ImageZoomImport {
    Write-Host "`n📋 [TEST 4/7] Validando ImageZoom.tsx Import..." -ForegroundColor Cyan
    
    $imageZoomPath = Join-Path $ProjectPath "src/components/ImageZoom.tsx"
    if (-not (Test-Path $imageZoomPath)) {
        Write-CheckResult "ImageZoom Import" $false "Archivo no encontrado: $imageZoomPath"
        return
    }
    
    $content = Get-Content $imageZoomPath -Raw
    
    # Verificar que la primera línea sea un import correcto
    $firstLines = ($content -split "`n")[0..3] -join "`n"
    $hasCorrectImport = $firstLines -match "^import React" -and -not ($firstLines -match "//.*Timport")
    
    $passed = $hasCorrectImport
    Write-CheckResult "ImageZoom Import Fix" $passed "Import statement válido en línea 1"
}

function Test-CacheBusting {
    Write-Host "`n📋 [TEST 5/7] Validando Cache-Busting en ImageZoom..." -ForegroundColor Cyan
    
    $imageZoomPath = Join-Path $ProjectPath "src/components/ImageZoom.tsx"
    if (-not (Test-Path $imageZoomPath)) {
        Write-CheckResult "Cache-Busting" $false "Archivo no encontrado: $imageZoomPath"
        return
    }
    
    $content = Get-Content $imageZoomPath -Raw
    
    # Verificar que tenga APP_VERSION = Date.now() en nivel de módulo (no en render)
    $hasAppVersion = $content -match "const APP_VERSION = Date\.now\(\)"
    $hasVersionUsage = $content -match "\?v=\$\{APP_VERSION\}"
    
    $passed = $hasAppVersion -and $hasVersionUsage
    Write-CheckResult "Cache-Busting Implementation" $passed "Session-wide timestamp: $($hasAppVersion), Query param usage: $($hasVersionUsage)"
}

function Test-DomPurify {
    Write-Host "`n📋 [TEST 6/7] Validando DOMPurify Sanitization..." -ForegroundColor Cyan
    
    $productPagePath = Join-Path $ProjectPath "src/pages/ProductPage.tsx"
    if (-not (Test-Path $productPagePath)) {
        Write-CheckResult "DOMPurify" $false "Archivo no encontrado: $productPagePath"
        return
    }
    
    $content = Get-Content $productPagePath -Raw
    
    $hasDomPurify = $content -match "import.*DOMPurify" -or $content -match "from.*dompurify"
    $hasUsage = $content -match "DOMPurify\.sanitize"
    
    $passed = $hasDomPurify -and $hasUsage
    Write-CheckResult "DOMPurify XSS Protection" $passed "Import: $($hasDomPurify), Usage: $($hasUsage)"
}

function Test-DependencyVulnerabilities {
    Write-Host "`n📋 [TEST 7/7] Validando Dependencias Seguras..." -ForegroundColor Cyan
    
    $packageJsonPath = Join-Path $ProjectPath "package.json"
    if (-not (Test-Path $packageJsonPath)) {
        Write-CheckResult "Dependencies Scan" $false "package.json no encontrado"
        return
    }
    
    try {
        $json = Get-Content $packageJsonPath | ConvertFrom-Json
        
        # Verificar versiones críticas
        $reactVersion = $json.dependencies.react
        $zod = $json.dependencies.zod
        $dompurify = $json.dependencies.dompurify
        
        $hasReact = $reactVersion -match "^18\."
        $hasZod = $zod -match "^3\."
        $hasDomPurify = $dompurify -match "^3\."
        
        $passed = $hasReact -and $hasZod -and $hasDomPurify
        Write-CheckResult "Dependency Versions" $passed "React: $reactVersion, Zod: $zod, DOMPurify: $dompurify"
    }
    catch {
        Write-CheckResult "Dependency Versions" $false "Error parsing package.json: $_"
    }
}

function Generate-Report {
    Write-Host "`n" + ("=" * 60) -ForegroundColor Yellow
    Write-Host "📊 REPORTE FINAL DE VALIDACIÓN" -ForegroundColor Yellow
    Write-Host ("=" * 60) -ForegroundColor Yellow
    
    $passed = ($ValidationResults | Where-Object { $_.Status -eq "PASS" } | Measure-Object).Count
    $failed = ($ValidationResults | Where-Object { $_.Status -eq "FAIL" } | Measure-Object).Count
    $total = $ValidationResults.Count
    $percentage = [Math]::Round(($passed / $total) * 100, 2)
    
    Write-Host "`n✅ Pruebas Pasadas: $passed/$total ($percentage%)" -ForegroundColor Green
    
    if ($failed -gt 0) {
        Write-Host "❌ Pruebas Fallidas: $failed" -ForegroundColor Red
        Write-Host "`n⚠️  HALLAZGOS:" -ForegroundColor Red
        $ValidationResults | Where-Object { $_.Status -eq "FAIL" } | ForEach-Object {
            Write-Host "   • $($_.Name)" -ForegroundColor Red
            Write-Host "     └─ $($_.Details)" -ForegroundColor Gray
        }
    }
    else {
        Write-Host "`n🎉 TODAS LAS PRUEBAS PASARON - LISTO PARA PRODUCCIÓN" -ForegroundColor Green
    }
    
    Write-Host "`n" + ("=" * 60) -ForegroundColor Yellow
    
    return $failed -eq 0
}

# Main execution
Write-Host "🔍 VALIDACIÓN POST-AUDITORÍA - Pureza Naturalis V3" -ForegroundColor Magenta
Write-Host "Proyecto: $ProjectPath" -ForegroundColor Magenta
Write-Host "Timestamp: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Magenta
Write-Host ""

Test-CspInHtml
Test-SecurityHeaders
Test-SeedPassword
Test-ImageZoomImport
Test-CacheBusting
Test-DomPurify
Test-DependencyVulnerabilities

$allPassed = Generate-Report

# Exit code
exit $(if ($allPassed) { 0 } else { 1 })
