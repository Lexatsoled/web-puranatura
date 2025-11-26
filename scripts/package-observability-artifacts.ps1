$target = 'reports/observability/archive'
New-Item -ItemType Directory -Path $target -Force | Out-Null

$artifacts = @(
  'reports/observability/metrics-snapshot.txt',
  'reports/observability/trace-sample.md',
  'reports/observability/perf-summary.md',
  'reports/lighthouse-desktop.report.json',
  'reports/lighthouse-mobile.report.json'
)

foreach ($artifact in $artifacts) {
  if (Test-Path $artifact) {
    Copy-Item -Path $artifact -Destination $target -Force
  }
}

$playwrightArgs = @{
  Source = 'playwright-report'
  Destination = Join-Path $target 'playwright-report'
}

if (Test-Path $playwrightArgs.Source) {
  Copy-Item -Path $playwrightArgs.Source -Destination $playwrightArgs.Destination -Recurse -Force
}

Set-Location $target
$zipFile = Join-Path '..' 'observability-artifacts.zip'
if (Test-Path $zipFile) { Remove-Item $zipFile }
Compress-Archive -Path * -DestinationPath $zipFile
Write-Output "Observability artifacts packaged to $zipFile"
