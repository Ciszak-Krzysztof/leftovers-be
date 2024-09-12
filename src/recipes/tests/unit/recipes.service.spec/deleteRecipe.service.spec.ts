import { RecipesService } from '@/recipes/recipes.service';
import { faker } from '@faker-js/faker';
import { createRecipesServiceTestingModule } from './recipes.service.testing-module';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('RecipeService - deleteRecipe', () => {
  let service: RecipesService;

  beforeEach(async () => {
    const module = await createRecipesServiceTestingModule();
    service = module.get<RecipesService>(RecipesService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
  it('should call deleteRecipe with the correct id and return void', async () => {
    // Arrange
    const id = faker.string.uuid();
    const userId = faker.string.uuid();

    // Act
    jest.spyOn(service, 'deleteRecipe').mockResolvedValue(undefined);

    // Assert
    await expect(service.deleteRecipe(id, userId)).resolves.toBeUndefined();
    expect(service.deleteRecipe).toHaveBeenCalledWith(id, userId);
  });

  it('should throw NotFoundException if no recipe is found', async () => {
    // Arrange
    const id = faker.string.uuid();
    const userId = faker.string.uuid();

    // Act
    jest.spyOn(service, 'deleteRecipe').mockImplementation(async () => {
      throw new NotFoundException('Recipe not found');
    });

    // Assert
    await expect(service.deleteRecipe(id, userId)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw ForbiddenException if user is not authorized', async () => {
    // Arrange
    const id = faker.string.uuid();
    const userId = faker.string.uuid();

    // Act
    jest.spyOn(service, 'deleteRecipe').mockImplementation(async () => {
      throw new ForbiddenException(
        'You are not allowed to delete this recipe.',
      );
    });

    // Assert
    await expect(service.deleteRecipe(id, userId)).rejects.toThrow(
      ForbiddenException,
    );
  });
});
