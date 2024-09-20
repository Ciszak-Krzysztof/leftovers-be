import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { RecipesRepository } from './recipes.repository';
import { GetRecipesQueryParamsDto } from './dto/get-recipe-query-params.dto';
import {
  GetRecipeResponse,
  GetRecipesResponse,
} from './dto/get-recipe-response.dto';
import { AddRecipeDto } from './dto/add-recipe.dto';
import { FilesService } from '@/files/files.service';
import { UpdateRecipeDto } from './dto/update-recipe.dto';

@Injectable()
export class RecipesService {
  constructor(
    private readonly recipeRepository: RecipesRepository,
    private readonly filesService: FilesService,
  ) {}

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

  async addRecipe(
    authorId: string,
    addRecipeDto: AddRecipeDto,
    file?: Express.Multer.File,
  ): Promise<GetRecipeResponse> {
    const fileUploadResult =
      file &&
      (await this.filesService.uploadSingleFile({
        file,
        uploadFileDto: { type: 'recipe', isPublic: false },
      }));

    try {
      return await this.recipeRepository.addRecipe(
        authorId,
        addRecipeDto,
        fileUploadResult?.key,
      );
    } catch (error) {
      throw new InternalServerErrorException('Error adding recipe to database');
    }
  }

  async updateRecipe(
    id: string,
    updateRecipeDto: UpdateRecipeDto,
    userId: string,
    file?: Express.Multer.File,
  ): Promise<GetRecipeResponse> {
    const fileUploadResult =
      file &&
      (await this.filesService.uploadSingleFile({
        file,
        uploadFileDto: { type: 'recipe', isPublic: false },
      }));

    try {
      return await this.recipeRepository.updateRecipe(
        id,
        updateRecipeDto,
        userId,
        fileUploadResult?.key,
      );
    } catch (error) {
      throw new InternalServerErrorException('Error updating recipe');
    }
  }

  async deleteRecipe(id: string, userId: string): Promise<void> {
    const recipe = await this.getRecipeById(id, userId);

    if (!recipe) {
      throw new NotFoundException(`Recipe with ID ${id} was not found.`);
    }

    if (recipe.authorId !== userId) {
      throw new ForbiddenException('User is not authorized');
    }

    await this.recipeRepository.deleteRecipe(id);

    if (recipe.imageKey) {
      await this.filesService.deleteFile(recipe.imageKey);
    }
  }
}
