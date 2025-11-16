import { db } from './src/db/client.js';

console.log('🔍 Test directo de consulta SQL:\n');

const result = db.prepare('SELECT * FROM products WHERE id = ?').get(327);

console.log('Resultado completo:', result);
console.log('\nCampo images:');
console.log('- Valor:', result.images);
console.log('- Tipo:', typeof result.images);

if (typeof result.images === 'string') {
  console.log('- JSON parseado:', JSON.parse(result.images));
}
