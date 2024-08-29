import { Controller, Get, Query } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { GetUserId } from 'src/common/decorators/getUserId.decorator';
import { GetRecipesQueryParamsDto } from './dto/get-recipe-query-params.dto';
import { GetRecipesResponse } from './dto/get-recipe-response';
import { ApiOkResponse, ApiOperation, ApiQuery } from '@nestjs/swagger';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Get()
  @ApiOperation({ description: 'Get filtered recipes' })
  @ApiOkResponse({
    description: 'List of filtered recipes',
    type: GetRecipesResponse,
  })
  @ApiQuery({
    name: 'details',
    description: 'If true, returns full recipe data.',
    type: 'boolean',
    required: false,
  })
  @ApiQuery({
    name: 'rating',
    description:
      'Shows only recipes with average rating greater or equal given value.',
    type: 'number',
    required: false,
  })
  @ApiQuery({
    name: 'category',
    description: 'Shows only recipes assinged to provided category.',
    type: 'string',
    required: false,
  })
  @ApiQuery({
    name: 'startDate',
    description: 'Shows only recipes created from specified date.',
    type: 'string',
    required: false,
  })
  @ApiQuery({
    name: 'endDate',
    description: 'Shows only recipes created till specified date.',
    type: 'string',
    required: false,
  })
  @ApiQuery({
    name: 'title',
    description: 'Shows only recipes that contains given string in the title.',
    type: 'string',
    required: false,
  })
  @ApiQuery({
    name: 'description',
    description:
      'Shows only recipes that contains given string in the description.',
    type: 'string',
    required: false,
  })
  @ApiQuery({
    name: 'ingredients',
    description:
      'Shows only recipes that contains given string in the ingredients.',
    type: 'string',
    required: false,
  })
  getRecipes(
    @GetUserId() userId: string | null,
    @Query() queryParams: GetRecipesQueryParamsDto,
  ): Promise<GetRecipesResponse> {
    return this.recipesService.getRecipes(userId, queryParams);
  }
}