import { db, sqlite } from './client';
import { users, products } from './schema';
import bcrypt from 'bcrypt';

// TODO: Importar productos del frontend
// NOTA: Ajustar la ruta según la ubicación real del archivo
// Si este script se ejecuta desde backend/, la ruta correcta es:
// import { products as frontendProducts } from '../../src/data/products';

// TODO: Función para cargar usuario de prueba
async function seedUsers() {
  console.log('👤 Creando usuario de prueba...');
  
  const testUser = {
    email: 'test@example.com',
    password_hash: await bcrypt.hash('test123', 12),
    name: 'Usuario de Prueba'
  };

  try {
    await db.insert(users).values(testUser).onConflictDoNothing();
    console.log('✅ Usuario de prueba creado: test@example.com / test123');
  } catch (error) {
    console.log('ℹ️  Usuario de prueba ya existe');
  }
}

// TODO: Función para cargar productos
async function seedProducts() {
  console.log('📦 Cargando productos...');
  
  // IMPORTANTE: Descomentar y ajustar cuando se implemente
  /*
  const productsToInsert = frontendProducts.map(product => ({
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock || 100, // Stock por defecto
    category: product.category,
    subcategory: product.subcategory || null,
    images: product.images || [],
    benefits: product.benefits || [],
    ingredients: product.ingredients || [],
    usage: product.usage || null,
    warnings: product.warnings || null,
    rating: product.rating || 0,
    reviews_count: product.reviewsCount || 0
  }));

  await db.insert(products).values(productsToInsert).onConflictDoNothing();
  console.log(`✅ ${productsToInsert.length} productos cargados`);
  */

  // TEMPORAL: Productos de ejemplo para validar estructura
  const exampleProducts = [
    {
      name: 'Producto de Prueba 1',
      description: 'Descripción de prueba',
      price: 29.99,
      stock: 100,
      category: 'Suplementos',
      subcategory: 'Vitaminas',
      images: ['https://via.placeholder.com/400'],
      benefits: ['Beneficio 1', 'Beneficio 2'],
      ingredients: ['Ingrediente 1', 'Ingrediente 2'],
      usage: 'Tomar 1 cápsula al día',
      warnings: 'Consultar con médico',
      rating: 4.5,
      reviews_count: 10
    },
    {
      name: 'Producto de Prueba 2',
      description: 'Otra descripción',
      price: 39.99,
      stock: 50,
      category: 'Hierbas',
      subcategory: null,
      images: ['https://via.placeholder.com/400'],
      benefits: ['Beneficio A'],
      ingredients: ['Ingrediente A'],
      usage: 'Uso tópico',
      warnings: null,
      rating: 4.0,
      reviews_count: 5
    }
  ];

  try {
    await db.insert(products).values(exampleProducts).onConflictDoNothing();
    console.log('✅ Productos de ejemplo cargados (reemplazar con datos reales)');
  } catch (error) {
    console.log('ℹ️  Productos ya existen');
  }
}

// TODO: Ejecutar seed completo
async function runSeed() {
  try {
    await seedUsers();
    await seedProducts();
    console.log('\n✅ Seed completado exitosamente');
  } catch (error) {
    console.error('❌ Error en seed:', error);
    throw error;
  } finally {
    sqlite.close();
  }
}

// TODO: Ejecutar si se llama directamente
runSeed();
