import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { UsersRepository } from '../users.repository';
import { GetUserResponse } from '../dto/get-user-response.dto';

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: UsersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: {
            getUsers: jest.fn(),
            getUser: jest.fn(),
          },
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    usersRepository = module.get<UsersRepository>(UsersRepository);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('getUsers', () => {
    it('should call usersRepository.getUsers and return an array of GetUserResponse', async () => {
      const result: GetUserResponse[] = [{ id: '1', email: 'test1@test.com' }];
      jest.spyOn(usersRepository, 'getUsers').mockResolvedValue(result);

      expect(await usersService.getUsers()).toBe(result);
      expect(usersRepository.getUsers).toHaveBeenCalled();
    });
  });

  describe('getUser', () => {
    it('should call usersRepository.getUser with the correct id and return a GetUserResponse', async () => {
      const result: GetUserResponse = { id: '1', email: 'test1@test.com' };
      const id = '1';
      jest.spyOn(usersRepository, 'getUser').mockResolvedValue(result);

      expect(await usersService.getUser(id)).toBe(result);
      expect(usersRepository.getUser).toHaveBeenCalledWith(id);
    });

    it('should throw an error if user is not found', async () => {
      const id = '1';
      jest
        .spyOn(usersRepository, 'getUser')
        .mockRejectedValue(new Error('User not found'));

      await expect(usersService.getUser(id)).rejects.toThrow('User not found');
      expect(usersRepository.getUser).toHaveBeenCalledWith(id);
    });
  });
});
