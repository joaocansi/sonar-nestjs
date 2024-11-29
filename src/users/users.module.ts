import { Module } from '@nestjs/common';
import { DataSource } from 'typeorm';
import UserService from './users.service';
import User from './infra/database/entities/user.entity';
import UserController from './users.controller';
import TypeormUserRepository from './infra/database/repositories/user.repository';

@Module({
  providers: [
    UserService,
    {
      provide: 'UserRepository',
      useFactory: (dataSource: DataSource) => {
        return new TypeormUserRepository(dataSource.getRepository(User));
      },
      inject: [DataSource],
    },
  ],
  controllers: [UserController],
})
export default class UserModule {}
