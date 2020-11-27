import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { AppConfigService } from './app-config/app-config.service';
import { set as setMongooseProp } from 'mongoose';
import { ArgumentValidationError } from './common/errors/argument-validation.error';

async function bootstrap() {
  setMongooseProp('debug', process.env.NODE_ENV === 'develop');
  const app = await NestFactory.create(AppModule, {
    logger: process.env.NODE_ENV === 'develop' ? undefined : false,
  });
  app.useLogger(app.get(Logger));
  const appConfig = app
    .get<AppConfigService>(AppConfigService)
    .createAppParams();
  app.enableShutdownHooks();
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: errors => new ArgumentValidationError(errors),
    }),
  );
  await app.listen(appConfig.port ?? '3000', appConfig.host ?? 'localhost');
}
void bootstrap();
