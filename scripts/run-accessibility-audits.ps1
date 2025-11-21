Param(
    [string]$Port = '5173',
    [string]$BaseHost = 'http://localhost',
    [string]$ReportsDir = 'reports',
    [int]$ChromeDebugPort = 0
)

$url = "$BaseHost`:$Port"
$previewProc = $null

Write-Host "Starting preview (background)..."
# ensure reports and tmp dirs exist and use them for TEMP to avoid Windows temp permission issues
if (!(Test-Path $ReportsDir)) { New-Item -ItemType Directory -Path $ReportsDir | Out-Null }
$tmpDir = Join-Path $ReportsDir 'tmp'
if (!(Test-Path $tmpDir)) { New-Item -ItemType Directory -Path $tmpDir | Out-Null }

# point TEMP/TMP to a writable folder for spawned Chrome instances
$env:TEMP = (Resolve-Path $tmpDir).ProviderPath
$env:TMP = (Resolve-Path $tmpDir).ProviderPath

$startInfo = @{FilePath='npm.cmd'; ArgumentList=@('run','preview','--','--port',$Port); NoNewWindow=$true}
$previewProc = Start-Process @startInfo -PassThru

Write-Host "Waiting for $url to be ready..."
for ($i=0; $i -lt 60; $i++) {
    try {
        Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 2 | Out-Null
        Write-Host "$url is responding"
        break
    } catch {
        Start-Sleep -Seconds 1
    }
}

if (!(Test-Path $ReportsDir)) { New-Item -ItemType Directory -Path $ReportsDir | Out-Null }

Write-Host "Running Lighthouse (desktop)..."
$lhDesktopArgs = "--output html --output json --output-path $ReportsDir/lighthouse-desktop --quiet --chrome-flags='--no-sandbox' --emulated-form-factor=desktop"
if ($ChromeDebugPort -gt 0) {
    Write-Host "Connecting Lighthouse to existing Chrome on port $ChromeDebugPort"
    $lhDesktopArgs = "$lhDesktopArgs --port $ChromeDebugPort"
}
npx lighthouse $url $lhDesktopArgs

Write-Host "Running Lighthouse (mobile)..."
$lhMobileArgs = "--output html --output json --output-path $ReportsDir/lighthouse-mobile --quiet --chrome-flags='--no-sandbox' --emulated-form-factor=mobile"
if ($ChromeDebugPort -gt 0) {
    $lhMobileArgs = "$lhMobileArgs --port $ChromeDebugPort"
}
npx lighthouse $url $lhMobileArgs

Write-Host "Running axe-core scan via Playwright..."
node scripts/axe-playwright.cjs $url $ReportsDir/axe-report.json

Write-Host "Reports saved to: $ReportsDir"

if ($previewProc -ne $null) {
    Write-Host "Stopping preview (PID $($previewProc.Id))..."
    try { Stop-Process -Id $previewProc.Id -Force } catch {}
}

Write-Host "Done."
