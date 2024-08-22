import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UsersRepository } from 'src/users/users.repository';
import { mockedCorrectSignUpCredentials } from 'src/users/mocks/users.mock';
import { JwtService } from '@nestjs/jwt';
import { MailingService } from 'src/mailing/mailing.service';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

describe('AuthService', () => {
  let authService: AuthService;
  let usersRepository: UsersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        AuthService,
        JwtService,
        MailingService,
        {
          provide: MailerService,
          useValue: {
            sendMail: jest.fn(),
          },
        },
        ConfigService,
        {
          provide: UsersRepository,
          useValue: {
            createUser: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersRepository = module.get<UsersRepository>(UsersRepository);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('signUp', () => {
    it('should call usersRepository.createUser with the correct arguments', async () => {
      await authService.signUp(mockedCorrectSignUpCredentials);

      expect(usersRepository.createUser).toHaveBeenCalledWith(
        mockedCorrectSignUpCredentials,
      );
    });

    it('should return a Promise<void>', async () => {
      usersRepository.createUser = jest.fn().mockResolvedValue(undefined);

      await expect(
        authService.signUp(mockedCorrectSignUpCredentials),
      ).resolves.toBeUndefined();
    });
  });
});
