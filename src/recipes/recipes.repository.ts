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
    const { details, categoryIds, startDate, endDate } = queryParams;

    const prismaQuery: Prisma.RecipeWhereInput = {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
      categoryId: {
        in: categoryIds,
      },
    };

    return this.prisma.recipe.findMany({
      where: {
        ...(userId
          ? {
              AND: [
                { OR: [{ isPublic: true }, { authorId: userId }] },
                prismaQuery,
              ],
            }
          : { AND: [{ isPublic: true }, prismaQuery] }),
      },
      include: {
        author: details === 'true',
        category: details === 'true',
        ratings: true,
      },
    });
  }
}
