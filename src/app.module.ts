import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { CustomersModule } from './customers/customers.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { QueriesModule } from './queries/queries.module';
import { DegreesModule } from './degrees/degrees.module';
import { LoggerModule, Logger } from 'nestjs-pino';
import * as stdSerializers from 'pino-std-serializers';
import appConfig from './config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
    }),
    LoggerModule.forRootAsync({
      imports: [ConfigModule.forRoot({ load: [appConfig] })],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          pinoHttp: {
            serializers: {
              err: stdSerializers.err,
            },
            redact: [
              'err.config.headers.Authorization',
              'err.config.headers.authorization',
            ],
            useLevel: configService.get<LogLevel>('app.httpLogLevel') || 'info',
          },
        };
      },
    }),
    GraphQLModule.forRoot({
      context: ({ req }) => ({ req }),
      autoSchemaFile: join(process.cwd(), 'src/schema.graphql'),
      uploads: true,
      introspection: true,
    }),
    CustomersModule,
    AuthModule,
    QueriesModule,
    DegreesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

type LogLevel = 'info' | 'debug' | 'warn' | 'error';
