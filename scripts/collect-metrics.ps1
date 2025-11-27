#!/usr/bin/env pwsh
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

Add-Type -AssemblyName System.Net.Http

function Wait-ForHealth {
  param(
    [System.Net.Http.HttpClient]$Client,
    [string]$BaseUrl,
    [int]$TimeoutSeconds = 20
  )

  $deadline = (Get-Date).AddSeconds($TimeoutSeconds)
  $healthUri = "$BaseUrl/api/health"

  while ((Get-Date) -lt $deadline) {
    try {
      $request = [System.Net.Http.HttpRequestMessage]::new(
        [System.Net.Http.HttpMethod]::Get,
        $healthUri
      )
      $response = $Client.SendAsync($request).GetAwaiter().GetResult()
      if ($response.IsSuccessStatusCode) {
        return
      }
    } catch {
      Start-Sleep -Milliseconds 400
    }
    Start-Sleep -Milliseconds 400
  }

  throw "El backend no respondio en $healthUri dentro del tiempo limite."
}

function Invoke-Probe {
  param(
    [System.Net.Http.HttpClient]$Client,
    [string]$BaseUrl,
    [string]$Name,
    [string]$Path,
    [hashtable]$Headers = @{}
  )

  $uri = "$BaseUrl$Path"
  $request = [System.Net.Http.HttpRequestMessage]::new(
    [System.Net.Http.HttpMethod]::Get,
    $uri
  )

  foreach ($entry in $Headers.GetEnumerator()) {
    $null = $request.Headers.TryAddWithoutValidation(
      $entry.Key,
      [string]$entry.Value
    )
  }

  $watch = [System.Diagnostics.Stopwatch]::StartNew()
  $response = $Client.SendAsync($request).GetAwaiter().GetResult()
  $watch.Stop()

  $body = $response.Content.ReadAsStringAsync().GetAwaiter().GetResult()

  return [pscustomobject]@{
    Observation = [pscustomobject]@{
      Name       = $Name
      Path       = $Path
      Status     = [int]$response.StatusCode
      DurationMs = [math]::Round($watch.Elapsed.TotalMilliseconds, 2)
    }
    Body       = $body
    Response   = $response
  }
}

