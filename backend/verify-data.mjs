import Database from 'better-sqlite3';

const db = new Database('./database.sqlite');

console.log('📊 VERIFICACIÓN COMPLETA DE LA BASE DE DATOS\n');

// Tablas
console.log('=== TABLAS ===');
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name").all();
tables.forEach(t => console.log('  ✅', t.name));

// Productos
console.log('\n=== PRODUCTOS ===');
const prodCount = db.prepare('SELECT COUNT(*) as count FROM products').get();
console.log('  Total productos:', prodCount.count);

const withComplete = db.prepare(`
  SELECT COUNT(*) as count FROM products 
  WHERE detailed_description IS NOT NULL AND detailed_description != ''
  AND mechanism_of_action IS NOT NULL AND mechanism_of_action != ''
  AND components IS NOT NULL AND components != '[]'
  AND faqs IS NOT NULL AND faqs != '[]'
`).get();
console.log('  Con 5 subsecciones completas:', withComplete.count);

const withBasic = db.prepare(`
  SELECT COUNT(*) as count FROM products 
  WHERE detailed_description IS NULL OR detailed_description = ''
`).get();
console.log('  Productos básicos (sin subsecciones):', withBasic.count);

// Usuarios
console.log('\n=== USUARIOS ===');
const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
console.log('  Total usuarios:', userCount.count);
const users = db.prepare('SELECT id, email, name, created_at FROM users').all();
users.forEach(u => console.log('    -', u.email, '(', u.name, ')'));

// Estructura
console.log('\n=== ESTRUCTURA TABLA PRODUCTS ===');
const columns = db.prepare('PRAGMA table_info(products)').all();
console.log('  Total columnas:', columns.length);

const critical = [
  'detailed_description',
  'mechanism_of_action', 
  'benefits_description',
  'health_issues',
  'components',
  'dosage',
  'administration_method',
  'faqs',
  'scientific_references'
];

console.log('\n  Columnas críticas (5 subsecciones):');
critical.forEach(col => {
  const exists = columns.find(c => c.name === col);
  console.log('    ' + (exists ? '✅' : '❌'), col);
});

// Muestra
console.log('\n=== MUESTRA DE DATOS ===');
const sample = db.prepare(`
  SELECT id, name, price, stock, 
  LENGTH(detailed_description) as desc_len,
  LENGTH(mechanism_of_action) as mech_len,
  LENGTH(components) as comp_len,
  LENGTH(faqs) as faqs_len
  FROM products 
  WHERE detailed_description IS NOT NULL 
  LIMIT 5
`).all();

console.log('  Primeros 5 productos con subsecciones completas:');
sample.forEach(p => {
  console.log(`    ID ${p.id}: ${p.name}`);
  console.log(`      - Precio: €${p.price} | Stock: ${p.stock}`);
  console.log(`      - Descripción: ${p.desc_len} chars`);
  console.log(`      - Mecanismo: ${p.mech_len} chars`);
  console.log(`      - Componentes: ${p.comp_len} chars`);
  console.log(`      - FAQs: ${p.faqs_len} chars`);
});

// Categorías
console.log('\n=== DISTRIBUCIÓN POR CATEGORÍAS ===');
const categories = db.prepare(`
  SELECT category, COUNT(*) as count 
  FROM products 
  GROUP BY category 
  ORDER BY count DESC
`).all();
categories.forEach(c => console.log(`  ${c.category}: ${c.count} productos`));

db.close();
console.log('\n✨ Verificación completada');
