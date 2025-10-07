# Script PowerShell para convertir imágenes WEBP/AVIF a JPEG
param(
    [string]$SourceFolder = "Imagenes Piping Rock",
    [string]$DestFolder = "public\Jpeg",
    [int]$Quality = 85,
    [int]$MaxWidth = 800
)

# Cargar assembly necesario
Add-Type -AssemblyName System.Drawing

Write-Host "🖼️  Iniciando conversión de imágenes..." -ForegroundColor Cyan

# Verificar carpeta origen
if (-not (Test-Path $SourceFolder)) {
    Write-Host "❌ Error: No se encuentra la carpeta '$SourceFolder'" -ForegroundColor Red
    exit 1
}

# Crear carpeta destino
if (-not (Test-Path $DestFolder)) {
    New-Item -ItemType Directory -Path $DestFolder -Force | Out-Null
    Write-Host "📁 Creada carpeta destino: $DestFolder" -ForegroundColor Green
}

# Obtener archivos de imagen
$imageFiles = Get-ChildItem -Path $SourceFolder -File | Where-Object { 
    $_.Extension.ToLower() -match '\.(webp|avif|png)$' 
}

Write-Host "📂 Encontrados $($imageFiles.Count) archivos para convertir" -ForegroundColor Yellow
Write-Host ""

$converted = 0
$errors = 0

foreach ($file in $imageFiles) {
    try {
        $baseName = [System.IO.Path]::GetFileNameWithoutExtension($file.Name)
        $outputPath = Join-Path $DestFolder "$baseName.jpg"
        
        # Cargar imagen original
        $originalImage = [System.Drawing.Image]::FromFile($file.FullName)
        
        # Calcular nuevas dimensiones
        $originalWidth = $originalImage.Width
        $originalHeight = $originalImage.Height
        
        if ($originalWidth -gt $MaxWidth) {
            $newWidth = $MaxWidth
            $newHeight = [int](($originalHeight * $MaxWidth) / $originalWidth)
        } else {
            $newWidth = $originalWidth
            $newHeight = $originalHeight
        }
        
        # Crear nueva imagen
        $newImage = New-Object System.Drawing.Bitmap($newWidth, $newHeight)
        $graphics = [System.Drawing.Graphics]::FromImage($newImage)
        
        # Configurar calidad
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $graphics.Clear([System.Drawing.Color]::White)
        
        # Dibujar imagen redimensionada
        $graphics.DrawImage($originalImage, 0, 0, $newWidth, $newHeight)
        
        # Configurar codificador JPEG
        $jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
        $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
        $qualityParam = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, $Quality)
        $encoderParams.Param[0] = $qualityParam
        
        # Guardar como JPEG
        $newImage.Save($outputPath, $jpegCodec, $encoderParams)
        
        # Limpiar recursos
        $graphics.Dispose()
        $newImage.Dispose()
        $originalImage.Dispose()
        
        $converted++
        Write-Host "✅ $($file.Name) → $baseName.jpg" -ForegroundColor Green
    }
    catch {
        $errors++
        Write-Host "❌ Error con $($file.Name): $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "🎉 ¡Conversión completada!" -ForegroundColor Yellow
Write-Host "✅ Convertidas: $converted imágenes" -ForegroundColor Green
Write-Host "❌ Errores: $errors imágenes" -ForegroundColor Red
Write-Host "📁 Ubicación: $(Resolve-Path $DestFolder)" -ForegroundColor Cyan