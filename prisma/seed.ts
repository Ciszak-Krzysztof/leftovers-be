import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { email: 'user1@email.com' },
    update: {},
    create: {
      password: 'password',
      email: 'user1@email.com',
    },
  });

  await prisma.user.upsert({
    where: { email: 'user2@email.com' },
    update: {},
    create: {
      password: 'password',
      email: 'user2@email.com',
    },
  });

  await prisma.category.upsert({
    where: { name: 'Lunch' },
    update: {},
    create: {
      name: 'Lunch',
    },
  });

  await prisma.category.upsert({
    where: { name: 'Baking' },
    update: {},
    create: {
      name: 'Baking',
    },
  });

  await prisma.recipe.upsert({
    where: { id: 'f185aa99-6ea1-49f3-8ea4-db9c7f2a1193' },
    update: {},
    create: {
      title: 'Example recipe',
      description: 'Example recipe description',
      categoryId: 'ea923918-bec5-4e3b-9753-c6405e90f773',
      preparationTime: 'UP_TO_15_MIN',
      ingredients: ['ing1', 'ing2'],
      preparationSteps: ['prep1', 'prep2'],
      isPublic: false,
      authorId: 'f4f81f5f-ee2a-4dc6-a1af-3d6ad4fc12ca',
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
