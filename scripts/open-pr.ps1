<#
PowerShell helper to create a branch, run tests, commit, push and open a PR using GitHub CLI.

USAGE:
  - Edit variables at the top as needed.
  - Run in a PowerShell session from the repo root.

EXAMPLE:
  ./scripts/open-pr.ps1 -Branch feat/staging-csp-monitor -Remote origin
#>

param(
    [string]$Branch = "feat/staging-csp-monitor",
    [string]$Remote = "origin",
    [string]$Base = "main",
    [string]$Title = "feat(staging): CSP report-only ingest + monitoring",
    [string]$BodyPath = "docs/pr-templates/csp-staging.md"
)

Write-Host "--- Preparando PR: $Branch -> $Base ---" -ForegroundColor Cyan

# Ensure git is available
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Error "git no está disponible en PATH. Instala Git primero."; exit 1
}

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    Write-Warning "gh (GitHub CLI) no encontrado. Puedes crear la PR con 'gh pr create' tras el push manualmente.";
}

# 1) Check working tree
$status = git status --porcelain
if ($status) {
    Write-Error "Tu working tree no está limpio. Haz commit o stash antes de ejecutar este script.`nSalida de git status:`n$status"; exit 1
}

Write-Host "Ejecutando tests (esto puede tardar)..." -ForegroundColor Yellow
npm run test:ci -s
$testsExit = $LASTEXITCODE
if ($testsExit -ne 0) {
    Write-Error "Los tests fallaron (exit $testsExit). Arregla los tests antes de crear la PR."; exit $testsExit
}

# 2) Create branch
git checkout -b $Branch

# 3) Stage changes (only if there are unstaged changes) — we won't assume there are edits.
git add -A

git commit -m "feat(csp): add staging deploy + Prometheus scrape + monitoring rules"
$commitExit = $LASTEXITCODE
if ($commitExit -ne 0) {
    Write-Host "No hay cambios para commitear (skip commit)."
}

# 4) Push branch
git push -u $Remote HEAD

if (Get-Command gh -ErrorAction SilentlyContinue) {
    # Read PR body from file if present
    $body = "$(Get-Content -Raw $BodyPath -ErrorAction SilentlyContinue)"
    if (-not $body) { $body = "Add CSP ingest + staging infra + Prometheus scrapes + Grafana alerting & 48h monitoring plan." }

    gh pr create --title $Title --body "$body" --base $Base
    $ghExit = $LASTEXITCODE
    if ($ghExit -ne 0) {
        Write-Warning "No se pudo crear PR con gh. Comprueba que estás autenticado y que gh tiene permisos.";
    } else {
        Write-Host "PR creada. Revisa en GitHub." -ForegroundColor Green
    }
} else {
    Write-Host "Branch subido. Ejecuta manualmente: gh pr create --title \"$Title\" --body-file $BodyPath --base $Base" -ForegroundColor Cyan
}

Write-Host "Listo. Si quieres, pega aquí la salida y te ayudo con los siguientes pasos." -ForegroundColor Green
