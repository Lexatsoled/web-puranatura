<# 
. Scrip corto para preparar gate perf: 
- Detiene cualquier backend que esté usando backend/dist/server.js (evita lock en dev.db)
- Aplica migraciones y seed sobre backend/prisma/dev.db
- Arranca el backend con la misma URL en una ventana nueva (mantener activo)
- Ejecuta npm run perf:api para generar artefactos
#
# Uso: desde la raíz del repo
#   pwsh ./scripts/setup-perf-gate.ps1
#>

Set-StrictMode -Version Latest
Clear-Host

$repoRoot = Resolve-Path .
$backendDir = Join-Path $repoRoot 'backend'
$devDbUrl = 'file:./backend/prisma/dev.db'

Write-Host "Repo base: $repoRoot" -ForegroundColor Cyan
Write-Host "Backend dir: $backendDir" -ForegroundColor Cyan

function Stop-BackendProcesses {
    $filter = "CommandLine LIKE '%dist/server.js%'"
    $matches = Get-CimInstance Win32_Process -Filter $filter -ErrorAction SilentlyContinue
    if (-not $matches) {
        Write-Host 'No hay servidores backend ejecutándose.' -ForegroundColor Green
        return
    }

    Write-Host "Deteniendo procesos backend activos..." -ForegroundColor Yellow
    $matches | ForEach-Object {
        try {
            Stop-Process -Id $_.ProcessId -Force -ErrorAction Stop
            Write-Host "Servidor detenido (PID $($_.ProcessId))."
        } catch {
            Write-Warning "No se pudo detener PID $($_.ProcessId): $_"
        }
    }
}

Stop-BackendProcesses

Write-Host "Construyendo backend..." -ForegroundColor Cyan
npm --prefix $backendDir run build
Write-Host "Aplicando migraciones..." -ForegroundColor Cyan
pushd $repoRoot | Out-Null
npx cross-env-shell "DATABASE_URL=$devDbUrl" "npx prisma migrate deploy --schema=backend/prisma/schema.prisma"

Write-Host "Ejecutando seed..." -ForegroundColor Cyan
npx cross-env-shell "DATABASE_URL=$devDbUrl" "node backend/prisma/seed.js"
popd | Out-Null

Write-Host "Arrancando backend en segunda ventana..." -ForegroundColor Magenta
$backendCmd = "cd `"$backendDir`"; npx cross-env-shell `"DATABASE_URL=$devDbUrl`" `"node dist/server.js`""
Start-Process powershell -ArgumentList '-NoExit', '-Command', $backendCmd

Write-Host "Esperando 3 segundos para que el backend inicie..." -ForegroundColor DarkGray
Start-Sleep -Seconds 3

Write-Host "Lanzando gate perf: npm run perf:api" -ForegroundColor Cyan
npm run perf:api

Write-Host "Cuando el gate termine revisa reports/observability/*.md y metrics-dashboard.md" -ForegroundColor Green
Write-Host "El backend quedará abierto en la nueva ventana. Ciérralo cuando ya no lo necesites." -ForegroundColor Gray
