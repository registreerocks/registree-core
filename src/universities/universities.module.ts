import { Module, DynamicModule } from '@nestjs/common';
import { UniversitiesService } from './universities.service';
import { StudentDataAsyncOptions } from 'src/student-data/student-data.options';
import { StudentDataModule } from 'src/student-data/student-data.module';
import { UniversitiesResolver } from './resolvers/universities.resolver';
import { FacultiesResolver } from './resolvers/faculties.resolver';

@Module({
  providers: [UniversitiesService, UniversitiesResolver, FacultiesResolver],
})
export class UniversitiesModule {
  static forRootAsync(options: StudentDataAsyncOptions): DynamicModule {
    return {
      module: UniversitiesModule,
      imports: [StudentDataModule.forRootAsync(options)],
    };
  }
}
