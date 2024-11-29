import UserService from './users.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from './domain/user-repository';
import { AppError } from './../common/errors/error';

describe('UserService', () => {
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
    const dto = {
      email: 'test@example.com',
      password: 'password',
      name: 'test',
      passport: {
        number: '12312312311',
        country: 'TS',
      },
    };

    jest
      .spyOn(userRepositoryMock, 'isUserAlreadyRegistered')
      .mockResolvedValueOnce(true);

    await expect(service.createUser(dto)).rejects.toThrow(AppError);
    expect(userRepositoryMock.isUserAlreadyRegistered).toHaveBeenCalledWith(
      dto.email,
    );
  });

  it('should create the user', async () => {
    const dto = {
      email: 'test@example.com',
      password: 'password',
      name: 'test',
      passport: {
        number: '12312312311',
        country: 'TS',
      },
    };

    jest
      .spyOn(userRepositoryMock, 'isUserAlreadyRegistered')
      .mockResolvedValueOnce(false);

    await expect(service.createUser(dto)).resolves.toBeUndefined();
    expect(userRepositoryMock.isUserAlreadyRegistered).toHaveBeenCalledWith(
      dto.email,
    );
  });
});
