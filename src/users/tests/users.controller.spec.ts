import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../prisma/prisma.service';
import { UsersRepository } from '../users.repository';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        PrismaService,
        UsersRepository,
        {
          provide: UsersService,
          useValue: {
            getUsers: jest.fn().mockReturnValue([]),
          },
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  describe('getUsers', () => {
    it('should call getUsers from usersService', async () => {
      const mockGetUsers = jest.fn().mockReturnValue([]);
      jest.spyOn(usersService, 'getUsers').mockImplementation(mockGetUsers);

      await usersController.getUsers();

      expect(usersService.getUsers).toBeCalled();
    });
  });
});
