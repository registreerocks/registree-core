import { Module, DynamicModule } from '@nestjs/common';
import { StudentLinkingResolver } from './student-linking.resolver';
import { StudentsModule } from 'src/students/students.module';
import { Auth0DataAsyncOptions } from 'src/auth0-data/auth0-data.options';

@Module({
  providers: [StudentLinkingResolver],
})
export class StudentLinkingModule {
  static forRootAsync(options: Auth0DataAsyncOptions): DynamicModule {
    return {
      module: StudentLinkingModule,
      imports: [StudentsModule.forRootAsync(options)],
    };
  }
}
