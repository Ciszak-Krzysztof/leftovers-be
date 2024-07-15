import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersRepository } from '../users.repository';
import { mockedGetUsers } from '../mocks/users.mock';

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: UsersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        UsersRepository,
        {
          provide: PrismaService,
          useValue: {
            user: { findMany: jest.fn().mockReturnValue(mockedGetUsers) },
          },
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    usersRepository = module.get<UsersRepository>(UsersRepository);
  });

  describe('getUsers', () => {
    it('should call prisma getUsers from usersRepository', async () => {
      const mockGetUsers = jest.fn().mockReturnValue(mockedGetUsers);
      jest.spyOn(usersRepository, 'getUsers').mockImplementation(mockGetUsers);

      await usersService.getUsers();

      expect(usersRepository.getUsers).toBeCalled();
      expect(await usersService.getUsers()).toBe(mockedGetUsers);
    });
  });
});
