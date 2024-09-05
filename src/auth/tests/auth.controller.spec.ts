import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { mockedCorrectSignUpCredentials } from '@/users/mocks/users.mock';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signUp: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('signUp', () => {
    it('should call authService.signUp with the correct arguments', async () => {
      await authController.signUp(mockedCorrectSignUpCredentials);

      expect(authService.signUp).toHaveBeenCalledWith(
        mockedCorrectSignUpCredentials,
      );
    });

    it('should return a Promise<void>', async () => {
      authService.signUp = jest.fn().mockResolvedValue(undefined);

      await expect(
        authController.signUp(mockedCorrectSignUpCredentials),
      ).resolves.toBeUndefined();
    });
  });
});
