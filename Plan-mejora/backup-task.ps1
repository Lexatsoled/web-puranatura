# Script: Crear tarea programada de backup seguro (VACUUM INTO) en Windows
# Uso: Ejecutar en PowerShell con permisos de administrador.
# La tarea corre diariamente a la hora indicada y ejecuta `npm run backup:safe`
# con `DATABASE_URL=file:./prisma/dev.db`.

param(
  [string]$RepoPath = "C:\Users\Usuario\Desktop\Web Puranatura\web-puranatura---terapias-naturales",
  [string]$Time = "03:00",
  [string]$TaskName = "Puranatura-Backup-Diario",
  [string]$LogPath = "$env:LOCALAPPDATA\Puranatura\backup-task.log"
)

Write-Host "Creando tarea $TaskName en $Time usando repo $RepoPath"

$action = New-ScheduledTaskAction -Execute "cmd.exe" -Argument "/c set DATABASE_URL=file:./prisma/dev.db && cd /d `"$RepoPath`" && npm run backup:safe >> `"$LogPath`" 2>&1"
$trigger = New-ScheduledTaskTrigger -Daily -At $Time
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable
$principal = New-ScheduledTaskPrincipal -UserId "$env:USERNAME" -LogonType Interactive -RunLevel Highest

Register-ScheduledTask -TaskName $TaskName -Action $action -Trigger $trigger -Settings $settings -Principal $principal -Force

Write-Host "Tarea registrada. Log: $LogPath"
