import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UsersRepository } from 'src/users/users.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { mockedCorrectSignUpCredentials } from 'src/users/mocks/users.mock';

describe('AuthService', () => {
  let authService: AuthService;
  let usersRepository: UsersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UsersRepository,
        {
          provide: PrismaService,
          useValue: {
            user: { create: jest.fn().mockReturnValue({}) },
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
    it('should call createUser from usersRepository', async () => {
      const mockGetUsers = jest.fn().mockReturnValue({});
      jest
        .spyOn(usersRepository, 'createUser')
        .mockImplementation(mockGetUsers);

      await authService.signUp(mockedCorrectSignUpCredentials);

      expect(usersRepository.createUser).toBeCalled();
    });
  });
});
