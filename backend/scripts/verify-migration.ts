
import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Verifying DB Migration for RefreshTokens...');
  
  // 1. Ensure a user exists
  const email = 'test-migration@example.com';
  let user = await prisma.user.findUnique({ where: { email } });
  
  if (!user) {
    console.log('Creating test user...');
    user = await prisma.user.create({
      data: {
        email,
        passwordHash: 'placeholder',
        firstName: 'Test',
        lastName: 'Migration'
      }
    });
  }

  // 2. Test RefreshToken creation (Login simulation)
  const jti = randomUUID();
  console.log('Testing create token with JTI:', jti);
  
  const token = await prisma.refreshToken.create({
    data: {
      jti,
      userId: user.id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60) // 1 hour
    }
  });

  if (!token) throw new Error('Failed to create token');
  console.log('✅ Token created successfully');

  // 3. Test Read
  const found = await prisma.refreshToken.findUnique({ where: { jti } });
  if (!found) throw new Error('Failed to read token');
  console.log('✅ Token read successfully');

  // 4. Test Delete (Logout simulation)
  await prisma.refreshToken.delete({ where: { jti } });
  const check = await prisma.refreshToken.findUnique({ where: { jti } });
  if (check) throw new Error('Failed to delete token');
  console.log('✅ Token deleted successfully');

  console.log('🎉 MIGRATION VERIFIED: DB Connection and RefreshToken table are working.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
