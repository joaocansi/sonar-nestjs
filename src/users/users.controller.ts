import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import UserService from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';

@Controller('users')
export default class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(201)
  async createUser(@Body() data: CreateUserDto) {
    console.log(data);
    await this.userService.createUser(data);
  }
}
