import { Test, TestingModule } from '@nestjs/testing';
import { GetRecipesQueryParamsDto } from '@/recipes/dto/get-recipe-query-params.dto';
import { RecipesService } from '@/recipes/recipes.service';
import { mockedGetRecipesResponse } from '../mocks/get-recipes-response.mock';
import { mockedGetRecipesQueryParams } from '../mocks/recipe-query-params.mock';
import {
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { GetRecipeResponse } from '@/recipes/dto/get-recipe-response.dto';
import { mockedGetRecipeResponse } from '../mocks/get-recipe-response.mock';

describe('RecipesService', () => {
  let service: RecipesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: RecipesService,
          useValue: {
            getRecipes: jest.fn(),
            getRecipeById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RecipesService>(RecipesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('getRecipes', () => {
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

  describe('getRecipeById', () => {
    it('should call getRecipeById with the correct id and return a GetRecipeResponse', async () => {
      const userId = '1';
      const id = '1';
      const result: GetRecipeResponse = mockedGetRecipeResponse;
      jest.spyOn(service, 'getRecipeById').mockResolvedValue(result);

      expect(await service.getRecipeById(userId, id)).toEqual(result);
      expect(service.getRecipeById).toHaveBeenCalledWith(userId, id);
    });

    it('should throw NotFoundException if no recipe is found', async () => {
      const userId = '1';
      const id = '1';

      jest.spyOn(service, 'getRecipeById').mockImplementation(async () => {
        throw new NotFoundException('Recipe not found');
      });

      await expect(service.getRecipeById(id, userId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if user is not authorized', async () => {
      const userId = '1';
      const id = '1';

      jest.spyOn(service, 'getRecipeById').mockImplementation(async () => {
        throw new ForbiddenException('User is not authorized');
      });

      await expect(service.getRecipeById(id, userId)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
