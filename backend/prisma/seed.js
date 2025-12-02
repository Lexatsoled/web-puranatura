'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.seedProducts = seedProducts;
exports.ensureSmokeUser = ensureSmokeUser;
const client_1 = require('@prisma/client');
const bcryptjs_1 = __importDefault(require('bcryptjs'));
const zod_1 = require('zod');
const prisma = new client_1.PrismaClient();
const productSchema = zod_1.z.object({
  name: zod_1.z.string().min(1),
  slug: zod_1.z.string().min(1),
  description: zod_1.z.string().optional(),
  category: zod_1.z.string().optional(),
  price: zod_1.z.number().positive(),
  imageUrl: zod_1.z.string().url().optional(),
  stock: zod_1.z.number().int().min(0),
});
const rawProducts = [
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
];
const validatedProducts = rawProducts.map((product) =>
  productSchema.parse(product)
);
const smokeUserSeed = {
  email: process.env.SMOKE_USER ?? 'smoke@puranatura.test',
  password: process.env.SMOKE_PASS ?? 'SmokeP@ss123',
  firstName: 'Smoke',
  lastName: 'User',
};
const smokeUserSeedSchema = zod_1.z.object({
  email: zod_1.z.string().email(),
  password: zod_1.z.string().min(6),
  firstName: zod_1.z.string().min(1),
  lastName: zod_1.z.string().min(1),
});
const smokeUserUpsertSchema = zod_1.z.object({
  email: zod_1.z.string().email(),
  firstName: zod_1.z.string().min(1),
  lastName: zod_1.z.string().min(1),
  passwordHash: zod_1.z.string().min(6),
  phone: zod_1.z.string().optional(),
});
async function seedProducts(prismaClient) {
  const client = prismaClient ?? prisma;
  for (const product of validatedProducts) {
    await client.product.upsert({
      where: { slug: product.slug },
      create: product,
      update: product,
    });
  }
}
async function ensureSmokeUser(prismaClient) {
  const client = prismaClient ?? prisma;
  const validatedSeed = smokeUserSeedSchema.parse(smokeUserSeed);
  const passwordHash = await bcryptjs_1.default.hash(
    validatedSeed.password,
    12
  );
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
//# sourceMappingURL=seed.js.map
