import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserRepository } from './domain/user-repository';
import { AppError, ErrorType } from 'src/common/errors/error';

@Injectable()
export default class UserService {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async createUser(dto: CreateUserDto): Promise<void> {
    const isUserAlreadyRegistered =
      await this.userRepository.isUserAlreadyRegistered(dto.email);

    if (isUserAlreadyRegistered) {
      throw new AppError(
        'e-mail already registered',
        ErrorType.RESOURCE_ALREADY_EXISTS,
      );
    }

    await this.userRepository.createUser(dto);
  }
}
