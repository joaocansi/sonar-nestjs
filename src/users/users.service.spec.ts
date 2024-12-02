import UserService from './users.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from './domain/user-repository';

describe('UserService', () => {
  const mockDto = {
    email: 'test@example.com',
    password: 'password',
    name: 'test',
    passport: {
      number: '12312312311',
      country: 'TS',
    },
  };

  let service: UserService;
  let userRepositoryMock: UserRepository;

  beforeEach(async () => {
    userRepositoryMock = {
      createUser: jest.fn(),
      isUserAlreadyRegistered: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: 'UserRepository',
          useValue: userRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepositoryMock = module.get<UserRepository>('UserRepository');
  });

  it('should throw an error if email is already registered', async () => {
    jest
      .spyOn(userRepositoryMock, 'isUserAlreadyRegistered')
      .mockResolvedValueOnce(true);

    await expect(service.createUser(mockDto)).rejects.toThrow(
      'e-mail already registered',
    );
    expect(userRepositoryMock.isUserAlreadyRegistered).toHaveBeenCalledWith(
      mockDto.email,
    );
  });

  it('should create the user', async () => {
    jest
      .spyOn(userRepositoryMock, 'isUserAlreadyRegistered')
      .mockResolvedValueOnce(false);

    await expect(service.createUser(mockDto)).resolves.toBeUndefined();
    expect(userRepositoryMock.isUserAlreadyRegistered).toHaveBeenCalledWith(
      mockDto.email,
    );
  });
});
