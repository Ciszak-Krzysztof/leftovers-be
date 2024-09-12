import { GetRecipeResponse } from '@/recipes/dto/get-recipe-response.dto';
import { mockedGetRecipeResponse } from '../../mocks/get-recipe-response.mock';
import { RecipesService } from '@/recipes/recipes.service';
import { createRecipesServiceTestingModule } from './recipes.service.testing-module';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { faker } from '@faker-js/faker';

describe('getRecipeById', () => {
  let service: RecipesService;

  beforeEach(async () => {
    const module = await createRecipesServiceTestingModule();
    service = module.get<RecipesService>(RecipesService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should call getRecipeById with the correct id and return a GetRecipeResponse', async () => {
    // Arrange
    const userId = faker.string.uuid();
    const id = faker.string.uuid();
    const result: GetRecipeResponse = mockedGetRecipeResponse;

    // Act
    jest.spyOn(service, 'getRecipeById').mockResolvedValue(result);

    // Assert
    expect(await service.getRecipeById(userId, id)).toEqual(result);
    expect(service.getRecipeById).toHaveBeenCalledWith(userId, id);
  });

  it('should throw NotFoundException if no recipe is found', async () => {
    // Arrange
    const userId = faker.string.uuid();
    const id = faker.string.uuid();

    // Act
    jest.spyOn(service, 'getRecipeById').mockImplementation(async () => {
      throw new NotFoundException('Recipe not found');
    });

    // Assert
    await expect(service.getRecipeById(id, userId)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw ForbiddenException if user is not authorized', async () => {
    // Arrange
    const userId = faker.string.uuid();
    const id = faker.string.uuid();

    // Act
    jest.spyOn(service, 'getRecipeById').mockImplementation(async () => {
      throw new ForbiddenException('User is not authorized');
    });

    // Assert
    await expect(service.getRecipeById(id, userId)).rejects.toThrow(
      ForbiddenException,
    );
  });
});
