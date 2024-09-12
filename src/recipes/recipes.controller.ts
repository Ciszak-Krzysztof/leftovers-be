import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpCode,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { GetUserId } from '@/common/decorators/getUserId.decorator';
import { GetRecipesQueryParamsDto } from './dto/get-recipe-query-params.dto';
import {
  GetRecipeResponse,
  GetRecipesResponse,
} from './dto/get-recipe-response.dto';
import {
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AddRecipeDto } from './dto/add-recipe.dto';
import { AuthGuard } from '@/auth/guards/auth.guard';
import { MAX_FILE_SIZE } from '@/common/constants';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('recipes')
@ApiTags('recipes')
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

  @Get(':id')
  @ApiOperation({ description: 'Get recipe by id' })
  @ApiOkResponse({
    description: 'Recipe',
    type: GetRecipeResponse,
  })
  @ApiNotFoundResponse({
    description: 'Recipe not found',
  })
  @ApiForbiddenResponse({
    description: 'Recipe is not public',
  })
  getRecipeById(
    @GetUserId() userId: string | null,
    @Param('id') id: string,
  ): Promise<GetRecipeResponse> {
    return this.recipesService.getRecipeById(id, userId);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ description: 'Add new recipe' })
  @ApiOkResponse({
    description: 'Created recipe',
  })
  @ApiInternalServerErrorResponse({
    description: 'Error adding recipe to database',
  })
  @UseGuards(AuthGuard)
  @HttpCode(201)
  addRecipe(
    @GetUserId() authorId: string | null,
    @Body() addRecipeDto: AddRecipeDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
          new MaxFileSizeValidator({
            maxSize: MAX_FILE_SIZE,
            message: 'File is too large. Max file size is 10MB',
          }),
        ],
        fileIsRequired: false,
      }),
    )
    file?: Express.Multer.File,
  ): Promise<GetRecipeResponse> {
    return this.recipesService.addRecipe(authorId, addRecipeDto, file);
  }

  @Delete()
  @ApiOperation({ description: 'Delete recipe' })
  @ApiOkResponse({
    description: 'Recipe deleted',
  })
  @ApiNotFoundResponse({
    description: 'Recipe not found',
  })
  @ApiForbiddenResponse({
    description: 'User is not authorized',
  })
  @ApiInternalServerErrorResponse({
    description: 'Error deleting recipe from database',
  })
  @UseGuards(AuthGuard)
  deleteRecipe(
    @GetUserId() userId: string,
    @Query('id') id: string,
  ): Promise<void> {
    return this.recipesService.deleteRecipe(id, userId);
  }
}
