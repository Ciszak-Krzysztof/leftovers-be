import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { name: 'Seed user1', email: 'user1@email.com' },
    update: {},
    create: {
      name: 'Seed user1',
      email: 'user1@email.com',
    },
  });

  await prisma.user.upsert({
    where: { name: 'Seed user2', email: 'user2@email.com' },
    update: {},
    create: {
      name: 'Seed user2',
      email: 'user2@email.com',
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
