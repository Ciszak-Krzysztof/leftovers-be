import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { GetUserId } from 'src/common/decorators/getUserId.decorator';
import { GetRecipesQueryParamsDto } from './dto/get-recipe-query-params.dto';
import {
  GetRecipeResponse,
  GetRecipesResponse,
} from './dto/get-recipe-response';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Post()
  create(@Body() createRecipeDto: CreateRecipeDto) {
    return this.recipesService.create(createRecipeDto);
  }

  @Get()
  getRecipes(
    @GetUserId() userId: string | null,
    @Query() queryParams: GetRecipesQueryParamsDto,
  ): Promise<GetRecipesResponse> {
    return this.recipesService.getRecipes(userId, queryParams);
  }

  @Get(':id')
  getRecipeById(
    @GetUserId() userId: string | null,
    @Param('id') id: string,
  ): Promise<GetRecipeResponse> {
    return this.recipesService.getRecipeById(id, userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRecipeDto: UpdateRecipeDto) {
    return this.recipesService.update(+id, updateRecipeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recipesService.remove(+id);
  }
}
