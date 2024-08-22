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
      isPublic: false,
      authorId: 'f4f81f5f-ee2a-4dc6-a1af-3d6ad4fc12ca',
    },
  });

  await prisma.ingredient.upsert({
    where: { id: 'f7029d9d-838b-4aac-9dc5-7fa544214459' },
    update: {},
    create: {
      name: 'pasta',
      recipeId: 'f185aa99-6ea1-49f3-8ea4-db9c7f2a1193',
    },
  });

  await prisma.ingredient.upsert({
    where: { id: 'a0d0e8c9-7805-4bf0-aed8-a3b4b0784f9b' },
    update: {},
    create: {
      name: 'cheese',
      recipeId: 'f185aa99-6ea1-49f3-8ea4-db9c7f2a1193',
    },
  });

  await prisma.ingredient.upsert({
    where: { id: '25037f44-5e97-4ee1-8d91-ead705b1a0b8' },
    update: {},
    create: {
      name: 'vegetables',
      recipeId: '702d6186-c595-45a9-ae38-246a3735f327',
    },
  });

  await prisma.preparationStep.upsert({
    where: { id: '455b64d1-5bed-4cef-993b-4fb198c6d382' },
    update: {},
    create: {
      step: 'mix the ingredients',
      recipeId: 'f185aa99-6ea1-49f3-8ea4-db9c7f2a1193',
    },
  });

  await prisma.preparationStep.upsert({
    where: { id: '5c74684b-d3f3-4962-86f9-8be34021a50e' },
    update: {},
    create: {
      step: 'take the pot',
      recipeId: '702d6186-c595-45a9-ae38-246a3735f327',
    },
  });

  await prisma.rating.upsert({
    where: { id: '9cc9abcb-0c37-47bd-bc8b-9a02ac07ccf3' },
    update: {},
    create: {
      rating: 4,
      recipeId: 'f185aa99-6ea1-49f3-8ea4-db9c7f2a1193',
      userId: 'b183b147-238b-4d14-b385-33aa8cc33ee3',
    },
  });

  await prisma.rating.upsert({
    where: { id: '3c77736d-2576-431a-b76b-683189226a05' },
    update: {},
    create: {
      rating: 5,
      recipeId: 'f185aa99-6ea1-49f3-8ea4-db9c7f2a1193',
      userId: 'b183b147-238b-4d14-b385-33aa8cc33ee3',
    },
  });

  await prisma.rating.upsert({
    where: { id: '9bd545c8-37c0-49c6-9c72-ec28dca1d47c' },
    update: {},
    create: {
      rating: 3,
      recipeId: '702d6186-c595-45a9-ae38-246a3735f327',
      userId: 'b183b147-238b-4d14-b385-33aa8cc33ee3',
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
