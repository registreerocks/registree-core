import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { CustomersModule } from './customers/customers.module';
import { AuthModule } from './auth/auth.module';
import { QueriesModule } from './queries/queries.module';
import { DegreesModule } from './degrees/degrees.module';
import { LoggerModule } from 'nestjs-pino';
import * as stdSerializers from 'pino-std-serializers';
import { IncomingMessage } from 'http';
import { AppConfigModule } from './app-config/app-config.module';
import { AppConfigService } from './app-config/app-config.service';
import { appConstants } from './constants';

@Module({
  imports: [
    AppConfigModule,
    LoggerModule.forRootAsync({
      inject: [AppConfigService],
      useFactory: (configService: AppConfigService) => {
        const appConfig = configService.createAppParams();
        return {
          pinoHttp: {
            serializers: {
              err: stdSerializers.err,
            },
            redact: [
              'err.config.headers.Authorization',
              'err.config.headers.authorization',
            ],
            useLevel: appConfig.httpLogLevel,
          },
        };
      },
    }),
    GraphQLModule.forRoot({
      context: ({ req }: { req: IncomingMessage }) => ({
        req,
      }),
      autoSchemaFile: join(process.cwd(), 'src/schema.graphql'),
      uploads: {
        maxFileSize: appConstants.fileSize * 1000 * 1000,
        maxFiles: 5,
      },
      introspection: true,
    }),
    CustomersModule,
    AuthModule.forRootAsync({
      useExisting: AppConfigService,
    }),
    QueriesModule.forRootAsync({
      useExisting: AppConfigService,
    }),
    DegreesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
