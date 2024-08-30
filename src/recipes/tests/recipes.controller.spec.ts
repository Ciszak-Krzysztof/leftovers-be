import { Test, TestingModule } from '@nestjs/testing';
import { RecipesController } from '../recipes.controller';
import { RecipesService } from '../recipes.service';
import { GetRecipesQueryParamsDto } from '../dto/get-recipe-query-params.dto';
import {
  GetRecipeResponse,
  GetRecipesResponse,
} from '../dto/get-recipe-response';
import { mockedGetRecipeResponse } from './mocks/get-recipe-response.mock';
import { mockedGetRecipesResponse } from './mocks/get-recipes-response.mock';
import { mockedGetRecipesQueryParams } from './mocks/recipe-query-params.mock';

describe('RecipesController', () => {
  let controller: RecipesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecipesController],
      providers: [
        {
          provide: RecipesService,
          useValue: { getRecipes: jest.fn(), getRecipeById: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<RecipesController>(RecipesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getRecipes', () => {
    it('should call recipesService.getRecipes with the correct arguments and return a GetRecipesResponse', async () => {
      const userId = '1';
      const queryParams: GetRecipesQueryParamsDto = mockedGetRecipesQueryParams;
      const result: GetRecipesResponse = mockedGetRecipesResponse;
      jest.spyOn(controller, 'getRecipes').mockResolvedValue(result);

      expect(await controller.getRecipes(userId, queryParams)).toBe(result);
      expect(controller.getRecipes).toHaveBeenCalledWith(userId, queryParams);
    });
  });

  describe('getRecipeById', () => {
    it('should call recipesService.getRecipeById with the correct id and return a GetRecipeResponse', async () => {
      const userId = '1';
      const recipeId = '1';
      const result: GetRecipeResponse = mockedGetRecipeResponse;
      jest.spyOn(controller, 'getRecipeById').mockResolvedValue(result);

      expect(await controller.getRecipeById(userId, recipeId)).toBe(result);
      expect(controller.getRecipeById).toHaveBeenCalledWith(userId, recipeId);
    });
  });
});
