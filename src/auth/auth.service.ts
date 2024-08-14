import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from 'src/users/users.repository';
import {
  AuthCredentialsDto,
  LoginCredentialsDto,
} from './dto/auth-credentials.dto';
import { Tokens } from './dto/tokens.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './dto/jwt-payload.dto';
import { MailingService } from 'src/mailing/mailing.service';

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
    private mailingService: MailingService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.usersRepository.createUser(authCredentialsDto);
  }

  async register(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    await this.usersRepository.createUser(authCredentialsDto);

    const token = await this.jwtService.sign({
      email: authCredentialsDto.email,
    });

    return this.mailingService.sendVerifyAccountEmail({
      email: authCredentialsDto.email,
      token,
    });
  }

  async signIn(loginCredentialsDto: LoginCredentialsDto): Promise<Tokens> {
    const user = await this.usersRepository.getUserByEmail(
      loginCredentialsDto.email,
    );

    if (!user) {
      throw new UnauthorizedException('Wrong login credentials');
    }

    const passwordMatch = await bcrypt.compare(
      loginCredentialsDto.password,
      user.password,
    );
    if (!passwordMatch)
      throw new UnauthorizedException('Wrong login credentials');

    const tokens = await this.getTokens(user.id, user.email);

    return tokens;
  }

  async getTokens(userId: string, email: string): Promise<Tokens> {
    const payload: JwtPayload = {
      userId,
      email,
    };

    const accessToken = await this.jwtService.sign(payload);

    return {
      accessToken,
    };
  }
}
