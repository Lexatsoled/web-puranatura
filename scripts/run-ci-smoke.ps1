<#
  scripts/run-ci-smoke.ps1

  Ejecuta una secuencia de comprobaciones locales tipo CI (PowerShell)
  - Instala deps (root + backend) salvo si node_modules existe y no se fuerza
  - Lint + type-check
  - Build backend
  - Arranca backend en background y espera health
  - Tests unitarios, contract, security, perf:api

  Uso: Ejecutar desde la raíz del repo en PowerShell (recomendado como Admin cuando se forzan limpiezas):
    .\scripts\run-ci-smoke.ps1 -RunE2E:$false

  Variables útiles:
    FORCE_REINSTALL=1   -> Borrar y reinstalar node_modules cuando esté presente

#>

param(
  [switch] $RunE2E
)

function ExitWith($code, $msg) {
  Write-Host $msg -ForegroundColor Red
  exit $code
}

# Helper: stop processes by name (best-effort)
function Stop-ProcessesByName([string[]] $names) {
  foreach ($n in $names) {
    try {
      $procs = Get-Process -Name $n -ErrorAction SilentlyContinue
      Write-Host "Local CI smoke finished." -ForegroundColor Green
}

Write-Host "2) Install backend deps..." -ForegroundColor Yellow
if (Test-Path -Path "backend/node_modules" -PathType Container -ErrorAction SilentlyContinue) {
  if (-not $env:FORCE_REINSTALL) {
    Write-Host "backend/node_modules ya existe -- omitiendo 'npm --prefix backend ci' (usa FORCE_REINSTALL=1 para forzar)." -ForegroundColor Yellow
  } else {
    Write-Host "FORZANDO reinstall backend: eliminando backend/node_modules y reinstalando..." -ForegroundColor Yellow
    try { Remove-Item -Path 'backend/node_modules' -Recurse -Force -ErrorAction Stop } catch { 
      Write-Host "No se pudo borrar backend/node_modules directamente: $_" -ForegroundColor Yellow
      Write-Host "Intentando reparación automática para backend/node_modules (ejecutar como Administrador si fuera necesario)..." -ForegroundColor Cyan
      try { & .\scripts\repair-node-modules.ps1 -Path 'backend/node_modules' -Force } catch { Write-Host "repair-node-modules.ps1 no pudo resolver backend/node_modules: $_" -ForegroundColor Yellow }
      try { Remove-Item -Path 'backend/node_modules' -Recurse -Force -ErrorAction Stop } catch { Write-Host "Sigue sin poder eliminar backend/node_modules después del intento de reparación: $_" -ForegroundColor Red; ExitWith 2 "No se pudo limpiar backend/node_modules" }
    }
    npm --prefix backend ci
    if ($LASTEXITCODE -ne 0) { ExitWith 2 "Backend npm ci failed" }
  }
} else {
  npm --prefix backend ci
  if ($LASTEXITCODE -ne 0) { ExitWith 2 "Backend npm ci failed" }
}

Write-Host "3) Lint + type-check..." -ForegroundColor Yellow
npm run lint
if ($LASTEXITCODE -ne 0) { 
  # Comprobar si se debe a binarios faltantes en node_modules
  $localBins = @('eslint','vite','vitest')
  $missing = @()
  foreach ($b in $localBins) {
    if (-not (Test-Path -Path (Join-Path "node_modules/.bin" $b) -PathType Leaf -ErrorAction SilentlyContinue) -and -not (Test-Path -Path (Join-Path "node_modules/.bin" ($b + '.cmd')) -PathType Leaf -ErrorAction SilentlyContinue)) {
      $missing += $b
    }
  }
  if ($missing.Count -gt 0) {
    Write-Host "ERROR: node_modules parece incompleto — faltan los bins: $($missing -join ', ')" -ForegroundColor Red
    Write-Host 'Sugerencia: cierra editores/procesos que bloqueen archivos (VSCode, herramientas de optimización), elimina node_modules y vuelve a ejecutar con FORCE_REINSTALL=1 o lanza PowerShell como Administrador para permitir eliminar ficheros bloqueados.' -ForegroundColor Yellow
    Write-Host 'Ejemplo (PowerShell):' -ForegroundColor Cyan
    Write-Host '  $env:FORCE_REINSTALL = "1"' -ForegroundColor Cyan
    Write-Host '  .\scripts\run-ci-smoke.ps1' -ForegroundColor Cyan
    ExitWith 3 "Lint failed (missing local binaries)"
  }
  ExitWith 3 "Lint failed"
}
npm run type-check
if ($LASTEXITCODE -ne 0) { ExitWith 4 "Type-check failed" }

Write-Host "4) Build backend..." -ForegroundColor Yellow
npm --prefix backend run build
if ($LASTEXITCODE -ne 0) { ExitWith 5 "Backend build failed" }

Write-Host "5) Start backend in background..." -ForegroundColor Yellow

# Comprobar si el puerto del backend está ocupado (3001)
$backendPort = 3001
function Get-PidListeningOnPort([int] $port) {
  # Intentar con Get-NetTCPConnection si está disponible
  try {
    $conn = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
    if ($conn) { return ($conn | Select-Object -ExpandProperty OwningProcess) -as [int] }
  } catch { }

  # Fallback: parsear netstat
  try {
    $lines = netstat -ano | Select-String ":$port\s+LISTENING" -SimpleMatch
    foreach ($line in $lines) {
      $parts = ($line -split '\s+') | Where-Object { $_ -ne '' }
      $pid = $parts[-1]
      if ($pid -match '^[0-9]+$') { return [int]$pid }
    }
  } catch { }
  return $null
}

$existingPid = Get-PidListeningOnPort $backendPort
if ($existingPid) {
  Write-Host "Puerto $backendPort ya utilizado por PID: $existingPid" -ForegroundColor Yellow

  # Recopilar información del proceso para decidir si detenerlo
  $proc = Get-Process -Id $existingPid -ErrorAction SilentlyContinue
  $cmdline = $null
  try { $wmi = Get-CimInstance Win32_Process -Filter "ProcessId=$existingPid" -ErrorAction SilentlyContinue; $cmdline = $wmi.CommandLine } catch { }

  if ($proc -and ($proc.ProcessName -match 'node' -or ($cmdline -and $cmdline -match 'backend'))) {
    Write-Host "Proceso identificado como node/backend. Intentando pararlo (PID $existingPid)..." -ForegroundColor Cyan
    try { Stop-Process -Id $existingPid -Force -ErrorAction Stop; Start-Sleep -Seconds 1 } catch {
      Write-Host "No se pudo detener PID ${existingPid} con Stop-Process: $_" -ForegroundColor Red
      Write-Host "Intentando taskkill /PID ${existingPid} /F /T..." -ForegroundColor Yellow
      try { & cmd /c "taskkill /PID ${existingPid} /F /T" | Out-Null; Start-Sleep -Seconds 1 } catch { Write-Host "taskkill falló para PID ${existingPid}: $_" -ForegroundColor Red; ExitWith 6 "No se puede liberar puerto $backendPort" }
    }

    # Confirmar que se liberó
    $existingPid = Get-PidListeningOnPort $backendPort
    if ($existingPid) { ExitWith 6 "El puerto $backendPort sigue en uso por PID $existingPid, abortando." }
    Write-Host "Puerto $backendPort liberado." -ForegroundColor Green
  } else {
    ExitWith 6 "El puerto $backendPort está en uso por PID $existingPid (no es un proceso node/backend o no se pudo identificar). Libera el puerto o cambia PORT antes de ejecutar." }

}

$backendProc = Start-Process -FilePath "node" -ArgumentList "backend/dist/server.js" -NoNewWindow -PassThru
Write-Host "Backend started - PID: $($backendProc.Id)"

Write-Host "Waiting for backend /api/health..." -ForegroundColor Yellow
npx wait-on http://localhost:3001/api/health --timeout 60000
if ($LASTEXITCODE -ne 0) { ExitWith 6 "Backend health check failed" }

Write-Host "6) Run tests (vitest) sequentially..." -ForegroundColor Yellow
npm run test:ci -- --maxWorkers=1 --no-file-parallelism
if ($LASTEXITCODE -ne 0) { ExitWith 7 "Tests failed" }

Write-Host "7) Run contract tests (Prism)..." -ForegroundColor Yellow
npm run test:contract
if ($LASTEXITCODE -ne 0) { ExitWith 8 "Contract tests failed" }

Write-Host "8) Run security scans (gitleaks + trivy)..." -ForegroundColor Yellow
npm run scan:security
if ($LASTEXITCODE -ne 0) { ExitWith 9 "Security scan failed" }

Write-Host "9) Run perf smoke (k6) against backend..." -ForegroundColor Yellow
npm run perf:api
if ($LASTEXITCODE -ne 0) { Write-Host "perf:api failed or skipped" -ForegroundColor Yellow }

if ($RunE2E) {
  Write-Host "10) Build & run E2E (Playwright)..." -ForegroundColor Yellow
  npm run test:e2e
  if ($LASTEXITCODE -ne 0) { ExitWith 10 "E2E tests failed" }
}

Write-Host "All done. Cleaning up backend process..." -ForegroundColor Cyan
try { Stop-Process -Id $backendProc.Id -Force } catch { }

Write-Host "Local CI smoke finished." -ForegroundColor Green
