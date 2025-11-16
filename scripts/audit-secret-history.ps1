Param(
    [string]$LogPath = ""
)

Write-Host "== Iniciando auditoría histórica de secretos ==" -ForegroundColor Cyan

$files = @(
    "backend/.env",
    "backend/.env.local",
    "backend/database.sqlite",
    "backend/database.sqlite-shm",
    "backend/database.sqlite-wal"
)

$foundIssues = 0

function Write-Log {
    param(
        [string]$Message
    )
    if ($LogPath) {
        $Message | Out-File -FilePath $LogPath -Append -Encoding UTF8
    }
}

if ($LogPath) {
    "Auditoria ejecutada $(Get-Date -Format s)" | Out-File -FilePath $LogPath -Encoding UTF8
}

foreach ($file in $files) {
    Write-Host ""
    Write-Host "--> Verificando: $file" -ForegroundColor Yellow
    Write-Log "`n## git log --all --full-history --pretty=format:%H %ai %an -- $file"
    $result = git log --all --full-history --pretty=format:"%H %ai %an - %s" -- $file 2>$null
    if ([string]::IsNullOrWhiteSpace($result)) {
        Write-Host "    OK - Nunca fue comiteado." -ForegroundColor Green
        Write-Log "<sin resultados>"
    } else {
        Write-Host "    ALERTA - Encontrado en historial" -ForegroundColor Red
        $result | ForEach-Object { Write-Host "       $_" }
        Write-Log ($result -join [Environment]::NewLine)
        $foundIssues++
    }
}

Write-Host "`n--> Verificando backend/.gitignore" -ForegroundColor Yellow
Write-Log "`n## git log --all --pretty=format:%H %ai -- backend/.gitignore"
$gitignoreLog = git log --all --pretty=format:"%H %ai %an - %s" -- backend/.gitignore 2>$null
if ([string]::IsNullOrWhiteSpace($gitignoreLog)) {
    Write-Host "    Sin historial específico." -ForegroundColor Green
    Write-Log "<sin resultados>"
} else {
    $gitignoreLog | ForEach-Object { Write-Host "       $_" }
    Write-Log ($gitignoreLog -join [Environment]::NewLine)
}

Write-Host ""
if ($foundIssues -eq 0) {
    Write-Host "== HISTORIAL LIMPIO ==" -ForegroundColor Green
    exit 0
} else {
    Write-Host "== SE DETECTARON $foundIssues PROBLEMA(S) ==" -ForegroundColor Red
    exit 1
}
