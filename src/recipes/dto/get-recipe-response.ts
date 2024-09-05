import { ApiProperty } from '@nestjs/swagger';
import { Ingredient, PreparationStep, Rating } from '@prisma/client';
import { IngredientDto, PreparationStepDto, RatingDto } from './recipe.dto';
import { PreparationTime } from '../enums/preparation-time.enum';

export class GetRecipeResponse {
  @ApiProperty({ example: '1' })
  id: string;

  @ApiProperty({ example: 'My Recipe Title' })
  title: string;

  @ApiProperty({ example: 'A delicious recipe' })
  description: string;

  @ApiProperty({ example: '1' })
  categoryId: string;

  @ApiProperty({ example: 'UP_TO_15_MIN' })
  preparationTime: PreparationTime;

  @ApiProperty({ example: true })
  isPublic: boolean;

  @ApiProperty({ example: '2024-08-16T10:42:43.123Z' })
  createdAt: Date;

  @ApiProperty({ example: '1' })
  authorId: string;

  @ApiProperty({
    type: IngredientDto,
    isArray: true,
    example: [
      { id: '1', name: 'Ingredient 1', recipeId: '1' },
      { id: '2', name: 'Ingredient 2', recipeId: '1' },
    ],
  })
  ingredients?: Ingredient[];

  @ApiProperty({
    type: PreparationStepDto,
    isArray: true,
    example: [
      { id: '1', step: 'Step 1', recipeId: '1' },
      { id: '2', step: 'Step 2', recipeId: '1' },
    ],
  })
  preparationSteps?: PreparationStep[];

  @ApiProperty({
    type: RatingDto,
    isArray: true,
    example: [
      { id: '1', rating: 5, recipeId: '1', userId: '1' },
      { id: '2', rating: 4, recipeId: '1', userId: '2' },
    ],
  })
  ratings?: Rating[];
}

export class GetRecipesResponse {
  @ApiProperty({
    type: GetRecipeResponse,
    isArray: true,
    example: [
      {
        id: '1',
        title: 'Recipe 1',
        description: 'Description for recipe 1',
        categoryId: '1',
        preparationTime: PreparationTime.UP_TO_15_MIN,
        isPublic: true,
        createdAt: '2024-08-16T10:42:43.123Z',
        authorId: '1',
        ingredients: [
          { id: '1', name: 'Ingredient 1', recipeId: '1' },
          { id: '2', name: 'Ingredient 2', recipeId: '1' },
        ],
        preparationSteps: [
          { id: '1', step: 'Step 1', recipeId: '1' },
          { id: '2', step: 'Step 2', recipeId: '1' },
        ],
        ratings: [
          { id: '1', rating: 5, recipeId: '1', userId: '1' },
          { id: '2', rating: 4, recipeId: '1', userId: '2' },
        ],
      },
    ],
  })
  recipes: GetRecipeResponse[];
}
