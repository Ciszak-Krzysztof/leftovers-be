import { GetRecipesQueryParamsDto } from 'src/recipes/dto/get-recipe-query-params.dto';

export const mockedGetRecipesQueryParams: GetRecipesQueryParamsDto = {
  details: 'test',
  categoryIds: ['1'],
  rating: 3,
  startDate: new Date(),
  endDate: new Date(),
  title: 'test',
  description: 'test',
  ingredient: 'test',
  step: 'test',
};
