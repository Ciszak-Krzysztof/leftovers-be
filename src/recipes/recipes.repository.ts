import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GetRecipesQueryParamsDto } from './dto/get-recipe-query-params.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class RecipesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getRecipes(
    userId: string,
    queryParams: GetRecipesQueryParamsDto,
  ): Promise<any> {
    const { details, categoryIds, startDate, endDate, rating } = queryParams;

    const prismaQuery: Prisma.RecipeWhereInput = {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
      categoryId: {
        in: categoryIds,
      },
    };

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

    const recipeIdsWithHighAvgRating = avgRatings.map((r) => r.recipeId);

    return this.prisma.recipe.findMany({
      where: {
        ...(userId
          ? {
              AND: [
                { OR: [{ isPublic: true }, { authorId: userId }] },
                prismaQuery,
                { id: { in: recipeIdsWithHighAvgRating } },
              ],
            }
          : {
              AND: [
                { isPublic: true },
                prismaQuery,
                { id: { in: recipeIdsWithHighAvgRating } },
              ],
            }),
      },
      include: {
        author: details === 'true',
        category: details === 'true',
        ratings: true,
      },
    });
  }
}
