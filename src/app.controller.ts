import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { appInfo } from './dictionary';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getAppInfo() {
    return appInfo;
  }
}
