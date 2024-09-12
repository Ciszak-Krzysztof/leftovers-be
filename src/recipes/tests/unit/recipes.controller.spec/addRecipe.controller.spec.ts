import { RecipesController } from '@/recipes/recipes.controller';
import { createRecipesControllerTestingModule } from './recipes.controller.testing-module';
import { faker } from '@faker-js/faker';
import { GetRecipeResponse } from '@/recipes/dto/get-recipe-response.dto';
import { mockedGetRecipeResponse } from '../../mocks/get-recipe-response.mock';
import { addRecipeDtoMock } from '../../mocks/add-recipe-dto.mock';
import { InternalServerErrorException } from '@nestjs/common';

describe('RecipeController - addRecipe', () => {
  let controller: RecipesController;

  beforeEach(async () => {
    const module = await createRecipesControllerTestingModule();
    controller = module.get<RecipesController>(RecipesController);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should call addRecipe with the correct authorId and addRecipeDto and return a GetRecipeResponse', async () => {
    // Arrange
    const authorId = faker.string.uuid();
    const addRecipeDto = addRecipeDtoMock;
    const result: GetRecipeResponse = mockedGetRecipeResponse;

    // Act
    jest.spyOn(controller, 'addRecipe').mockResolvedValue(result);

    // Assert
    expect(await controller.addRecipe(authorId, addRecipeDto)).toEqual(result);
    expect(controller.addRecipe).toHaveBeenCalledWith(authorId, addRecipeDto);
  });

  it('should throw InternalServerErrorException if addRecipe throws an error', async () => {
    // Arrange
    const authorId = faker.string.uuid();
    const addRecipeDto = addRecipeDtoMock;

    // Act
    jest.spyOn(controller, 'addRecipe').mockImplementation(async () => {
      throw new InternalServerErrorException('Error adding recipe to database');
    });

    // Assert
    await expect(controller.addRecipe(authorId, addRecipeDto)).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});
