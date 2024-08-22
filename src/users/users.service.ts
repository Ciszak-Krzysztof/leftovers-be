import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { GetUserResponse } from './dto/get-user-response.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async getUsers(): Promise<Array<GetUserResponse>> {
    return this.usersRepository.getUsers();
  }

  async getUser(id: string): Promise<GetUserResponse> {
    return this.usersRepository.getUser(id);
  }

  async updateUser(
    id: string,
    updateUserDto: Partial<UpdateUserDto>,
  ): Promise<GetUserResponse> {
    return this.usersRepository.updateUser(id, updateUserDto);
  }
}
