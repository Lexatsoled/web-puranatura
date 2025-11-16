import { db, sqlite } from './client.js';
import { users, products } from './schema.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { products as frontendProducts } from './products-data.js';

async function seedUsers() {
  console.log('[seed] Creando usuario de prueba...');

  // Generar contraseña aleatoria segura para desarrollo
  const randomPassword = crypto.randomBytes(16).toString('hex');
  console.log('[seed] ⚠️  CONTRASEÑA GENERADA PARA USUARIO DE PRUEBA:', randomPassword);

  const testUser = {
    email: 'test@example.com',
    password_hash: await bcrypt.hash(randomPassword, 12),
    name: 'Usuario de Prueba'
  };

  try {
    await db.insert(users).values(testUser).onConflictDoNothing();
    console.log('[seed] ✅ Usuario de prueba creado: test@example.com');
    console.log('[seed] 📝 Credenciales válidas SOLO para desarrollo');
  } catch (error) {
    console.log('[seed] Usuario de prueba ya existe');
  }
}

async function seedProducts() {
  console.log('[seed] Verificando productos existentes...');
  
  const existingProducts = await db.select().from(products).limit(1);
  if (existingProducts.length > 0) {
    console.log('[seed] 🗑️  Eliminando productos existentes para cargar todos los productos...');
    await db.delete(products);
  }
  
  console.log('[seed] Cargando productos desde products-data.ts...');
  
  const productsToInsert = frontendProducts.map((product, index) => {
    const images =
      Array.isArray(product.images) && product.images.length > 0
        ? product.images
            .map((image) => {
              if (!image) return null;
              if (typeof image === 'string') return image;
              if (typeof image.full === 'string') return image.full;
              if (typeof image.thumbnail === 'string') return image.thumbnail;
              return null;
            })
            .filter((value): value is string => Boolean(value))
        : [];

    const warnings = Array.isArray((product as { warnings?: string[] }).warnings)
      ? ((product as { warnings?: string[] }).warnings ?? []).join('; ')
      : (product as { warnings?: string }).warnings ?? null;

    const priceNote = Array.isArray(product.priceNote)
      ? product.priceNote.join(' | ')
      : (product.priceNote as string | undefined) ?? null;

    const rating = Number((4.5 + ((index % 5) * 0.1)).toFixed(1));
    const reviewsCount = 120 + index * 3;

    return {
      name: product.name,
      description: product.description,
      price: product.price,
      compare_at_price: product.price * 1.1,
      stock: product.stock ?? 100,
      category: product.categories?.[0] ?? 'general',
      subcategory: product.categories?.[1] ?? null,
      categories: product.categories ?? [],
      sku: product.sku ?? null,
      is_featured: index < 12,
      images,
      benefits: [],
      ingredients: [],
      usage: null,
      dosage: product.dosage ?? null,
      administration_method: product.administrationMethod ?? null,
      warnings,
      rating,
      reviews_count: reviewsCount,
      detailed_description: product.detailedDescription ?? null,
      mechanism_of_action: product.mechanismOfAction ?? null,
      benefits_description: product.benefitsDescription ?? [],
      health_issues: product.healthIssues ?? [],
      components: product.components ?? [],
      faqs: product.faqs ?? [],
      scientific_references: [],
      tags: product.tags ?? [],
      price_note: priceNote
    };
  });

  await db.insert(products).values(productsToInsert).onConflictDoNothing();
  console.log(`[seed] ✅ ${productsToInsert.length} productos cargados con las 5 subsecciones completas`);
}

async function runSeed() {
  try {
    await seedUsers();
    await seedProducts();
    console.log('\n[seed] Seed completado correctamente');
  } catch (error) {
    console.error('[seed] Error durante el seed:', error);
    throw error;
  } finally {
    sqlite.close();
  }
}

runSeed();
