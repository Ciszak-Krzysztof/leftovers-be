import { AuthGuard } from '@/auth/guards/auth.guard';
import { RecipesController } from '@/recipes/recipes.controller';
import { RecipesService } from '@/recipes/recipes.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

export const createRecipesControllerTestingModule = async () => {
  const module: TestingModule = await Test.createTestingModule({
    controllers: [RecipesController],
    providers: [
      {
        provide: RecipesService,
        useValue: {
          getRecipes: jest.fn(),
          getRecipeById: jest.fn(),
          addRecipe: jest.fn(),
        },
      },
      AuthGuard,
      JwtService,
      ConfigService,
    ],
  }).compile();

  return module;
};
