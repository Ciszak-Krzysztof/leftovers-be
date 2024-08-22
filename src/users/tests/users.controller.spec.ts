import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { GetUserResponse } from '../dto/get-user-response.dto';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            getUsers: jest.fn(),
            getUser: jest.fn(),
          },
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  describe('getUsers', () => {
    it('should call usersService.getUsers and return an array of GetUserResponse', async () => {
      const result: GetUserResponse[] = [{ id: '1', email: 'test1@test.com' }];
      jest.spyOn(usersService, 'getUsers').mockResolvedValue(result);

      expect(await usersController.getUsers()).toBe(result);
      expect(usersService.getUsers).toHaveBeenCalled();
    });
  });

  describe('getUser', () => {
    it('should call usersService.getUser with the correct id and return a GetUserResponse', async () => {
      const result: GetUserResponse = { id: '1', email: 'test1@test.com' };
      const id = '1';
      jest.spyOn(usersService, 'getUser').mockResolvedValue(result);

      expect(await usersController.getUser(id)).toBe(result);
      expect(usersService.getUser).toHaveBeenCalledWith(id);
    });

    it('should throw a NotFoundException if user is not found', async () => {
      const id = '1';
      jest
        .spyOn(usersService, 'getUser')
        .mockRejectedValue(new Error('User not found'));

      await expect(usersController.getUser(id)).rejects.toThrow(
        'User not found',
      );
      expect(usersService.getUser).toHaveBeenCalledWith(id);
    });
  });
});
