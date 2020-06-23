import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { CustomersModule } from './customers/customers.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { QueriesModule } from './queries/queries.module';
import { DegreesModule } from './degrees/degrees.module';
import appConfig from './config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
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
