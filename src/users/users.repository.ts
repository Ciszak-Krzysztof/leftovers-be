import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetUserResponse } from './dto/get-user-response.dto';

@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaService) {}

  async getUsers(): Promise<Array<GetUserResponse>> {
    return this.prisma.user.findMany();
  }

  async getUser(id: string): Promise<GetUserResponse> {
    return this.prisma.user.findUnique({ where: { id } });
  }
}
