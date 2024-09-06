import { RecipesService } from '@/recipes/recipes.service';
import { createRecipesServiceTestingModule } from './recipes.service.testing-module';
import { GetRecipesQueryParamsDto } from '@/recipes/dto/get-recipe-query-params.dto';
import { mockedGetRecipesQueryParams } from '../../mocks/recipe-query-params.mock';
import { mockedGetRecipesResponse } from '../../mocks/get-recipes-response.mock';
import { ForbiddenException } from '@nestjs/common';

describe('RecipeService - getRecipes', () => {
  let service: RecipesService;

  beforeEach(async () => {
    const module = await createRecipesServiceTestingModule();
    service = module.get<RecipesService>(RecipesService);
  });

  it('should call getRecipes with the correct userId and queryParams and return an array of GetRecipeResponse', async () => {
    const userId = '1';
    const queryParams: GetRecipesQueryParamsDto = mockedGetRecipesQueryParams;

    const result = mockedGetRecipesResponse;
    jest.spyOn(service, 'getRecipes').mockResolvedValue(result);

    expect(await service.getRecipes(userId, queryParams)).toEqual(result);
    expect(service.getRecipes).toHaveBeenCalledWith(userId, queryParams);
  });

  it('should throw ForbiddenException if user is not authorized', async () => {
    const userId = '1';
    const queryParams: GetRecipesQueryParamsDto = mockedGetRecipesQueryParams;

    jest.spyOn(service, 'getRecipes').mockImplementation(async () => {
      throw new ForbiddenException('User is not authorized');
    });

    await expect(service.getRecipes(userId, queryParams)).rejects.toThrow(
      ForbiddenException,
    );
  });
});
