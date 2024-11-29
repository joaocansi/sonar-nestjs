import User from './user';

export interface UserRepository {
  createUser(user: User): Promise<void>;
  isUserAlreadyRegistered(email: string): Promise<boolean>;
}
