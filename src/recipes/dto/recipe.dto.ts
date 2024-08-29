import { ApiProperty } from '@nestjs/swagger';
import { Ingredient, PreparationStep, Rating } from '@prisma/client';

export class RecipeDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  categoryId: string;

  @ApiProperty()
  preparationTime: string;

  @ApiProperty()
  ingredients: Ingredient[];

  @ApiProperty()
  preparationSteps: PreparationStep[];

  @ApiProperty()
  isPublic: 'PRIVATE' | 'PUBLIC';

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  authorId: string;

  @ApiProperty()
  ratings: Rating[];
}

export class IngredientDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  recipeId: string;
}

export class PreparationStepDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  step: string;

  @ApiProperty()
  recipeId: string;
}

export class RatingDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  rating: number;

  @ApiProperty()
  recipeId: string;

  @ApiProperty()
  userId: string;
}
