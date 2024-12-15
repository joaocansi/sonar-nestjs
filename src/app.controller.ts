import { Controller, Post } from '@nestjs/common';
import AppService from './app.service';

@Controller()
export default class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  sendEmail() {
    return this.appService.sendEmail('joaocansii@gmail.com', 'test', 'test');
  }
}
