import { GetRecipeResponse } from 'src/recipes/dto/get-recipe-response';

export const mockedGetRecipeResponse: GetRecipeResponse = {
  id: '1',
  title: 'test',
  description: 'test',
  categoryId: '1',
  preparationTime: 'UP_TO_15_MIN',
  ingredients: [
    {
      id: '1',
      name: 'test',
      recipeId: '1',
    },
  ],
  preparationSteps: [
    {
      id: '1',
      step: 'test',
      recipeId: '1',
    },
  ],
  isPublic: true,
  createdAt: new Date(),
  authorId: '1',
  ratings: [
    {
      id: '1',
      rating: 3,
      userId: '1',
      recipeId: '1',
    },
  ],
};
