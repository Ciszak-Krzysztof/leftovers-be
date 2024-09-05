import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@/auth/guards/auth.guard';
import { GetUserResponse } from './dto/get-user-response.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get users list' })
  @ApiOkResponse({ type: GetUserResponse, isArray: true })
  getUsers(): Promise<Array<GetUserResponse>> {
    return this.usersService.getUsers();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get users by id' })
  @ApiOkResponse({ type: GetUserResponse })
  @ApiNotFoundResponse({ description: 'User not found' })
  getUser(@Param('id') id: string): Promise<GetUserResponse> {
    return this.usersService.getUser(id);
  }
}
