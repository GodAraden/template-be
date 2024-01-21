import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
// import { PrismaClient } from '@prisma/client';
import session from 'express-session';

import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/response/response.interceptor';
import { HttpExceptionFilter } from './common/response/httpException.filter';
// import { PrismaExceptionFilter } from './common/response/prismaException.filter';
import { LoggerMiddleware } from './common/logger.middleware';

// const prisma = new PrismaClient();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule, // .registerGlobalService({ prisma }),
  );

  // FIXME: Session Secret
  app.use(
    session({
      secret: "GodAraden's Template Project",
      name: 'session',
      resave: false,
      saveUninitialized: false,
      rolling: true,
      cookie: { maxAge: null },
    }),
  );

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  // app.useGlobalFilters(new PrismaExceptionFilter());
  app.use(LoggerMiddleware);

  app.enableCors({
    origin: [
      // FIXME: Frontend URL
      'http://template-fe.araden.top',
      'https://template-fe.araden.top',
    ],
    credentials: true,
  });

  // try {
  //   await access('images');
  // } catch (error) {
  //   await mkdir('images');
  // }

  // app.useStaticAssets('images', { prefix: '/image' });

  await app.listen(3000);

  return app;
}

export const appServer = bootstrap();
