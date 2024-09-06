import { RecipesService } from '@/recipes/recipes.service';
import { createRecipesServiceTestingModule } from './recipes.service.testing-module';
import { AddRecipeDto } from '@/recipes/dto/add-recipe.dto';
import { addRecipeDtoMock } from '../../mocks/add-recipe-dto.mock';
import { mockedGetRecipeResponse } from '../../mocks/get-recipe-response.mock';
import { GetRecipeResponse } from '@/recipes/dto/get-recipe-response.dto';
import { InternalServerErrorException } from '@nestjs/common';

describe('getRecipeById', () => {
  let service: RecipesService;

  beforeEach(async () => {
    const module = await createRecipesServiceTestingModule();
    service = module.get<RecipesService>(RecipesService);
  });

  it('should call recipesRepository.addRecipe with the correct authorId and addRecipeDto and return a GetRecipeResponse', async () => {
    const authorId = '1';
    const addRecipeDto: AddRecipeDto = addRecipeDtoMock;

    const result: GetRecipeResponse = mockedGetRecipeResponse;

    jest.spyOn(service, 'addRecipe').mockResolvedValue(result);

    expect(await service.addRecipe(authorId, addRecipeDto)).toEqual(result);
    expect(service.addRecipe).toHaveBeenCalledWith(authorId, addRecipeDto);
  });

  it('should throw InternalServerErrorException with error message if recipesRepository.addRecipe throw an error', async () => {
    const authorId = '1';
    const addRecipeDto: AddRecipeDto = addRecipeDtoMock;

    jest.spyOn(service, 'addRecipe').mockImplementation(async () => {
      throw new InternalServerErrorException('Error adding recipe to database');
    });

    await expect(service.addRecipe(authorId, addRecipeDto)).rejects.toThrow(
      InternalServerErrorException,
    );

    expect(service.addRecipe).toHaveBeenCalledWith(authorId, addRecipeDto);
  });
});
