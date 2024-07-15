import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { mockedCorrectSignUpCredentials } from 'src/users/mocks/users.mock';

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
            signUp: jest.fn().mockReturnValue([]),
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

  it('should call signUp method from auth service', async () => {
    const mockSignUp = jest.fn().mockReturnValue([]);
    jest.spyOn(authService, 'signUp').mockImplementation(mockSignUp);

    await authController.signUp(mockedCorrectSignUpCredentials);

    expect(authService.signUp).toBeCalled();
  });
});
