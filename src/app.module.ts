import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DatabaseConfig } from './config/database.config';
import { configuration } from './config/configuration';

import LogsMiddleware from './middlewares/logger.middleware';

import { AuthModule } from './api/auth/auth.module';
import { UserModule } from './api/user/user.module';
import { HealthController } from './api/health/health.controller';
import { TransactionModule } from './api/transaction/transaction.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: DatabaseConfig,
    }),
    UserModule,
    AuthModule,
    TransactionModule,
  ],
  controllers: [HealthController],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogsMiddleware).forRoutes('*');
  }
}
