import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AuthCredentialsDto,
  LoginCredentialsDto,
} from './dto/auth-credentials.dto';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Tokens } from './dto/tokens.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @ApiOperation({ summary: 'Create new user' })
  @ApiOkResponse()
  signUp(@Body() authCredentials: AuthCredentialsDto): Promise<void> {
    return this.authService.signUp(authCredentials);
  }

  @Post('/login')
  @ApiOperation({ summary: 'Login user' })
  @ApiOkResponse()
  signIn(@Body() loginCredentialsDto: LoginCredentialsDto): Promise<Tokens> {
    return this.authService.signIn(loginCredentialsDto);
  }
}
