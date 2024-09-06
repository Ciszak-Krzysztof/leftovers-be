import { GetRecipeResponse } from '@/recipes/dto/get-recipe-response.dto';
import { mockedGetRecipeResponse } from '../../mocks/get-recipe-response.mock';
import { RecipesService } from '@/recipes/recipes.service';
import { createRecipesServiceTestingModule } from './recipes.service.testing-module';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('getRecipeById', () => {
  let service: RecipesService;

  beforeEach(async () => {
    const module = await createRecipesServiceTestingModule();
    service = module.get<RecipesService>(RecipesService);
  });

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
