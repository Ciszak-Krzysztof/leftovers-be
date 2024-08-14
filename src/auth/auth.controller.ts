import { Body, Controller, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AuthCredentialsDto,
  LoginCredentialsDto,
  VerifyAccountDto,
} from './dto/auth-credentials.dto';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Tokens } from './dto/tokens.dto';
import { LoginResponse } from './dto/login-response.dto';

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

  @Post('/register')
  @ApiOperation({ summary: 'Create new user' })
  @ApiOkResponse()
  register(@Body() authCredentials?: AuthCredentialsDto): Promise<void> {
    return this.authService.register(authCredentials);
  }

  @Post('/verify')
  @ApiOperation({ summary: 'Verify user' })
  @ApiOkResponse()
  verify(@Query() verifyAccountDto: VerifyAccountDto): Promise<void> {
    return this.authService.verifyAccount(verifyAccountDto);
  }

  @Post('/login')
  @ApiOperation({ summary: 'Login user' })
  @ApiOkResponse({ type: LoginResponse })
  signIn(@Body() loginCredentialsDto: LoginCredentialsDto): Promise<Tokens> {
    return this.authService.signIn(loginCredentialsDto);
  }
}
