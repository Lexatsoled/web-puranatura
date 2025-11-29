#!/usr/bin/env pwsh
<#
Rotate repository secrets for Lexatsoled/web-puranatura.
This script generates strong random secrets and sets them via gh CLI.
It does NOT echo the values. It prints a short confirmation per secret.

Use: powershell -NoProfile -ExecutionPolicy Bypass -File scripts/rotate-secrets.ps1
#>

param(
  [string]$Repo = 'Lexatsoled/web-puranatura'
)

$names = @('JWT_SECRET','JWT_REFRESH_SECRET','GEMINI_API_KEY','BACKUP_ENCRYPTION_KEY','SENTRY_DSN','REDIS_PASSWORD')

foreach ($n in $names) {
  $bytes = New-Object byte[] 48
  [System.Security.Cryptography.RNGCryptoServiceProvider]::Create().GetBytes($bytes)
  $value = [Convert]::ToBase64String($bytes)
  gh secret set $n --repo $Repo --body $value
  if ($LASTEXITCODE -eq 0) {
    Write-Host "SET: $n"
  } else {
    Write-Host "FAILED: $n" -ForegroundColor Red
    exit 2
  }
}

Write-Host 'All specified secrets were rotated (values not shown).'
