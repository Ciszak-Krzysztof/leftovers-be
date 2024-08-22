import { ApiProperty } from '@nestjs/swagger';
import { Ingredient, PreparationStep, Rating } from '@prisma/client';

export class GetRecipeResponse {
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
  isPublic: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  authorId: string;

  @ApiProperty()
  ingredients?: Ingredient[];

  @ApiProperty()
  preparationSteps?: PreparationStep[];

  @ApiProperty()
  ratings?: Rating[];
}

export class GetRecipesResponse {
  recipes: GetRecipeResponse[];
}
