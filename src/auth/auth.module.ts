import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { UsersRepository } from 'src/users/users.repository';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [ConfigModule, PrismaModule],
  controllers: [AuthController],
  providers: [AuthService, UsersRepository],
})
export class AuthModule {}
