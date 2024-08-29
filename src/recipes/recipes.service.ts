import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RecipesRepository } from './recipes.repository';
import { GetRecipesQueryParamsDto } from './dto/get-recipe-query-params.dto';
import {
  GetRecipeResponse,
  GetRecipesResponse,
} from './dto/get-recipe-response';

@Injectable()
export class RecipesService {
  constructor(private recipeRepository: RecipesRepository) {}

  async getRecipes(
    userId: string,
    queryParams: GetRecipesQueryParamsDto,
  ): Promise<GetRecipesResponse> {
    return this.recipeRepository.getRecipes(userId, queryParams);
  }

  async getRecipeById(id: string, userId: string): Promise<GetRecipeResponse> {
    const recipe = await this.recipeRepository.getRecipesById(id);

    if (!recipe) {
      throw new NotFoundException(`Recipe with ID ${id} was not found.`);
    }

    if (!recipe.isPublic && recipe.authorId !== userId) {
      throw new ForbiddenException('Recipe is not public.');
    }

    return recipe;
  }
}
