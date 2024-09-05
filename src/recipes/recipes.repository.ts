import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { GetRecipesQueryParamsDto } from './dto/get-recipe-query-params.dto';
import {
  GetRecipeResponse,
  GetRecipesResponse,
} from './dto/get-recipe-response.dto';
import { AddRecipeDto } from './dto/add-recipe.dto';

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

    return await this.prisma.recipe.create({
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
        numberOfServings,
        isPublic,
      },
      include: {
        author: true,
        category: true,
        preparationSteps: true,
        ingredients: true,
      },
    });
  }
}
