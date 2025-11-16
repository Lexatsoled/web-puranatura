<#
Rollback script - restores pre-audit state using git and public backup
Usage: powershell -ExecutionPolicy Bypass -File .\scripts\rollback.ps1 [-TagName pre-audit-YYYYMMDD_HHMM]
#>
param(
    [string]$TagName = ''
)

Write-Host "[rollback] Inicio de rollback: $(Get-Date -Format o)"

if ($TagName -ne '') {
    Write-Host "[rollback] Restoring Git tag: $TagName"
    git checkout $TagName
    if ($LASTEXITCODE -ne 0) { Write-Warning "git checkout $TagName falló" }
    exit 0
}

# If no tag provided, restore public backup if exists
if (Test-Path -Path .\public-audit-backup) {
    Write-Host "[rollback] Restaurando carpeta public desde public-audit-backup"
    robocopy .\.\public-audit-backup .\.\public /MIR
    Write-Host "[rollback] Restauración completa"
} else {
    Write-Warning "No se encontró public-audit-backup. Considera usar un tag git para rollback."
}

Write-Host "[rollback] Finalizado"
