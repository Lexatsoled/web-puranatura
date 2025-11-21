import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const products = [
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
];

async function main() {
  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      create: product,
      update: product,
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
