import { GetRecipesResponse } from 'src/recipes/dto/get-recipe-response.dto';

export const mockedGetRecipesResponse: GetRecipesResponse = {
  recipes: [
    {
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
    },
    {
      id: '2',
      title: 'test2',
      description: 'test2',
      categoryId: '2',
      preparationTime: 'UP_TO_30_MIN',
      ingredients: [
        {
          id: '2',
          name: 'test2',
          recipeId: '2',
        },
      ],
      preparationSteps: [
        {
          id: '2',
          step: 'test2',
          recipeId: '2',
        },
      ],
      isPublic: false,
      createdAt: new Date(),
      authorId: '2',
      ratings: [
        {
          id: '2',
          rating: 5,
          userId: '2',
          recipeId: '2',
        },
      ],
    },
  ],
};