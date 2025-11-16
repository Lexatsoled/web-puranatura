import fs from 'fs';
import path from 'path';

async function generateIcons() {
  const publicDir = path.join(process.cwd(), 'public');
  const logoPath = path.join(publicDir, 'Logo Pureza Naturalis largo.webp');
  const out192 = path.join(publicDir, 'android-chrome-192x192.png');
  const out512 = path.join(publicDir, 'android-chrome-512x512.png');
  const outApple = path.join(publicDir, 'apple-touch-icon.png');

  try {
    if (!fs.existsSync(logoPath)) {
      console.error('Logo base no encontrado:', logoPath);
      process.exit(1);
    }
    const sharp = (await import('sharp')).default;
    const img = sharp(logoPath).flatten({
      background: { r: 255, g: 255, b: 255 },
    });
    await img
      .resize(192, 192, { fit: 'contain' })
      .png({ quality: 90 })
      .toFile(out192);
    await img
      .resize(512, 512, { fit: 'contain' })
      .png({ quality: 90 })
      .toFile(out512);
    await img
      .resize(180, 180, { fit: 'contain' })
      .png({ quality: 90 })
      .toFile(outApple);
    console.log('Iconos PWA generados.');
  } catch (e) {
    console.error('Error generando iconos:', e);
    process.exit(1);
  }
}

generateIcons();
