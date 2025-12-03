import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const prisma = new PrismaClient();

const productSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  category: z.string().optional(),
  price: z.number().positive(),
  imageUrl: z.string().url().optional(),
  stock: z.number().int().min(0),
});

const rawProducts = [
  {
    name: 'Vitamina C 1000mg',
    slug: 'vitamina-c-1000mg',
    description:
      'Vitamina C de alta potencia para fortalecer el sistema inmunológico y promover la producción de colágeno.',
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
      'Aceite esencial puro para aromaterapia y relajación profunda, ideal para rutinas nocturnas.',
    category: 'aceites-esenciales',
    price: 18.5,
    imageUrl:
      'https://images.unsplash.com/photo-1505576391880-b3f9d713dcf0?auto=format&w=600&q=80',
    stock: 120,
  },
  {
    name: 'Complejo Probiótico Premium',
    slug: 'complejo-probiotico-premium',
    description:
      'Fórmula avanzada con 12 cepas vivas para reforzar la microbiota intestinal.',
    category: 'salud-digestiva',
    price: 32.75,
    imageUrl:
      'https://images.unsplash.com/photo-1502740479091-635887520276?auto=format&w=600&q=80',
    stock: 60,
  },
] as const;

const validatedProducts = rawProducts.map((product) =>
  productSchema.parse(product)
);

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

export async function seedProducts(prismaClient?: PrismaClient) {
  const client = prismaClient ?? prisma;
  for (const product of validatedProducts) {
    await client.product.upsert({
      where: { slug: product.slug },
      create: product,
      update: product,
    });
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

// Keep a CLI-friendly entrypoint so this file remains runnable directly in the backend project.
if (require.main === module) {
  (async () => {
    try {
      await seedProducts();
      await ensureSmokeUser();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      process.exit(1);
    } finally {
      await prisma.$disconnect();
    }
  })();
}
