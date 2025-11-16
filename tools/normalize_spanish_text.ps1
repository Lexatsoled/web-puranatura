<#
  Script: normalize_spanish_text.ps1
  Propósito: Normalizar caracteres españoles mal codificados (mojibake)
             en comentarios y textos de archivos .ts y .tsx.
  Uso:
    pwsh ./tools/normalize_spanish_text.ps1
  Notas:
    - Opera sobre carpetas src/ y components/.
    - Aplica un mapa de reemplazos conservador (palabras frecuentes en comentarios/etiquetas).
    - Hace copia de seguridad .bak por archivo modificado.
#>

$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$repo = Split-Path -Parent $root

$targets = @(
  Join-Path $repo 'src'),
  (Join-Path $repo 'components')

$extensions = @('*.ts','*.tsx')

$replacements = @{
  'Informaci��n' = 'Información'
  'informaci��n' = 'información'
  'Descripci��n' = 'Descripción'
  'descripci��n' = 'descripción'
  'Administraci��n' = 'Administración'
  'administraci��n' = 'administración'
  'Funci��n' = 'Función'
  'funci��n' = 'función'
  'acci��n' = 'acción'
  'Prop��sito' = 'Propósito'
  'prop��sito' = 'propósito'
  'L��gica' = 'Lógica'
  'categor��a' = 'categoría'
  'Categor��a' = 'Categoría'
  'p��gina' = 'página'
  'Cl��nico' = 'Clínico'
  'cl��nico' = 'clínico'
  'Sistemǭtica' = 'Sistemática'
  'Meta-anǭlisis' = 'Meta-análisis'
  'Cient��ficas' = 'Científicas'
  'cient��ficas' = 'científicas'
}

$files = foreach ($t in $targets) { Get-ChildItem -Path $t -Recurse -Include $extensions -File }

foreach ($file in $files) {
  $content = Get-Content -Raw -LiteralPath $file.FullName
  $original = $content
  foreach ($kvp in $replacements.GetEnumerator()) {
    $content = $content -replace [Regex]::Escape($kvp.Key), $kvp.Value
  }
  if ($content -ne $original) {
    Copy-Item -LiteralPath $file.FullName -Destination ($file.FullName + '.bak') -Force
    [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.UTF8Encoding]::new($true))
    Write-Host "Normalizado: $($file.FullName)"
  }
}

Write-Host 'Normalización completada.'

