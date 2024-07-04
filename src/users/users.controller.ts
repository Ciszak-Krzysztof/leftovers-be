import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get users list' })
  @ApiResponse({ status: 200, description: 'users list', type: 'User' })
  getUsers(): Promise<User[]> {
    return this.usersService.getUsers();
  }
}
