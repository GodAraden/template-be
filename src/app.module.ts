import { /* DynamicModule, */ Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
// import { PrismaClient } from '@prisma/client';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [ConfigModule.forRoot({ envFilePath: [], isGlobal: true })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  // static registerGlobalService(config: {
  //   prisma: PrismaClient;
  // }): DynamicModule {
  //   return {
  //     global: true,
  //     module: AppModule,
  //     providers: [{ provide: 'PrismaClient', useValue: config.prisma }],
  //     exports: ['PrismaClient'],
  //   };
  // }
}
