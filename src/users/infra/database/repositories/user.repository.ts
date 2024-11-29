import { Repository } from 'typeorm';
import UserEntity from '../entities/user.entity';
import User from 'src/users/domain/user';
import { UserRepository } from 'src/users/domain/user-repository';

export default class TypeormUserRepository implements UserRepository {
  constructor(private readonly database: Repository<UserEntity>) {}

  async createUser(user: User): Promise<void> {
    await this.database.save(user);
  }

  async isUserAlreadyRegistered(email: string): Promise<boolean> {
    const user = await this.database.findOneBy({ email });
    return !!user;
  }
}
