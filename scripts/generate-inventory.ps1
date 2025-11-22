<#
  scripts/generate-inventory.ps1

  Genera un inventario (JSON) con huellas SHA256 de los ficheros del repo
  - Excluye node_modules, .git y artefactos grandes/temporal
  - Salida: inventory-baseline.json en la raíz del repo

  Uso (PowerShell):
    .\scripts\generate-inventory.ps1 -OutFile inventory-baseline.json
#>

param(
  [string] $OutFile = "inventory-baseline.json",
  [string[]] $ExcludeGlobs = @('node_modules', '.git', 'coverage', 'reports', 'dist', 'backend/dist', 'backend/prisma/database.sqlite')
)

Write-Host "Generando inventario SHA256 del repo..." -ForegroundColor Cyan

# Asegurar que errores no terminantes no aborten el script en entornos con ErrorActionPreference estricto
$oldErrorActionPreference = $ErrorActionPreference
$ErrorActionPreference = 'Continue'

function ShouldExclude($path) {
  foreach ($g in $ExcludeGlobs) {
    if ($path -like "*${g}*") { return $true }
  }
  return $false
}

$root = Get-Location
$items = Get-ChildItem -Path $root -Recurse -File

$result = @()
foreach ($f in $items) {
    try {
      # Calcular ruta relativa al repo
      $rel = $f.FullName.Substring($root.Path.Length).TrimStart('\','/')
      if (ShouldExclude($rel)) { continue }
      # Get-FileHash can fail for in-use files (locked). Use ErrorAction to avoid script aborting.
      $hash = Get-FileHash -Algorithm SHA256 -Path $f.FullName -ErrorAction SilentlyContinue
      if ($null -eq $hash) {
        Write-Warning "No se pudo hashear (archivo inaccesible o bloqueado): $($f.FullName)"
        continue
      }
      $result += [PSCustomObject]@{ path = $rel; sha256 = $hash.Hash; length = $f.Length }
    } catch {
      Write-Warning "No se pudo hashear: $($f.FullName) - $_"
      continue
    }
}

$json = $result | ConvertTo-Json -Depth 3
Set-Content -Path $OutFile -Value $json -Encoding UTF8
Write-Host "Inventario generado -> $OutFile (items: $($result.Count))" -ForegroundColor Green

# Restaurar ErrorActionPreference
$ErrorActionPreference = $oldErrorActionPreference
