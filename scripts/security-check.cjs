const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔒 Auditando seguridad del proyecto...');

const errors = [];
const warnings = [];

// 1. Verificar .env.production.example
const envProdExample = path.join(__dirname, '..', '.env.production.example');
if (!fs.existsSync(envProdExample)) {
  warnings.push('Falta .env.production.example');
}

// 2. Verificar dependencias vulnerables
try {
  console.log('📦 Ejecutando npm audit...');
  execSync('npm audit --audit-level=high', { stdio: 'inherit' });
} catch (_e) {
  errors.push(
    'Vulnerabilidades ALTAS encontradas en dependencias (npm audit).'
  );
}

// 3. Verificar configuración de docker por defecto
const dockerFile = path.join(__dirname, '..', 'docker-compose.yml');
if (fs.existsSync(dockerFile)) {
  const content = fs.readFileSync(dockerFile, 'utf8');
  if (content.includes('POSTGRES_PASSWORD: password')) {
    warnings.push(
      'docker-compose.yml usa "password" como default. Asegurese de usar variables de entorno en producción.'
    );
  }
}

// Reports
console.log('\n📊 Resumen de Seguridad:');
if (errors.length > 0) {
  console.error('❌ ERRORES CRÍTICOS:');
  errors.forEach((e) => console.error(`  - ${e}`));
  process.exit(1);
} else {
  console.log('✅ No se encontraron errores críticos directos.');
}

if (warnings.length > 0) {
  console.warn('⚠️ ADVERTENCIAS:');
  warnings.forEach((w) => console.warn(`  - ${w}`));
}
