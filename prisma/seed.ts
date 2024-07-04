import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user1 = await prisma.user.upsert({
    where: { name: 'Seed user1', email: 'user1@email.com' },
    update: {},
    create: {
      name: 'Seed user1',
      email: 'user1@email.com',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { name: 'Seed user2', email: 'user2@email.com' },
    update: {},
    create: {
      name: 'Seed user2',
      email: 'user2@email.com',
    },
  });

  console.log({ user1, user2 });
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });
