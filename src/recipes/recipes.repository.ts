import { PrismaService } from '@/prisma/prisma.service';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { GetRecipesQueryParamsDto } from './dto/get-recipe-query-params.dto';
import {
  GetRecipeResponse,
  GetRecipesResponse,
} from './dto/get-recipe-response.dto';
import { AddRecipeDto } from './dto/add-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';

@Injectable()
export class RecipesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getRecipes(
    userId: string,
    queryParams: GetRecipesQueryParamsDto,
  ): Promise<GetRecipesResponse> {
    const {
      details,
      categoryIds,
      startDate,
      endDate,
      rating,
      title,
      description,
      ingredient,
      step,
    } = queryParams;

    const textSearchConditions: Prisma.Enumerable<Prisma.RecipeWhereInput> = [];

    if (title) {
      textSearchConditions.push({
        title: { contains: title, mode: 'insensitive' },
      });
    }
    if (description) {
      textSearchConditions.push({
        description: { contains: description, mode: 'insensitive' },
      });
    }
    if (ingredient) {
      textSearchConditions.push({
        ingredients: {
          some: { name: { contains: ingredient, mode: 'insensitive' } },
        },
      });
    }
    if (step) {
      textSearchConditions.push({
        preparationSteps: {
          some: { step: { contains: step, mode: 'insensitive' } },
        },
      });
    }

    const prismaQuery: Prisma.RecipeWhereInput = {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
      categoryId: {
        in: categoryIds,
      },
      OR: textSearchConditions,
    };

    let recipeIdsWithHighAvgRating;

    if (rating) {
      const avgRatings = await this.prisma.rating.groupBy({
        by: ['recipeId'],
        _avg: {
          rating: true,
        },
        having: {
          rating: {
            _avg: {
              gte: +rating || 0,
            },
          },
        },
      });

      recipeIdsWithHighAvgRating = avgRatings.map((r) => r.recipeId);
    }

    const recipes = await this.prisma.recipe.findMany({
      where: {
        ...(userId
          ? {
              AND: [
                { OR: [{ isPublic: true }, { authorId: userId }] },
                prismaQuery,
                { ...(rating && { id: { in: recipeIdsWithHighAvgRating } }) },
              ],
            }
          : {
              AND: [
                { isPublic: true },
                prismaQuery,
                { ...(rating && { id: { in: recipeIdsWithHighAvgRating } }) },
              ],
            }),
      },
      include: {
        author: details === 'true',
        category: details === 'true',
        preparationSteps: details === 'true',
        ingredients: details === 'true',
        ratings: true,
      },
    });

    return { recipes: recipes };
  }

  getRecipesById(id: string): Promise<GetRecipeResponse> {
    return this.prisma.recipe.findUnique({
      where: { id },
      include: {
        author: true,
        category: true,
        preparationSteps: true,
        ingredients: true,
        ratings: true,
      },
    });
  }

  async addRecipe(
    authorId: string,
    addRecipeDto: AddRecipeDto,
    imageKey?: string,
  ): Promise<GetRecipeResponse> {
    const {
      title,
      description,
      categoryId,
      preparationTime,
      ingredients,
      preparationSteps,
      numberOfServings,
      isPublic,
    } = addRecipeDto;

    const parsedPublic = isPublic.toString() === 'true' ? true : false;

    return this.prisma.recipe.create({
      data: {
        title,
        description,
        authorId,
        categoryId,
        preparationTime,
        ingredients: {
          create: ingredients,
        },
        preparationSteps: {
          create: preparationSteps,
        },
        numberOfServings: +numberOfServings,
        isPublic: parsedPublic,
        imageKey: imageKey || '',
      },
      include: {
        author: true,
        category: true,
        preparationSteps: true,
        ingredients: true,
      },
    });
  }

  async updateRecipe(
    id: string,
    updateRecipeDto: UpdateRecipeDto,
    userId: string,
    imageKey?: string,
  ): Promise<GetRecipeResponse> {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id },
      include: {
        author: true,
        category: true,
        preparationSteps: true,
        ingredients: true,
      },
    });

    if (!recipe) {
      throw new NotFoundException(`Recipe with ID ${id} was not found.`);
    }

    if (recipe.authorId !== userId) {
      throw new ForbiddenException(
        'You are not allowed to update this recipe.',
      );
    }

    const {
      title,
      description,
      categoryId,
      preparationTime,
      ingredients,
      preparationSteps,
      numberOfServings,
      isPublic,
    } = updateRecipeDto;

    const updateRecipeData = {
      title: title ?? recipe.title,
      description: description ?? recipe.description,
      categoryId: categoryId ?? recipe.categoryId,
      preparationTime: preparationTime ?? recipe.preparationTime,
      numberOfServings: numberOfServings ?? recipe.numberOfServings,
      isPublic: isPublic ?? recipe.isPublic,
      imageKey: imageKey ?? recipe.imageKey,
    };

    if (ingredients) {
      const deleteIngredients = this.prisma.ingredient.deleteMany({
        where: { recipeId: id },
      });

      const createIngredients = this.prisma.ingredient.createMany({
        data: ingredients.map((ingredient) => ({
          name: ingredient.name,
          recipeId: id,
        })),
      });

      await this.prisma.$transaction([deleteIngredients, createIngredients]);
    }

    if (preparationSteps) {
      const deletePreparationSteps = this.prisma.preparationStep.deleteMany({
        where: { recipeId: id },
      });

      const createPreparationSteps = this.prisma.preparationStep.createMany({
        data: preparationSteps.map((preparationStep) => ({
          step: preparationStep.step,
          recipeId: id,
        })),
      });

      await this.prisma.$transaction([
        deletePreparationSteps,
        createPreparationSteps,
      ]);
    }

    return this.prisma.recipe.update({
      where: { id },
      data: updateRecipeData,
      include: {
        author: true,
        category: true,
        preparationSteps: true,
        ingredients: true,
      },
    });
  }

  async deleteRecipe(id: string): Promise<void> {
    const deletePreparationSteps = this.prisma.preparationStep.deleteMany({
      where: { recipeId: id },
    });

    const deleteIngrediensts = this.prisma.ingredient.deleteMany({
      where: { recipeId: id },
    });

    const deleteRating = this.prisma.rating.deleteMany({
      where: { recipeId: id },
    });

    const deleteRecipe = this.prisma.recipe.delete({
      where: { id },
    });

    await this.prisma.$transaction([
      deletePreparationSteps,
      deleteIngrediensts,
      deleteRating,
      deleteRecipe,
    ]);
  }
}
