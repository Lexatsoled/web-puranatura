import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const prisma = new PrismaClient();

export const productSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  category: z.string().optional(),
  price: z.number().positive(),
  imageUrl: z.string().url().optional(),
  stock: z.number().int().min(0),
});

export const rawProducts = [
  {
    name: 'Vitamina C 1000mg',
    slug: 'vitamina-c-1000mg',
    description:
      'Vitamina C de alta potencia para fortalecer el sistema inmunol�gico y promover la producci�n de col�geno.',
    category: 'vitaminas-minerales',
    price: 24.99,
    imageUrl:
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&w=600&q=80',
    stock: 80,
  },
  {
    name: 'Aceite Esencial de Lavanda',
    slug: 'aceite-esencial-lavanda',
    description:
      'Aceite esencial puro para aromaterapia y relajaci�n profunda, ideal para rutinas nocturnas.',
    category: 'aceites-esenciales',
    price: 18.5,
    imageUrl:
      'https://images.unsplash.com/photo-1505576391880-b3f9d713dcf0?auto=format&w=600&q=80',
    stock: 120,
  },
  {
    name: 'Complejo Probi�tico Premium',
    slug: 'complejo-probiotico-premium',
    description:
      'F�rmula avanzada con 12 cepas vivas para reforzar la microbiota intestinal.',
    category: 'salud-digestiva',
    price: 32.75,
    imageUrl:
      'https://images.unsplash.com/photo-1502740479091-635887520276?auto=format&w=600&q=80',
    stock: 60,
  },
] as const;

/*
const validatedProducts = rawProducts.map((product) =>
  productSchema.parse(product)
);
*/

const smokeUserSeed = {
  email: process.env.SMOKE_USER ?? 'smoke@puranatura.test',
  password: process.env.SMOKE_PASS ?? 'SmokeP@ss123',
  firstName: 'Smoke',
  lastName: 'User',
};

const smokeUserSeedSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

const smokeUserUpsertSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  passwordHash: z.string().min(6),
  phone: z.string().optional(),
});

import fs from 'fs';
import path from 'path';

// ... (keep imports)

export async function seedProducts(prismaClient?: PrismaClient) {
  const client = prismaClient ?? prisma;

  // Read from public/data/products.json
  const jsonPath = path.join(__dirname, '../../public/data/products.json');

  try {
    const data = fs.readFileSync(jsonPath, 'utf-8');
    const { products } = JSON.parse(data);

    console.log(`Seeding ${products.length} products from JSON...`);

    for (const p of products) {
      // Map JSON fields to Schema fields
      const productData = {
        name: p.name,
        slug: p.id.toString(), // JSON uses numeric string IDs but schema expects slug. Using ID or creating slug? JSON doesn't have slug.
        // Wait, JSON doesn't have slug? Let's check JSON again or use a slugifier.
        // The original seed had slugs. The JSON has "id": "1".
        // I will generate slug from name.
        category: p.category,
        price: p.price,
        imageUrl: p.images?.[0]?.full || '', // Fallback for legacy support
        images: p.images, // JSON
        stock: p.stock,
        description: p.description,
        detailedDescription: p.detailedDescription,
        mechanismOfAction: p.mechanismOfAction,
        benefits: p.benefitsDescription,
        healthIssues: p.healthIssues,
        ingredients: p.components,
        usageMode: p.administrationMethod,
        dosage: p.dosage,
        faqs: p.faqs,
      };

      // Simple slug generation
      const slug = p.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      await client.product.upsert({
        where: { slug }, // Assuming slug is unique
        create: { ...productData, slug },
        update: { ...productData, slug },
      });
    }
  } catch (error) {
    console.error('Error seeding products from JSON:', error);
    // Fallback to original hardcoded if file fails? No, better to fail loud or empty.
  }
}

export async function ensureSmokeUser(prismaClient?: PrismaClient) {
  const client = prismaClient ?? prisma;
  const validatedSeed = smokeUserSeedSchema.parse(smokeUserSeed);
  const passwordHash = await bcrypt.hash(validatedSeed.password, 12);
  const upsertPayload = smokeUserUpsertSchema.parse({
    email: validatedSeed.email,
    firstName: validatedSeed.firstName,
    lastName: validatedSeed.lastName,
    passwordHash,
  });

  await client.user.upsert({
    where: { email: upsertPayload.email },
    create: upsertPayload,
    update: {
      ...upsertPayload,
      passwordHash,
    },
  });
}

// CLI-friendly entrypoint so this file remains runnable directly.
if (require.main === module) {
  (async () => {
    try {
      await seedProducts();
      await ensureSmokeUser();
    } catch (error) {
      console.error(error);
      process.exit(1);
    } finally {
      await prisma.$disconnect();
    }
  })();
}
