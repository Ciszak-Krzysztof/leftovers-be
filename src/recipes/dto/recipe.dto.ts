import { ApiProperty } from '@nestjs/swagger';

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
  ingredients: string[];

  @ApiProperty()
  preparationSteps: string[];

  @ApiProperty()
  isPublic: 'PRIVATE' | 'PUBLIC';

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  authorId: string;

  @ApiProperty()
  ratings: number[];
}
