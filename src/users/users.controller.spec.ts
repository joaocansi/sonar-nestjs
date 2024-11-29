import UserService from './users.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from './domain/user-repository';
import UserController from './users.controller';

describe('UserController', () => {
  const mockDto = {
    email: 'test@example.com',
    password: 'password',
    name: 'test',
    passport: {
      number: '12312312311',
      country: 'TS',
    },
  };

  let controller: UserController;
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
      controllers: [UserController],
    }).compile();

    controller = module.get<UserController>(UserController);
    userRepositoryMock = module.get<UserRepository>('UserRepository');
  });

  it('should return status 409 (e-mail already exists)', async () => {
    jest
      .spyOn(userRepositoryMock, 'isUserAlreadyRegistered')
      .mockResolvedValue(true);

    await expect(controller.createUser(mockDto)).rejects.toThrow(
      'e-mail already registered',
    );
    expect(userRepositoryMock.isUserAlreadyRegistered).toHaveBeenCalled();
  });

  it('should create user', async () => {
    jest
      .spyOn(userRepositoryMock, 'isUserAlreadyRegistered')
      .mockResolvedValue(false);

    await expect(controller.createUser(mockDto)).resolves.toBeUndefined();
    expect(userRepositoryMock.isUserAlreadyRegistered).toHaveBeenCalled();
    expect(userRepositoryMock.createUser).toHaveBeenCalled();
  });
});
