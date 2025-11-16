# Script PowerShell para convertir imágenes WEBP/AVIF a JPEG
# Usa System.Drawing de .NET Framework que está disponible en Windows

param(
    [string]$SourceFolder = "Imagenes Piping Rock",
    [string]$DestFolder = "public\Jpeg",
    [int]$Quality = 85,
    [int]$MaxWidth = 800
)

# Cargar assembly necesario
Add-Type -AssemblyName System.Drawing

# Verificar que la carpeta origen existe
if (!(Test-Path $SourceFolder)) {
    Write-Host "❌ Error: No se encuentra la carpeta '$SourceFolder'" -ForegroundColor Red
    exit 1
}

# Crear carpeta destino si no existe
if (!(Test-Path $DestFolder)) {
    New-Item -ItemType Directory -Path $DestFolder -Force | Out-Null
    Write-Host "📁 Creada carpeta destino: $DestFolder" -ForegroundColor Green
}

# Función para convertir imagen
function Convert-Image {
    param(
        [string]$InputPath,
        [string]$OutputPath,
        [int]$Quality,
        [int]$MaxWidth
    )
    
    try {
        # Cargar imagen original
        $originalImage = [System.Drawing.Image]::FromFile($InputPath)
        
        # Calcular nuevas dimensiones manteniendo proporción
        $originalWidth = $originalImage.Width
        $originalHeight = $originalImage.Height
        
        if ($originalWidth -gt $MaxWidth) {
            $newWidth = $MaxWidth
            $newHeight = [int](($originalHeight * $MaxWidth) / $originalWidth)
        } else {
            $newWidth = $originalWidth
            $newHeight = $originalHeight
        }
        
        # Crear nueva imagen con las dimensiones calculadas
        $newImage = New-Object System.Drawing.Bitmap($newWidth, $newHeight)
        $graphics = [System.Drawing.Graphics]::FromImage($newImage)
        
        # Configurar calidad de renderizado
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        
        # Fondo blanco para imágenes con transparencia
        $graphics.Clear([System.Drawing.Color]::White)
        
        # Dibujar imagen redimensionada
        $graphics.DrawImage($originalImage, 0, 0, $newWidth, $newHeight)
        
        # Configurar codificador JPEG con calidad específica
        $jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | 
                     Where-Object { $_.MimeType -eq "image/jpeg" }
        
        $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
        $qualityParam = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, $Quality)
        $encoderParams.Param[0] = $qualityParam
        
        # Guardar imagen como JPEG
        $newImage.Save($OutputPath, $jpegCodec, $encoderParams)
        
        # Limpiar recursos
        $graphics.Dispose()
        $newImage.Dispose()
        $originalImage.Dispose()
        
        return $true
    }
    catch {
        Write-Host "❌ Error procesando imagen: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Obtener todas las imágenes
$imageFiles = Get-ChildItem -Path $SourceFolder -File | Where-Object { 
    $_.Extension.ToLower() -match '\.(webp|avif|png)$' 
}

Write-Host "🖼️  Iniciando conversión de $($imageFiles.Count) imágenes..." -ForegroundColor Cyan
Write-Host "📂 Origen: $SourceFolder" -ForegroundColor Yellow
Write-Host "📂 Destino: $DestFolder" -ForegroundColor Yellow
Write-Host "⚙️  Configuración: Calidad $Quality%, Ancho máximo ${MaxWidth}px" -ForegroundColor Yellow
Write-Host ""

$converted = 0
$errors = 0
$totalFiles = $imageFiles.Count

foreach ($file in $imageFiles) {
    $baseName = [System.IO.Path]::GetFileNameWithoutExtension($file.Name)
    $outputPath = Join-Path $DestFolder "$baseName.jpg"
    
    Write-Progress -Activity "Convirtiendo imágenes" -Status "Procesando: $($file.Name)" -PercentComplete (($converted + $errors) / $totalFiles * 100)
    
    if (Convert-Image -InputPath $file.FullName -OutputPath $outputPath -Quality $Quality -MaxWidth $MaxWidth) {
        $converted++
        Write-Host "✅ $($file.Name) → $baseName.jpg" -ForegroundColor Green
    } else {
        $errors++
    }
}

Write-Progress -Completed -Activity "Conversión completada"

Write-Host ""
Write-Host "🎉 ¡Conversión completada!" -ForegroundColor Yellow
Write-Host "✅ Convertidas exitosamente: $converted imágenes" -ForegroundColor Green
Write-Host "❌ Errores: $errors imágenes" -ForegroundColor Red
Write-Host "📁 Ubicación final: $(Resolve-Path $DestFolder)" -ForegroundColor Cyan

if ($converted -gt 0) {
    Write-Host ""
    Write-Host "💡 Próximos pasos:" -ForegroundColor Yellow
    Write-Host "   1. Verificar las imágenes en la carpeta $DestFolder"
    Write-Host "   2. Actualizar las rutas en products.ts"
    Write-Host "   3. Probar la carga de imágenes en la aplicación"
}