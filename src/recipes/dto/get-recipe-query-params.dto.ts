import { Transform } from 'class-transformer';
import { IsDate, IsInt, IsOptional } from 'class-validator';

export class GetRecipesQueryParamsDto {
  @IsOptional()
  details: string;

  @IsOptional()
  @Transform(({ value }) => value.split(',').map(String))
  categoryIds: string[];

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseFloat(value))
  rating: number;

  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  startDate: Date;

  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  endDate: Date;
}
