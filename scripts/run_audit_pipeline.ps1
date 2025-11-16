<#
Script: run_audit_pipeline.ps1
Propósito: ejecutar pipeline local de validación: type-check, unit tests, e2e test (playwright) y Lighthouse.
Uso: powershell -ExecutionPolicy Bypass -File .\scripts\run_audit_pipeline.ps1
#>
param(
    [string]$BaseUrl = 'http://localhost:3000',
    [int]$ProductId = 487
)

Write-Host "[audit] Iniciando pipeline de auditoría: $(Get-Date -Format o)"

# 1) Type check
Write-Host "[audit] Ejecutando TypeScript type-check..."
npm run type-check
if ($LASTEXITCODE -ne 0) { Write-Error "Type-check failed"; exit 1 }

# 2) Unit tests (vitest)
Write-Host "[audit] Ejecutando unit tests (vitest)..."
npx vitest run --run
if ($LASTEXITCODE -ne 0) { Write-Error "Unit tests failed"; exit 1 }

# 3) Levantar dev server en background (usar npm run dev que preferiblemente usa Vite)
Write-Host "[audit] Levantando dev server (npm run dev)";
Start-Process -NoNewWindow -FilePath "npm" -ArgumentList "run dev";
Write-Host "[audit] Esperando 6s para que el servidor arranque..."
Start-Sleep -Seconds 6

# 4) Ejecutar Playwright e2e tests
Write-Host "[audit] Ejecutando Playwright tests..."
npx playwright test --config=playwright.config.ts
$pwExit = $LASTEXITCODE
if ($pwExit -ne 0) { Write-Warning "Playwright returned non-zero exit code: $pwExit" }

# 5) Lighthouse (requiere chrome instalado y lighthouse-ci o lighthouse cli)
Write-Host "[audit] Ejecutando Lighthouse para producto $ProductId..."
if (-not (Get-Command -Name "lighthouse" -ErrorAction SilentlyContinue)) {
    Write-Warning "lighthouse CLI no encontrado. Instala con 'npm i -g lighthouse' si quieres ejecutar esta fase."
} else {
    lighthouse "$BaseUrl/tienda/producto/$ProductId" --output html --output-path "reports/lighthouse/product-$ProductId-$(Get-Date -Format yyyyMMdd_HHmm).html"
}

Write-Host "[audit] Pipeline finalizado. Revisa reports/ y los logs arriba."