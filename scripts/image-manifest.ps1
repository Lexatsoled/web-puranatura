$root = "public/Jpeg"
if (-Not (Test-Path $root)) {
    throw "No existe $root"
}

function Get-ImageSlug([string]$name) {
    $slug = $name.ToLower()
    $slug = $slug -replace '\.(jpg|jpeg|png|webp|avif)$', ''
    $slug = $slug -replace '[^a-z0-9]+', '-'
    $slug = $slug.Trim('-')
    return $slug
}

$files = Get-ChildItem $root -File | Sort-Object Name

$manifest = $files | ForEach-Object {
    [pscustomobject]@{
        slug     = Get-ImageSlug $_.BaseName
        fileName = $_.Name
        path     = "/Jpeg/$($_.Name)"
        size     = $_.Length
    }
}

$manifestPath = "data/image-manifest.json"
$manifest | ConvertTo-Json -Depth 4 | Set-Content $manifestPath -Encoding utf8
Write-Host "Manifest guardado en $manifestPath con $($manifest.Count) entradas"
