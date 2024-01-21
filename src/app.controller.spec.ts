import { Test, TestingModule } from '@nestjs/testing';
import { describe, beforeEach, it, expect } from 'vitest';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { appInfo } from './dictionary';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return appInfo', () => {
      expect(appController.getAppInfo()).toBe(appInfo);
    });
  });
});
