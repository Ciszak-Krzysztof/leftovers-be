import { RecipesController } from '@/recipes/recipes.controller';
import { createRecipesControllerTestingModule } from './recipes.controller.testing-module';
import { faker } from '@faker-js/faker';
import { GetRecipesQueryParamsDto } from '@/recipes/dto/get-recipe-query-params.dto';
import { mockedGetRecipesQueryParams } from '../../mocks/recipe-query-params.mock';
import { mockedGetRecipesResponse } from '../../mocks/get-recipes-response.mock';
import { GetRecipesResponse } from '@/recipes/dto/get-recipe-response.dto';

describe('RecipeController - getRecipes', () => {
  let controller: RecipesController;

  beforeEach(async () => {
    const module = await createRecipesControllerTestingModule();
    controller = module.get<RecipesController>(RecipesController);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should call recipesService.getRecipes with the correct arguments and return a GetRecipesResponse', async () => {
    // Arrange
    const userId = faker.string.uuid();
    const queryParams: GetRecipesQueryParamsDto = mockedGetRecipesQueryParams;
    const result: GetRecipesResponse = mockedGetRecipesResponse;

    // Act
    jest.spyOn(controller, 'getRecipes').mockResolvedValue(result);

    // Assert
    expect(await controller.getRecipes(userId, queryParams)).toBe(result);
    expect(controller.getRecipes).toHaveBeenCalledWith(userId, queryParams);
  });
});
