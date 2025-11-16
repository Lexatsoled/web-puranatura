# Script de PowerShell para convertir imágenes a JPEG
# Requiere que tengas instalado ImageMagick o usa la API de Windows

param(
    [string]$InputDir = "Imagenes Piping Rock",
    [string]$OutputDir = "public\Jpeg",
    [int]$Quality = 85,
    [int]$MaxWidth = 800
)

# Crear directorio de salida si no existe
if (!(Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null
    Write-Host "📁 Creado directorio: $OutputDir" -ForegroundColor Green
}

# Obtener todos los archivos de imagen
$imageFiles = Get-ChildItem -Path $InputDir -File | Where-Object { 
    $_.Extension -match '\.(webp|avif|png|jpg|jpeg)$' 
}

Write-Host "📸 Encontradas $($imageFiles.Count) imágenes para convertir..." -ForegroundColor Cyan

$converted = 0
$errors = 0

foreach ($file in $imageFiles) {
    $baseName = [System.IO.Path]::GetFileNameWithoutExtension($file.Name)
    $outputPath = Join-Path $OutputDir "$baseName.jpg"
    
    try {
        # Usar System.Drawing para convertir (Windows nativo)
        Add-Type -AssemblyName System.Drawing
        
        $inputPath = $file.FullName
        $image = [System.Drawing.Image]::FromFile($inputPath)
        
        # Calcular nuevas dimensiones manteniendo ratio
        $ratio = $image.Width / $image.Height
        if ($image.Width -gt $MaxWidth) {
            $newWidth = $MaxWidth
            $newHeight = [int]($MaxWidth / $ratio)
        } else {
            $newWidth = $image.Width
            $newHeight = $image.Height
        }
        
        # Crear nueva imagen redimensionada
        $newImage = New-Object System.Drawing.Bitmap($newWidth, $newHeight)
        $graphics = [System.Drawing.Graphics]::FromImage($newImage)
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graphics.DrawImage($image, 0, 0, $newWidth, $newHeight)
        
        # Configurar calidad JPEG
        $jpegEncoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | 
                      Where-Object { $_.MimeType -eq "image/jpeg" }
        
        $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
        $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
            [System.Drawing.Imaging.Encoder]::Quality, $Quality)
        
        # Guardar imagen
        $newImage.Save($outputPath, $jpegEncoder, $encoderParams)
        
        # Limpiar objetos
        $graphics.Dispose()
        $newImage.Dispose()
        $image.Dispose()
        
        $converted++
        Write-Host "✅ Convertido: $($file.Name) → $baseName.jpg" -ForegroundColor Green
        
    } catch {
        $errors++
        Write-Host "❌ Error convirtiendo $($file.Name): $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n🎉 Conversión completada!" -ForegroundColor Yellow
Write-Host "✅ Convertidas: $converted imágenes" -ForegroundColor Green
Write-Host "❌ Errores: $errors imágenes" -ForegroundColor Red
Write-Host "📁 Ubicación: $(Resolve-Path $OutputDir)" -ForegroundColor Cyan