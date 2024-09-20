import { faker } from '@faker-js/faker';
import { PreparationTime } from '@prisma/client';

export const updateRecipeDtoMock = {
  title: faker.lorem.word(),
  description: faker.lorem.sentences(),
  categoryId: faker.string.uuid(),
  preparationTime: PreparationTime.UP_TO_15_MIN,
  ingredients: [
    {
      id: faker.string.uuid(),
      name: faker.lorem.word(),
      recipeId: faker.string.uuid(),
    },
  ],
  preparationSteps: [
    {
      id: faker.string.uuid(),
      step: faker.lorem.sentence(),
      recipeId: faker.string.uuid(),
    },
  ],
  numberOfServings: faker.number.int({ min: 1, max: 4 }),
  isPublic: faker.datatype.boolean(),
};
