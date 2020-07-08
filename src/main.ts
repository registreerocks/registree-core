import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { AppConfigService } from './app-config/app-config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {logger: false});
  app.useLogger(app.get(Logger));
  const appConfig = app
    .get<AppConfigService>(AppConfigService)
    .createAppParams();
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(appConfig.port ?? '3000', appConfig.host ?? 'localhost');
}
void bootstrap();
