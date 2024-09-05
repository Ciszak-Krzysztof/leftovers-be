import { GetRecipesQueryParamsDto } from '@/recipes/dto/get-recipe-query-params.dto';
import { faker } from '@faker-js/faker';

export const mockedGetRecipesQueryParams: GetRecipesQueryParamsDto = {
  details: 'true',
  categoryIds: ['1'],
  rating: 3,
  startDate: new Date(),
  endDate: new Date(),
  title: faker.lorem.word(),
  description: faker.lorem.words({ min: 3, max: 5 }),
  ingredient: faker.lorem.word(),
  step: faker.lorem.word(),
};