function Write-PerfSummary {
  param(
    [System.Collections.Generic.List[object]]$Observations,
    [string]$Destination
  )

  $lines = @(
    "# Resumen de sondas HTTP",
    "",
    "| Endpoint | Ruta | Estado | Duracion (ms) |",
    "| --- | --- | --- | --- |"
  )

  $culture = [System.Globalization.CultureInfo]::InvariantCulture

  foreach ($obs in $Observations) {
    $duration = [string]::Format($culture, '{0:F2}', $obs.DurationMs)
    $lines += ("| {0} | `{1}` | {2} | {3} |" -f `
      $obs.Name,
      $obs.Path,
      $obs.Status,
      $duration
    )
  }

  $lines += ""
  $lines += "Generado: $(Get-Date -Format 'yyyy-MM-ddTHH:mm:ssK')"

  Set-Content -Path $Destination -Value $lines -Encoding UTF8
}

function Combine-LogsAndWriteTrace {
  param(
    [string]$StdoutLog,
    [string]$StderrLog,
    [string]$CombinedLog,
    [string]$Destination
  )

  $logParts = @()
  if (Test-Path $StdoutLog) {
    $logParts += Get-Content -Path $StdoutLog
  }
  if (Test-Path $StderrLog) {
    $logParts += Get-Content -Path $StderrLog
  }

  if ($logParts.Count -eq 0) {
    Set-Content -Path $Destination -Value @(
      "# Muestras de trazas",
      "",
      "No se capturo salida del backend durante la recoleccion."
    ) -Encoding UTF8
    return
  }

  Set-Content -Path $CombinedLog -Value $logParts -Encoding UTF8

  $matches = Select-String -Path $CombinedLog -Pattern 'traceId' -Context 0,4 `
    -ErrorAction SilentlyContinue | Select-Object -First 3

  if (-not $matches) {
    Set-Content -Path $Destination -Value @(
      "# Muestras de trazas",
      "",
      "No se encontraron lineas con traceId en $CombinedLog."
    ) -Encoding UTF8
    return
  }

  $output = New-Object System.Collections.Generic.List[string]
  $output.Add("# Muestras de trazas") | Out-Null
  $output.Add("") | Out-Null
  $output.Add('```') | Out-Null

  foreach ($match in $matches) {
    $output.Add($match.Line.TrimEnd()) | Out-Null
    foreach ($ctxLine in $match.Context.PostContext) {
      if ($ctxLine) {
        $output.Add($ctxLine.TrimEnd()) | Out-Null
      }
    }
    $output.Add("---") | Out-Null
  }

  $output.Add('```') | Out-Null
  Set-Content -Path $Destination -Value $output -Encoding UTF8
}

function Stop-ServerProcess {
  param([System.Diagnostics.Process]$Process)

  if ($Process -and -not $Process.HasExited) {
    try {
      Stop-Process -Id $Process.Id -Force -ErrorAction SilentlyContinue
      Wait-Process -Id $Process.Id -ErrorAction SilentlyContinue
    } catch {
      Write-Warning "No se pudo detener el proceso del backend: $($_.Exception.Message)"
    }
  }
}

$repoRoot = (Resolve-Path -Path (Join-Path $PSScriptRoot '..')).Path
$backendEntry = Join-Path $repoRoot 'backend/dist/server.js'

if (-not (Test-Path $backendEntry)) {
  throw "No se encontro backend/dist/server.js. Ejecuta npm --prefix backend run build antes de recolectar metricas."
}

$reportsDir = Join-Path $repoRoot 'reports/observability'
New-Item -ItemType Directory -Force -Path $reportsDir | Out-Null

$stdoutLog = Join-Path $reportsDir 'collect-metrics-server.stdout.log'
$stderrLog = Join-Path $reportsDir 'collect-metrics-server.stderr.log'
$combinedLog = Join-Path $reportsDir 'collect-metrics-server.log'
$metricsFile = Join-Path $reportsDir 'metrics-snapshot.txt'
$traceFile = Join-Path $reportsDir 'trace-sample.md'
$perfFile = Join-Path $reportsDir 'perf-summary.md'

@($stdoutLog, $stderrLog, $combinedLog, $metricsFile, $traceFile, $perfFile) |
  ForEach-Object {
    if (Test-Path $_) {
      Remove-Item -Path $_ -Force
    }
  }

$port = Get-Random -Minimum 4010 -Maximum 4999
$baseUrl = "http://127.0.0.1:$port"
$nodeBinary = (Get-Command node -ErrorAction Stop).Source
$hadPort = Test-Path Env:\PORT
$previousPort = if ($hadPort) { $env:PORT } else { $null }

$serverProcess = $null
$client = $null
$observations = New-Object System.Collections.Generic.List[object]

try {
  $env:PORT = $port
  Write-Host "[collect-metrics] Iniciando backend en puerto $port..."
  $quotedEntry = '"' + $backendEntry + '"'
  $serverProcess = Start-Process -FilePath $nodeBinary `
    -ArgumentList @($quotedEntry) `
    -WorkingDirectory $repoRoot `
    -RedirectStandardOutput $stdoutLog `
    -RedirectStandardError $stderrLog `
    -WindowStyle Hidden `
    -PassThru

  $client = [System.Net.Http.HttpClient]::new()
  $client.Timeout = [TimeSpan]::FromSeconds(20)

  Wait-ForHealth -Client $client -BaseUrl $baseUrl -TimeoutSeconds 30
  Write-Host "[collect-metrics] Backend listo. Ejecutando sondas..."

  $homeProbe = Invoke-Probe -Client $client -BaseUrl $baseUrl -Name 'GET /' -Path '/'
  $observations.Add($homeProbe.Observation) | Out-Null

  $healthProbe = Invoke-Probe -Client $client -BaseUrl $baseUrl -Name 'GET /api/health' -Path '/api/health'
  $observations.Add($healthProbe.Observation) | Out-Null

  $productsProbe = Invoke-Probe -Client $client -BaseUrl $baseUrl -Name 'GET /api/products?page=1&pageSize=5' -Path '/api/products?page=1&pageSize=5'
  $observations.Add($productsProbe.Observation) | Out-Null

  $etag = $null
  try {
    if ($productsProbe.Response.Headers.Contains('ETag')) {
      $etag = $productsProbe.Response.Headers.GetValues('ETag') |
        Select-Object -First 1
    }
  } catch {
    $etag = $null
  }

  if ($etag) {
    $etagProbe = Invoke-Probe -Client $client -BaseUrl $baseUrl `
      -Name 'GET /api/products (etag)' `
      -Path '/api/products?page=1&pageSize=5' `
      -Headers @{ 'If-None-Match' = $etag }
    $observations.Add($etagProbe.Observation) | Out-Null
  }

  Start-Sleep -Milliseconds 300

  $metricsProbe = Invoke-Probe -Client $client -BaseUrl $baseUrl -Name 'GET /metrics' -Path '/metrics'
  Set-Content -Path $metricsFile -Value $metricsProbe.Body -Encoding UTF8
  $observations.Add($metricsProbe.Observation) | Out-Null

  Write-PerfSummary -Observations $observations -Destination $perfFile

  Write-Host "[collect-metrics] Sondas completadas. Deteniendo backend..."
  Stop-ServerProcess -Process $serverProcess
  $serverProcess = $null

  Combine-LogsAndWriteTrace -StdoutLog $stdoutLog `
    -StderrLog $stderrLog `
    -CombinedLog $combinedLog `
    -Destination $traceFile

  Write-Host "[collect-metrics] metrics-snapshot, perf-summary y trace-sample generados en reports/observability."
} finally {
  if ($client) {
    $client.Dispose()
  }
  if ($serverProcess) {
    Stop-ServerProcess -Process $serverProcess
  }

  if ($hadPort) {
    $env:PORT = $previousPort
  } else {
    Remove-Item Env:\PORT -ErrorAction SilentlyContinue
  }
}
