import { createRecipesServiceTestingModule } from './recipes.service.testing-module';
import { mockedGetRecipeResponse } from '../../mocks/get-recipe-response.mock';
import { InternalServerErrorException } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { RecipesService } from '@/recipes/recipes.service';
import { updateRecipeDtoMock } from '../../mocks/update-recipe-dto.mock';
import { UpdateRecipeDto } from '@/recipes/dto/update-recipe.dto';
import { GetRecipeResponse } from '@/recipes/dto/get-recipe-response.dto';

describe('RecipesService - updateRecipe', () => {
  let service: RecipesService;

  beforeEach(async () => {
    const module = await createRecipesServiceTestingModule();
    service = module.get<RecipesService>(RecipesService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should call recipesRepository.updateRecipe with the correct id, updateRecipeDto and userId and return a GetRecipeResponse', async () => {
    // Arrange
    const id = faker.string.uuid();
    const updateRecipeDto: UpdateRecipeDto = updateRecipeDtoMock;
    const userId = faker.string.uuid();
    const result: GetRecipeResponse = mockedGetRecipeResponse;

    // Act
    jest.spyOn(service, 'updateRecipe').mockResolvedValue(result);

    // Assert
    expect(await service.updateRecipe(id, updateRecipeDto, userId)).toEqual(
      result,
    );
    expect(service.updateRecipe).toHaveBeenCalledWith(
      id,
      updateRecipeDto,
      userId,
    );
  });

  it('should throw InternalServerErrorException with error message if recipesRepository.updateRecipe throw an error', async () => {
    // Arrange
    const id = faker.string.uuid();
    const updateRecipeDto: UpdateRecipeDto = mockedGetRecipeResponse;
    const userId = faker.string.uuid();

    // Act
    jest.spyOn(service, 'updateRecipe').mockImplementation(async () => {
      throw new InternalServerErrorException('Error updating recipe');
    });

    // Assert
    await expect(
      service.updateRecipe(id, updateRecipeDto, userId),
    ).rejects.toThrow(InternalServerErrorException);
    expect(service.updateRecipe).toHaveBeenCalledWith(
      id,
      updateRecipeDto,
      userId,
    );
  });
});
