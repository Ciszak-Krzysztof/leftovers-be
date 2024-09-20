import { Module } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { RecipesController } from './recipes.controller';
import { RecipesRepository } from './recipes.repository';
import { PrismaModule } from '@/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { FilesService } from '@/files/files.service';

@Module({
  imports: [PrismaModule, ConfigModule, JwtModule],
  controllers: [RecipesController],
  providers: [RecipesService, RecipesRepository, FilesService],
})
export class RecipesModule {}
