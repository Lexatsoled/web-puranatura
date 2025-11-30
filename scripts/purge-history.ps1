<#
Purge history helper (PowerShell)
#
# This script creates a mirrored clone of the repository, runs git-filter-repo
# to remove sensitive paths and artifacts, and leaves the cleaned mirror in
# a directory (`$PurgedDir`) for inspection. It does NOT push anything to
# the origin by default — after manual verification you can push the cleaned
# mirror with `git push --force --all` and `git push --force --tags`.
#
# Requirements: git, python (pip), git-filter-repo (the script will try to
# install it into a temporary venv if not present).
#
# Use: powershell -NoProfile -ExecutionPolicy Bypass -File scripts/purge-history.ps1 -Repo <remote-url> -AutoYes
#
# WARNING: Rewriting history is destructive. Coordinate with your team before
# force-pushing to the origin (everyone must re-clone or reset their local branches).
#>

param(
  [string]$Repo = 'git@github.com:Lexatsoled/web-puranatura.git',
  [string]$MirrorDir = './tmp-repo-mirror.git',
  [string]$PurgedDir = './tmp-repo-purged.git',
  [switch]$AutoYes
)

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  Write-Error 'git is required. Install git and re-run.'; exit 1
}

if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
  Write-Error 'python is required (git-filter-repo is a python tool). Install python and re-run.'; exit 1
}

Write-Host "Mirror clone will be created from: $Repo"
Write-Host "Mirror dir: $MirrorDir"; Write-Host "Purged result dir: $PurgedDir"

if (-not $AutoYes) {
  $confirm = Read-Host 'Continue? type Y to proceed'
  if ($confirm -ne 'Y') { Write-Host 'Aborted'; exit 1 }
} else { Write-Host 'AutoYes: proceeding without interactive confirm.' }

Remove-Item -Recurse -Force -ErrorAction SilentlyContinue $MirrorDir, $PurgedDir

Write-Host 'Cloning mirror...' -ForegroundColor Cyan
# When cloning from a local repo use --no-local to get a clean mirror suitable
# for filter-repo operations (git may otherwise create local-packed clones)
git clone --mirror --no-local $Repo $MirrorDir
if ($LASTEXITCODE -ne 0) { Write-Error 'mirror clone failed'; exit 2 }

Push-Location $MirrorDir

$pathsToRemove = @(
  'archive/legacy-docs/',
  'reports/tmp/',
  'reports/tmp/*',
  '*.env.local',
  'reports/tmp/lighthouse.*'
)

Write-Host 'Paths to remove:'; $pathsToRemove | ForEach-Object { Write-Host " - $_" }

if (-not $AutoYes) {
  $ok = Read-Host 'Proceed with rewrite in the mirror clone? Type Y to proceed'
  if ($ok -ne 'Y') { Write-Host 'Cancelled'; Pop-Location; exit 0 }
} else { Write-Host 'AutoYes: running rewrite now.' }

Write-Host 'Ensuring git-filter-repo is available (attempt to install in a temporary venv if needed)...'
try { python -c "import git_filter_repo"; $hasGR = $true } catch { $hasGR = $false }
if (-not $hasGR) {
  Write-Host 'Installing git-filter-repo into a temporary venv...' -ForegroundColor Yellow
  $venvDir = Join-Path $PWD 'venv-filterrepo'
  python -m venv $venvDir
  $venvPip = Join-Path -Path $venvDir -ChildPath 'Scripts\pip.exe'
  & $venvPip install --upgrade pip
  & $venvPip install git-filter-repo
  $pythonCmd = Join-Path -Path $venvDir -ChildPath 'Scripts\python.exe'
} else { $pythonCmd = 'python' }

Write-Host 'Writing remove-file list...' -ForegroundColor Cyan
$removeFile = Join-Path $PWD 'remove-paths.txt'
Set-Content -Path $removeFile -Value ($pathsToRemove -join "`n")

Write-Host 'Running git-filter-repo to remove sensitive paths...' -ForegroundColor Cyan
& $pythonCmd -m git_filter_repo --invert-paths --paths-from-file $removeFile
if ($LASTEXITCODE -ne 0) { Write-Error 'git-filter-repo failed; inspect mirror repo and logs'; Pop-Location; exit 3 }

Write-Host 'Rewrite complete in mirror. Verifying results...'
Write-Host 'Searching for remaining candidate files (this may list artifacts)' -ForegroundColor Yellow
foreach ($p in $pathsToRemove) {
  git ls-files | Select-String -Pattern ([regex]::Escape($p)) -SimpleMatch | ForEach-Object { Write-Host "REMAIN: $_" }
}

Write-Host 'Optional: run gitleaks inside the mirror (if installed) to confirm no leaks remain.'
if (Get-Command gitleaks -ErrorAction SilentlyContinue) { gitleaks detect --source . --report-path ./gitleaks-report.json }

Pop-Location

Move-Item -Force $MirrorDir $PurgedDir

Write-Host "Purged mirror ready at: $PurgedDir" -ForegroundColor Green
Write-Host 'Review thoroughly before force-pushing to origin. To push (manual):' -ForegroundColor Yellow
Write-Host "  cd $PurgedDir`n  git push --force --all`n  git push --force --tags"

