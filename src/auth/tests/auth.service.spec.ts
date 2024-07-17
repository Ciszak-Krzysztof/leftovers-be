import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UsersRepository } from 'src/users/users.repository';
import { mockedCorrectSignUpCredentials } from 'src/users/mocks/users.mock';

describe('AuthService', () => {
  let authService: AuthService;
  let usersRepository: UsersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
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
