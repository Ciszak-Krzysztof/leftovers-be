import { FilesModule } from '@/files/files.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { RecipesController } from './recipes.controller';
import { RecipesRepository } from './recipes.repository';
import { RecipesService } from './recipes.service';

@Module({
  imports: [PrismaModule, ConfigModule, JwtModule, FilesModule],
  controllers: [RecipesController],
  providers: [RecipesService, RecipesRepository],
})
export class RecipesModule {}
