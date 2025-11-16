# Script para renombrar TODOS los archivos de imágenes a minúsculas con guiones

$imageFolder = "Imagenes"
$logFile = "rename-log.txt"

Write-Host "Renombrando archivos en carpeta Imagenes..." -ForegroundColor Cyan

$renamed = 0
$skipped = 0

Get-ChildItem -Path $imageFolder -Filter "*.jpg" -File | ForEach-Object {
    $oldName = $_.Name
    # Convertir a minúsculas y reemplazar espacios por guiones
    $newName = $oldName.ToLower() -replace '\s+', '-'
    
    if ($oldName -ne $newName) {
        $oldPath = $_.FullName
        $newPath = Join-Path $_.Directory $newName
        
        # Verificar que no exista ya
        if (Test-Path $newPath) {
            Write-Host "Ya existe: $newName" -ForegroundColor Yellow
            $skipped++
        } else {
            Rename-Item -Path $oldPath -NewName $newName -ErrorAction Stop
            Write-Host "OK: $oldName -> $newName" -ForegroundColor Green
            Add-Content -Path $logFile -Value "$oldName → $newName"
            $renamed++
        }
    } else {
        $skipped++
    }
}

Write-Host ""
Write-Host "Resumen:" -ForegroundColor Cyan
Write-Host "   Renombrados: $renamed" -ForegroundColor Green
Write-Host "   Sin cambios: $skipped" -ForegroundColor Yellow
Write-Host ""
Write-Host "Proceso completado" -ForegroundColor Green
