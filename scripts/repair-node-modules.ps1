<#
  scripts/repair-node-modules.ps1

  Intenta reparar y eliminar una carpeta node_modules bloqueada en Windows.
  - Recomienda ejecutarlo desde PowerShell ejecutándose como Administrador.
  - Intenta detener procesos habituales (esbuild, node, rollup, vite, ts-node, nodemon, code).
  - Intenta tomar propiedad (takeown) y dar permisos (icacls) recursivamente, y luego elimina node_modules.

  Uso:
    # Como administrador
    .\scripts\repair-node-modules.ps1 -Path .\node_modules -Force:$true

#>

param(
  [Parameter(Mandatory=$false)] [string] $Path = "node_modules",
  [switch] $Force
)

function Is-Admin {
  $current = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
  return $current.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

Write-Host "repair-node-modules: path=$Path, Force=$Force" -ForegroundColor Cyan

if (-not (Test-Path -Path $Path)) {
  Write-Host "Ruta no encontrada: $Path" -ForegroundColor Yellow
  exit 0
}

if (-not (Is-Admin)) {
  Write-Host "Advertencia: se recomienda ejecutar este script como Administrador para asegurar permisos suficientes." -ForegroundColor Yellow
}

$blocking = @('esbuild.exe','node.exe','rollup.win32-x64-msvc.node','rollup.exe','vite','ts-node','nodemon','Code.exe')
foreach ($name in $blocking) {
  try {
    $procs = Get-Process -Name $name -ErrorAction SilentlyContinue
    if ($procs) {
      foreach ($p in $procs) {
        Write-Host "Intentando detener proceso $($p.ProcessName) (PID $($p.Id))..." -ForegroundColor Yellow
        try { Stop-Process -Id $p.Id -Force -ErrorAction Stop; Start-Sleep -Milliseconds 300 } catch { 
          Write-Host "Stop-Process falló para PID $($p.Id), intentando taskkill..." -ForegroundColor Yellow
          try { cmd /c "taskkill /PID $($p.Id) /F /T" | Out-Null } catch { Write-Host "taskkill falló: $_" -ForegroundColor Yellow }
        }
      }
    }
  } catch { }
}

Write-Host "Tomando propiedad recursiva de $Path y aplicando permisos de control total al usuario actual..." -ForegroundColor Cyan
try {
  # use /a to assign to Administrators (avoids locale-specific /d prompt)
  cmd /c "takeown /f `"$Path`" /r /a" | Out-Null
  # Grant Administrators full control first; then grant the current user
  cmd /c "icacls `"$Path`" /grant Administrators:F /t /c" | Out-Null
  $user = "$env:USERDOMAIN\$env:USERNAME"
  cmd /c "icacls `"$Path`" /grant `"$user`":(F) /t /c" | Out-Null
} catch { Write-Host "Advertencia: No se pudo cambiar permisos totalmente: $_" -ForegroundColor Yellow }

Write-Host "Eliminando $Path (intento final)..." -ForegroundColor Cyan
try {
  Remove-Item -Path $Path -Recurse -Force -ErrorAction Stop
  Write-Host "Eliminado $Path correctamente." -ForegroundColor Green
} catch {
  Write-Host "ERROR: No se pudo eliminar $Path. Intenta ejecutar PowerShell como Administrador o reinicia el sistema y vuelve a intentarlo." -ForegroundColor Red
  if (-not $Force) { exit 1 } else { Write-Host "Forzando ignorar fallo por parámetro -Force..." -ForegroundColor Yellow }
}

exit 0
