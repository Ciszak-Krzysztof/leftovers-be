import { ApiProperty } from '@nestjs/swagger';
import { IngredientDto, PreparationStepDto } from './recipe.dto';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { PreparationTime } from '@prisma/client';
import { Transform } from 'class-transformer';

export class AddRecipeDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @ApiProperty({ example: 'soup' })
  title: string;

  @ApiProperty({ example: 'soup recipe' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  description: string;

  @ApiProperty({ example: '1' })
  @IsNotEmpty()
  @IsString()
  categoryId: string;

  @IsNotEmpty()
  @IsEnum(PreparationTime)
  @ApiProperty({ example: PreparationTime.UP_TO_30_MIN })
  preparationTime: PreparationTime;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @ApiProperty({
    type: IngredientDto,
    isArray: true,
    example: [
      { id: '1', name: 'Ingredient 1', recipeId: '1' },
      { id: '2', name: 'Ingredient 2', recipeId: '1' },
    ],
  })
  ingredients: IngredientDto[];

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @ApiProperty({
    type: PreparationStepDto,
    isArray: true,
    example: [
      { id: '1', step: 'Step 1', recipeId: '1' },
      { id: '2', step: 'Step 2', recipeId: '1' },
    ],
  })
  preparationSteps: PreparationStepDto[];

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(4)
  @Transform(({ value }) => +value)
  @ApiProperty({ example: 4 })
  numberOfServings: number;

  @IsNotEmpty()
  @IsBoolean()
  @Transform(({ value }) =>
    value === 'true' ? true : value === 'false' ? false : value,
  )
  @ApiProperty({ example: true })
  isPublic: boolean;
}
