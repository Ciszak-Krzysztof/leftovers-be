import { RecipesService } from '@/recipes/recipes.service';
import { Test, TestingModule } from '@nestjs/testing';

export const createRecipesServiceTestingModule = async () => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      {
        provide: RecipesService,
        useValue: {
          getRecipes: jest.fn(),
          getRecipeById: jest.fn(),
          addRecipe: jest.fn(),
        },
      },
    ],
  }).compile();

  return module;
};
