import { ApiProperty } from '@nestjs/swagger';
import { IngredientDto, PreparationStepDto } from './recipe.dto';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { PreparationTime } from '@prisma/client';
import { Transform } from 'class-transformer';

export class UpdateRecipeDto {
  @ApiProperty({ example: 'soup' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @IsOptional()
  title?: string;

  @ApiProperty({ example: 'soup recipe' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  @IsOptional()
  description?: string;

  @ApiProperty({ example: '1' })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  categoryId?: string;

  @IsNotEmpty()
  @IsEnum(PreparationTime)
  @ApiProperty({ example: PreparationTime.UP_TO_30_MIN })
  @IsOptional()
  preparationTime?: PreparationTime;

  @ApiProperty({
    type: IngredientDto,
    isArray: true,
    example: [
      { id: '1', name: 'Ingredient 1', recipeId: '1' },
      { id: '2', name: 'Ingredient 2', recipeId: '1' },
    ],
  })
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @IsOptional()
  ingredients?: IngredientDto[];

  @ApiProperty({
    type: PreparationStepDto,
    isArray: true,
    example: [
      { id: '1', step: 'Step 1', recipeId: '1' },
      { id: '2', step: 'Step 2', recipeId: '1' },
    ],
  })
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @IsOptional()
  preparationSteps?: PreparationStepDto[];

  @ApiProperty({ example: 4 })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(4)
  @Transform(({ value }) => +value)
  @IsOptional()
  numberOfServings?: number;

  @ApiProperty({ example: true })
  @IsNotEmpty()
  @IsBoolean()
  @Transform(({ value }) =>
    value === 'true' ? true : value === 'false' ? false : value,
  )
  @IsOptional()
  isPublic?: boolean;
}
