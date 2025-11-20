$port = 3001
$path = "/api/health"
try {
    $response = Invoke-WebRequest -Uri "http://localhost:$port$path" -UseBasicParsing -TimeoutSec 5
    Write-Host "Backend respondió con $($response.StatusCode)"
    $body = $response.Content | ConvertFrom-Json
    Write-Host "Status: $($body.status) | productos: $($body.productCount) | ts: $($body.timestamp)"
} catch {
    Write-Warning ("Backend no responde en http://localhost:{0}{1}: {2}" -f $port, $path, $($_))
}
