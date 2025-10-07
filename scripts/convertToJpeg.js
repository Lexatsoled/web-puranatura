const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Configuración
const inputDir = 'Imagenes Piping Rock';
const outputDir = 'public/Jpeg';
const quality = 85; // Calidad JPEG (85 es un buen balance)
const maxWidth = 800; // Ancho máximo para optimizar

// Crear directorio de salida si no existe
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

async function convertImages() {
    try {
        const files = fs.readdirSync(inputDir);
        console.log(`📸 Encontradas ${files.length} imágenes para convertir...`);
        
        let converted = 0;
        let errors = 0;
        
        for (const file of files) {
            const inputPath = path.join(inputDir, file);
            const ext = path.extname(file).toLowerCase();
            
            // Solo procesar archivos de imagen
            if (['.webp', '.avif', '.png', '.jpg', '.jpeg'].includes(ext)) {
                const baseName = path.basename(file, ext);
                const outputPath = path.join(outputDir, `${baseName}.jpg`);
                
                try {
                    await sharp(inputPath)
                        .resize(maxWidth, null, {
                            withoutEnlargement: true,
                            fit: 'inside'
                        })
                        .jpeg({ 
                            quality: quality,
                            progressive: true,
                            mozjpeg: true
                        })
                        .toFile(outputPath);
                    
                    converted++;
                    console.log(`✅ Convertido: ${file} → ${baseName}.jpg`);
                    
                } catch (error) {
                    errors++;
                    console.error(`❌ Error convirtiendo ${file}:`, error.message);
                }
            }
        }
        
        console.log(`\n🎉 Conversión completada!`);
        console.log(`✅ Convertidas: ${converted} imágenes`);
        console.log(`❌ Errores: ${errors} imágenes`);
        console.log(`📁 Ubicación: ${path.resolve(outputDir)}`);
        
    } catch (error) {
        console.error('💥 Error general:', error);
    }
}

// Ejecutar conversión
convertImages();