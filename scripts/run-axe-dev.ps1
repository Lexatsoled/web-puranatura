Param(
  [string]$Url = 'http://localhost:5173',
  [string]$Out = 'reports/axe-report.json'
)

# Start dev server
$proc = Start-Process -FilePath npm.cmd -ArgumentList 'run','dev' -PassThru -WindowStyle Hidden
Write-Host "Started dev server (PID $($proc.Id)), waiting for $Url..."

# Wait for server to be ready
for ($i = 0; $i -lt 90; $i++) {
  try {
    $r = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 2
    if ($r.StatusCode -ge 200) {
      Write-Host "$Url is responding"
      break
    }
  } catch {
    Start-Sleep -Seconds 1
  }
}

if ($i -ge 90) {
  Write-Error "Timed out waiting for $Url"
  Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
  exit 2
}

# Run axe-playwright
Write-Host "Running axe-playwright against $Url..."
node .\scripts\axe-playwright.cjs $Url $Out
$exit = $LASTEXITCODE

# Stop dev server
Write-Host "Stopping dev server (PID $($proc.Id))..."
Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue

exit $exit
