import { Module, DynamicModule, Provider } from '@nestjs/common';
import { StudentDataService } from './student-data.service';
import {
  StudentDataOptionsFactory,
  StudentDataOptions,
  StudentDataAsyncOptions,
} from './student-data.options';
import { STUDENT_DATA_OPTIONS } from './student-data.constants';

@Module({
  providers: [StudentDataService],
  exports: [StudentDataService],
})
export class StudentDataModule {
  static forRootAsync(options: StudentDataAsyncOptions): DynamicModule {
    const optionsProvider: Provider<
      StudentDataOptions | Promise<StudentDataOptions>
    > = {
      provide: STUDENT_DATA_OPTIONS,
      useFactory: async (optionsFactory: StudentDataOptionsFactory) =>
        await optionsFactory.createStudentDataOptions(),
      inject: [options.useExisting],
    };
    return {
      module: StudentDataModule,
      providers: [optionsProvider],
    };
  }
}
