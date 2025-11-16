import Database from 'better-sqlite3';

const db = new Database('./database.sqlite');

const total = db.prepare('SELECT COUNT(*) as count FROM products').get();
console.log('📊 ANÁLISIS DE COMPLETITUD DE DATOS\n');
console.log(`Total productos en BD: ${total.count}`);

const withDetailed = db.prepare(
  `SELECT COUNT(*) as count FROM products 
   WHERE detailed_description IS NOT NULL 
   AND detailed_description != ''`
).get();

const withMechanism = db.prepare(
  `SELECT COUNT(*) as count FROM products 
   WHERE mechanism_of_action IS NOT NULL 
   AND mechanism_of_action != ''`
).get();

const withComponents = db.prepare(
  `SELECT COUNT(*) as count FROM products 
   WHERE components IS NOT NULL 
   AND components != '[]'`
).get();

const withFaqs = db.prepare(
  `SELECT COUNT(*) as count FROM products 
   WHERE faqs IS NOT NULL 
   AND faqs != '[]'`
).get();

console.log(`\n✅ Con detailed_description: ${withDetailed.count}/${total.count}`);
console.log(`✅ Con mechanism_of_action: ${withMechanism.count}/${total.count}`);
console.log(`✅ Con components: ${withComponents.count}/${total.count}`);
console.log(`✅ Con faqs: ${withFaqs.count}/${total.count}`);

// Productos con las 5 subsecciones COMPLETAS
const complete = db.prepare(
  `SELECT COUNT(*) as count FROM products 
   WHERE detailed_description IS NOT NULL AND detailed_description != ''
   AND mechanism_of_action IS NOT NULL AND mechanism_of_action != ''
   AND components IS NOT NULL AND components != '[]'
   AND faqs IS NOT NULL AND faqs != '[]'`
).get();

console.log(`\n🎯 Productos con las 5 subsecciones COMPLETAS: ${complete.count}/${total.count}`);

// Mostrar algunos ejemplos de productos incompletos
const incomplete = db.prepare(
  `SELECT id, name, 
   CASE WHEN detailed_description IS NULL OR detailed_description = '' THEN 'NO' ELSE 'SI' END as has_detailed,
   CASE WHEN mechanism_of_action IS NULL OR mechanism_of_action = '' THEN 'NO' ELSE 'SI' END as has_mechanism,
   CASE WHEN components IS NULL OR components = '[]' THEN 'NO' ELSE 'SI' END as has_components,
   CASE WHEN faqs IS NULL OR faqs = '[]' THEN 'NO' ELSE 'SI' END as has_faqs
   FROM products
   WHERE NOT (
     detailed_description IS NOT NULL AND detailed_description != ''
     AND mechanism_of_action IS NOT NULL AND mechanism_of_action != ''
     AND components IS NOT NULL AND components != '[]'
     AND faqs IS NOT NULL AND faqs != '[]'
   )
   LIMIT 10`
).all();

if (incomplete.length > 0) {
  console.log(`\n⚠️ Ejemplos de productos INCOMPLETOS (primeros 10):`);
  incomplete.forEach(p => {
    console.log(`  ID ${p.id}: ${p.name}`);
    console.log(`    - Descripción detallada: ${p.has_detailed}`);
    console.log(`    - Mecanismo de acción: ${p.has_mechanism}`);
    console.log(`    - Componentes: ${p.has_components}`);
    console.log(`    - FAQs: ${p.has_faqs}`);
  });
}

db.close();
console.log('\n✨ Análisis completado');
