import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  GetUserByEmailResponse,
  GetUserResponse,
} from './dto/get-user-response.dto';
import { AuthCredentialsDto } from '../auth/dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaService) {}

  async getUsers(): Promise<Array<GetUserResponse>> {
    return this.prisma.user.findMany({ omit: { password: true } });
  }

  async getUser(id: string): Promise<GetUserResponse> {
    const user = this.prisma.user.findUnique({
      where: { id },
      omit: { password: true },
    });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async getUserByEmail(email: string): Promise<GetUserByEmailResponse> {
    const user = this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { email, password } = authCredentialsDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
      await this.prisma.user.create({
        data: {
          email: email,
          password: hashedPassword,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Email already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async updateUser(
    id: string,
    updateUserDto: Partial<UpdateUserDto>,
  ): Promise<GetUserResponse> {
    try {
      const updatedUser = await this.prisma.user.update({
        where: {
          id,
        },
        data: {
          ...updateUserDto,
        },
      });

      return updatedUser;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`User with ID ${id} not found.`);
      }
      throw new InternalServerErrorException();
    }
  }

  async verifyUser(id: string): Promise<GetUserResponse> {
    return this.updateUser(id, { isVerified: true });
  }
}
