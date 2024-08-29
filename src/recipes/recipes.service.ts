import { Injectable } from '@nestjs/common';
import { RecipesRepository } from './recipes.repository';
import { GetRecipesQueryParamsDto } from './dto/get-recipe-query-params.dto';
import { GetRecipesResponse } from './dto/get-recipe-response';

@Injectable()
export class RecipesService {
  constructor(private recipeRepository: RecipesRepository) {}

  async getRecipes(
    userId: string,
    queryParams: GetRecipesQueryParamsDto,
  ): Promise<GetRecipesResponse> {
    return this.recipeRepository.getRecipes(userId, queryParams);
  }
}
