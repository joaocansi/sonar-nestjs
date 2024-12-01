import { Test, TestingModule } from '@nestjs/testing';
import TypeormUserRepository from './user.repository';
import { getRepositoryToken } from '@nestjs/typeorm';
import UserEntity from '../entities/user.entity';
import { Repository } from 'typeorm';

describe('TypeormUserRepository', () => {
  let userRepository: TypeormUserRepository;
  let repository: Partial<Repository<UserEntity>>;

  beforeEach(async () => {
    repository = {
      save: jest.fn(),
      findOneBy: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(UserEntity),
          useValue: repository,
        },
        {
          provide: 'UserRepository',
          useFactory: (repository) => {
            return new TypeormUserRepository(repository);
          },
          inject: [getRepositoryToken(UserEntity)],
        },
      ],
    }).compile();

    repository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
    userRepository = module.get<TypeormUserRepository>('UserRepository');
  });

  it('should create user', async () => {
    const dto = {
      email: 'test@example.com',
      password: 'password',
      name: 'test',
      passport: {
        number: '12312312311',
        country: 'TS',
      },
    };

    jest.spyOn(repository, 'save').mockResolvedValue(null);

    await expect(userRepository.createUser(dto)).resolves.toBeUndefined();
    expect(repository.save).toHaveBeenCalled();
  });

  it('should return true if email is already registered', async () => {
    jest.spyOn(repository, 'findOneBy').mockResolvedValue({
      id: 'test',
      email: 'test@example.com',
      password: 'password',
      name: 'test',
      passport: {
        id: 'test',
        country: 'test',
        number: 'test',
      },
    });

    await expect(
      userRepository.isUserAlreadyRegistered('test@example.com'),
    ).resolves.toBeTruthy();
    expect(repository.findOneBy).toHaveBeenCalled();
  });

  it('should return false if email is not registered', async () => {
    jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

    await expect(
      userRepository.isUserAlreadyRegistered('test@example.com'),
    ).resolves.toBeFalsy();
    expect(repository.findOneBy).toHaveBeenCalled();
  });
});
