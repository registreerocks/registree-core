import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { CustomersModule } from './customers/customers.module';
import { ContactsModule } from './contacts/contacts.module';
import { StudentsModule } from './students/students.module';
import { AuthModule } from './auth/auth.module';
import { QueriesModule } from './queries/queries.module';
import { LoggerModule } from 'nestjs-pino';
import * as stdSerializers from 'pino-std-serializers';
import { AppConfigModule } from './app-config/app-config.module';
import { AppConfigService } from './app-config/app-config.service';
import { UniversitiesModule } from './universities/universities.module';
import { appConstants } from './constants';
import { MongooseModule } from '@nestjs/mongoose';
import { applyMiddleware } from 'graphql-middleware';
import { IncomingMessage } from 'http';
import { throwNestedErrorPlugin } from './get-nested-error';
import { appPermissions } from './rules';
import { gqlAuthMiddleware } from './auth/gql-auth.middleware';
import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { DataLoaderInterceptor } from 'nestjs-graphql-dataloader';
import { AllExceptionsFilter } from './all-exceptions.filter';
import { ErrorContextInterceptor } from './common/error-context.interceptor';
import { StudentLinkingModule } from './student-linking/student-linking.module';
import { HealthController } from './health/health.controller';
import { TerminusModule } from '@nestjs/terminus';

@Module({
  imports: [
    AppConfigModule,
    LoggerModule.forRootAsync({
      inject: [AppConfigService],
      useFactory: (configService: AppConfigService) => {
        const appConfig = configService.createAppParams();
        /* eslint-disable @typescript-eslint/no-unsafe-assignment */
        /* eslint-disable @typescript-eslint/no-unsafe-member-access*/
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
        /* eslint-enable @typescript-eslint/no-unsafe-assignment */
        /* eslint-enable @typescript-eslint/no-unsafe-member-access*/
      },
    }),
    MongooseModule.forRootAsync({
      useExisting: AppConfigService,
    }),
    GraphQLModule.forRoot({
      context: ({ req }: { req: IncomingMessage }) => ({
        req,
      }),
      autoSchemaFile: join(process.cwd(), 'src/schema.graphql'),
      sortSchema: true, // Keep the schema in a durable order for version control.
      uploads: {
        maxFileSize: appConstants.fileSize * 1000 * 1000,
        maxFiles: 5,
      },
      introspection: true,
      plugins: [throwNestedErrorPlugin],
      transformSchema: schema => {
        const newSchema = applyMiddleware(
          schema,
          { Query: gqlAuthMiddleware, Mutation: gqlAuthMiddleware },
          appPermissions,
        );

        return newSchema;
      },
    }),
    CustomersModule.forRootAsync({
      useExisting: AppConfigService,
    }),
    ContactsModule.forRootAsync({
      useExisting: AppConfigService,
    }),
    StudentsModule.forRootAsync({
      useExisting: AppConfigService,
    }),
    AuthModule.forRootAsync({
      useExisting: AppConfigService,
    }),
    QueriesModule.forRootAsync({
      useExisting: AppConfigService,
    }),
    UniversitiesModule,
    StudentLinkingModule.forRootAsync({
      useExisting: AppConfigService,
    }),
    TerminusModule,
  ],
  controllers: [AppController, HealthController],
  providers: [
    AppService,
    { provide: APP_INTERCEPTOR, useClass: DataLoaderInterceptor },
    { provide: APP_INTERCEPTOR, useClass: ErrorContextInterceptor },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
  ],
})
export class AppModule {}
