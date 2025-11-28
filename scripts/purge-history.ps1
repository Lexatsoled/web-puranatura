<#
PowerShell helper to perform a safe, auditable, destructive purge of sensitive files from git history

USAGE (run locally on a machine with git + python installed):
  1) Review and rotate secrets first (see README below).
  2) Run this script to create a mirror, run git-filter-repo and produce verification reports.
  3) Only after manual verification, answer the final prompt to push --force to origin.

This script DOES NOT push by default. It requires a confirmation step.
#>

param(
  [string]$RepoUrl = $(git config --get remote.origin.url),
  [string]$MirrorDir = "$(Join-Path $env:TEMP 'purge-repo-mirror')",
  [switch]$DryRun
)

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  Write-Error 'git is required. Install git and re-run.'
  exit 1
}

if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
  Write-Error 'python is required (git-filter-repo is a python tool). Install python and re-run.'
  exit 1
}

# Recommended sensitive paths to remove. Edit this list to add any other paths to purge.
$pathsToPurge = @(
  '.env',
  '.env.local',
  'backend/.env',
  'backend/backups',
  'backend/*.sqlite',
  'backend/*sqlite*',
  'backend/database.sqlite.backup',
  'backend/database.legacy-before-bff.sqlite',
  'backend/out.log',
  'backend/logs'
)

Write-Host 'Repository URL:' $RepoUrl
Write-Host 'Mirror working directory:' $MirrorDir

if (Test-Path $MirrorDir) {
  Write-Host "Cleaning existing mirror dir: $MirrorDir"
  Remove-Item -Recurse -Force $MirrorDir
}

Write-Host 'Creating a bare mirror clone (this is safe) ...'
git clone --mirror $RepoUrl $MirrorDir
if ($LASTEXITCODE -ne 0) { Write-Error 'mirror clone failed'; exit 2 }

Push-Location $MirrorDir

Write-Host "--- Purge plan (dry run=${DryRun}) ---"
Write-Host "Paths to purge:"; $pathsToPurge | ForEach-Object { Write-Host "  - $_" }

if ($DryRun) {
  Write-Host "Dry run: inspecting which refs would be affected..."
} else {
  Write-Host "Preparing to run git-filter-repo. This will rewrite history in the mirror clone only."
}

# Build filter-repo args
$invertArgs = @()
foreach ($p in $pathsToPurge) { $invertArgs += "--path"; $invertArgs += $p }

Write-Host 'Checking git-filter-repo availability...'
try { python -c "import git_filter_repo"; $hasGR = $true } catch { $hasGR = $false }
if (-not $hasGR) {
  Write-Host 'git-filter-repo not found in python environment. Installing locally to a temp venv (recommended).' -ForegroundColor Yellow
  python -m venv venv-filterrepo
  $venvPip = Join-Path -Path (Join-Path $PWD 'venv-filterrepo') -ChildPath 'Scripts\\pip.exe'
  if (Test-Path $venvPip) {
    & $venvPip install --upgrade pip
    & $venvPip install git-filter-repo
    # use venv python for subsequent invocation
    $pythonCmd = Join-Path -Path (Join-Path $PWD 'venv-filterrepo') -ChildPath 'Scripts\\python.exe'
    # verify git_filter_repo is importable from the chosen python
    try { & $pythonCmd -c "import git_filter_repo"; $hasGR = $true } catch { $hasGR = $false }
    if (-not $hasGR) { Write-Warning 'git-filter-repo still not importable from venv python.' }
  } else {
    Write-Warning 'Failed to prepare a venv pip. Attempting system python install (may require privileges).'
    & python -m pip install --user git-filter-repo
    $pythonCmd = 'python'
    try { & python -c "import git_filter_repo"; $hasGR = $true } catch { $hasGR = $false }
  }
} else {
  $pythonCmd = 'python'
}

if ($DryRun) {
  Write-Host 'Running a check-only simulation (git-filter-repo has no true dry-run) — we will run the tool against a fresh mirror and check results.'
}

Write-Host 'Running git-filter-repo to remove sensitive paths...' -ForegroundColor Cyan
# Use the selected python executable so a venv-installed git-filter-repo is used
if (-not $hasGR) {
  Write-Error 'git-filter-repo is not installed and could not be prepared. Please install git-filter-repo manually and re-run the script.'
  Pop-Location
  exit 4
}

& $pythonCmd -m git_filter_repo --invert-paths $invertArgs

if ($LASTEXITCODE -ne 0) {
  Write-Error ("git-filter-repo failed. Inspect the mirror repo at $MirrorDir")
  Pop-Location
  exit 3
}

Write-Host 'Purged history in mirror clone. Verifying the files are gone...'
Write-Host 'Listing files that still match suspect patterns (if any):'
# Search for any remaining candidate files
foreach ($p in $pathsToPurge) {
  git ls-files | Select-String -Pattern ([regex]::Escape($p)) -SimpleMatch | ForEach-Object { Write-Host "REMAIN: $_" }
}

Write-Host 'Now run a secrets scan inside mirror to confirm (gitleaks):'
if (Get-Command gitleaks -ErrorAction SilentlyContinue) {
  & gitleaks detect --source . --report-path .\\gitleaks-report.json
  if ($LASTEXITCODE -ne 0) { Write-Warning 'gitleaks may have found issues — review gitleaks-report.json' }
  if (Test-Path .\\gitleaks-report.json) { Get-Content .\\gitleaks-report.json | Out-Host }
} else { Write-Host 'gitleaks not installed — install or run the scan manually.' }

Write-Host '`IMPORTANT:` The mirror clone now has a rewritten history. If you intend to push the cleaned repo to origin, you must coordinate with the team and be prepared to instruct everyone to re-clone.
This script does not push by default. To push, run the `git push --force --all` and `git push --force --tags` commands from inside the mirror directory AFTER you have communicated the change.' -ForegroundColor Yellow

Pop-Location

Write-Host 'Mirror clone cleaned at:' $MirrorDir
Write-Host 'Next steps: (1) rotate secrets, (2) verify CI changes, (3) push --force from mirror, (4) make security announcement and require team to re-clone.'
