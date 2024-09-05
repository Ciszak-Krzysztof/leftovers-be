import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from '@/users/users.repository';
import {
  AuthCredentialsDto,
  LoginCredentialsDto,
  VerifyAccountDto,
} from './dto/auth-credentials.dto';
import { Tokens } from './dto/tokens.dto';
import * as bcrypt from 'bcrypt';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { JwtPayload, VerifyAccountJwtPayload } from './dto/jwt-payload.dto';
import { MailingService } from '@/mailing/mailing.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
    private mailingService: MailingService,
    private configService: ConfigService,
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

  async verifyAccount(verifyAccountDto: VerifyAccountDto): Promise<void> {
    let payload: VerifyAccountJwtPayload;
    try {
      payload = await this.jwtService.verifyAsync(verifyAccountDto.token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Token has expired');
      }
      throw new UnauthorizedException('Invalid JWT token');
    }

    if (payload.email !== verifyAccountDto.email) {
      throw new UnauthorizedException('Invalid JWT token');
    }

    const user = await this.usersRepository.getUserByEmail(payload.email);

    await this.usersRepository.verifyUser(user.id);
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
