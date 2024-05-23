import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as morgan from 'morgan';

import { AppModule } from './app.module';
import { TransformInterceptor } from './interceptors/response.interceptor';

async function bootstrap() {
  const port = parseInt(process.env.APP_PORT, 10);
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['debug'],
  });
  const logger = new Logger('Bootstrap');

  logger.debug('Port: ' + port);

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useGlobalInterceptors(new TransformInterceptor(new Reflector()));
  app.use(morgan('dev'));

  await app.listen(port || 3000);

  logger.debug('App is running on port: ' + port);
}
bootstrap();
