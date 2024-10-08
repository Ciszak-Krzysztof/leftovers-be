import {
  Body,
  Controller,
  HttpCode,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AuthCredentialsDto,
  LoginCredentialsDto,
  VerifyAccountDto,
} from './dto/auth-credentials.dto';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Tokens } from './dto/tokens.dto';
import { LoginResponse } from './dto/login-response.dto';
import { AuthGuard } from './guards/auth.guard';
import { GetUserId } from '@/common/decorators/getUserId.decorator';

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

  @Post('forgot-password')
  @HttpCode(200)
  @ApiOperation({
    description: 'Sends an email with a link to reset a password',
  })
  @ApiOkResponse({
    description:
      'Email was successfully sent or user with a provided email does not exist',
  })
  @ApiBadRequestResponse({ description: 'Email is not provided or is empty' })
  sendPasswordResetEmail(@Body() email: string): Promise<void> {
    return this.authService.sendResetPasswordEmail(email);
  }

  @Post('reset-password')
  @UseGuards(AuthGuard)
  @HttpCode(204)
  @ApiOperation({ summary: 'Reset user password' })
  @ApiOkResponse({ description: 'Password was successfully reset' })
  @ApiBadRequestResponse({ description: 'Reset password has failed' })
  resetPassword(@Body() password: string, @GetUserId() userId: string | null) {
    return this.authService.changePassword({ userId, password });
  }
}
