import { Module, DynamicModule } from '@nestjs/common';
import { StudentsResolver } from './resolvers/students.resolver';
import { StudentsService } from './students.service';
import { Auth0DataModule } from 'src/auth0-data/auth0-data.module';
import { Auth0DataAsyncOptions } from 'src/auth0-data/auth0-data.options';

@Module({
  providers: [StudentsResolver, StudentsService],
  exports: [StudentsService],
})
export class StudentsModule {
  static forRootAsync(options: Auth0DataAsyncOptions): DynamicModule {
    return {
      module: StudentsModule,
      imports: [Auth0DataModule.forRootAsync(options)],
    };
  }
}
