import { PrismaClient } from '@prisma/client';
import chalk from 'chalk';

const prisma = new PrismaClient();

async function main() {
  console.log(chalk.blue.bold('🔍 Iniciando verificación de mantenimiento de BD...\n'));

  try {
    // 1. Verificar conexión
    await prisma.$connect();
    console.log(chalk.green('✅ Conexión a Base de Datos: EXITOSA'));

    // 2. Métricas básicas
    const userCount = await prisma.user.count();
    const productCount = await prisma.product.count();
    const orderCount = await prisma.order?.count().catch(() => 0) ?? 0; // Handle potential missing model if applicable

    console.log(chalk.cyan.bold('\n📊 Métricas Actuales:'));
    console.log(`   - Usuarios: ${chalk.yellow(userCount)}`);
    console.log(`   - Productos: ${chalk.yellow(productCount)}`);
    console.log(`   - Órdenes:   ${chalk.yellow(orderCount)}`);

    // 3. Verificación de integridad simple (opcional)
    // Aquí se podrían añadir checks más complejos, como buscar huérfanos, etc.
    
    console.log(chalk.green.bold('\n✨ Mantenimiento verificado correctamente.'));
  } catch (error) {
    console.error(chalk.red.bold('\n❌ Error durante el mantenimiento:'));
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
