import { Module, DynamicModule } from '@nestjs/common';
import { UniversitiesService } from './universities.service';
import { StudentDataAsyncOptions } from 'src/student-data/student-data.options';
import { StudentDataModule } from 'src/student-data/student-data.module';
import { UniversitiesResolver } from './resolvers/universities.resolver';
import { FacultiesResolver } from './resolvers/faculties.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { DegreeSchema, Degree } from './models/degree.model';
import { Faculty, FacultySchema } from './models/faculty.model';
import { University, UniversitySchema } from './models/university.model';
import { DegreesResolver } from './resolvers/degrees.resolver';
import { FacultiesLoader } from './loaders/faculties.loader';
import { UniversitiesLoader } from './loaders/universities.loader';
import { DegreesLoader } from './loaders/degrees.loader';
import { FacultyDegreesLoader } from './loaders/faculty-degrees.loader';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Degree.name, schema: DegreeSchema },
      { name: Faculty.name, schema: FacultySchema },
      { name: University.name, schema: UniversitySchema },
    ]),
  ],

  providers: [
    UniversitiesService,
    UniversitiesResolver,
    FacultiesResolver,
    DegreesResolver,
    FacultiesLoader,
    UniversitiesLoader,
    DegreesLoader,
    FacultyDegreesLoader,
  ],
  exports: [UniversitiesService, FacultyDegreesLoader],
})
export class UniversitiesModule {
  static forRootAsync(options: StudentDataAsyncOptions): DynamicModule {
    return {
      module: UniversitiesModule,
      imports: [StudentDataModule.forRootAsync(options)],
    };
  }
}
