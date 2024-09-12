import { RecipesController } from '@/recipes/recipes.controller';
import { createRecipesControllerTestingModule } from './recipes.controller.testing-module';
import { faker } from '@faker-js/faker';
import { GetRecipeResponse } from '@/recipes/dto/get-recipe-response.dto';
import { mockedGetRecipeResponse } from '../../mocks/get-recipe-response.mock';

describe('RecipeController - getRecipesById', () => {
  let controller: RecipesController;

  beforeEach(async () => {
    const module = await createRecipesControllerTestingModule();
    controller = module.get<RecipesController>(RecipesController);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should call recipesService.getRecipeById with the correct id and return a GetRecipeResponse', async () => {
    // Arrange
    const userId = faker.string.uuid();
    const recipeId = faker.string.uuid();
    const result: GetRecipeResponse = mockedGetRecipeResponse;

    // Act
    jest.spyOn(controller, 'getRecipeById').mockResolvedValue(result);

    // Assert
    expect(await controller.getRecipeById(userId, recipeId)).toBe(result);
    expect(controller.getRecipeById).toHaveBeenCalledWith(userId, recipeId);
  });
});
