import { Type } from '@nestjs/common';

export interface StudentDataOptions {
  studentApis: string[];
}
export interface StudentDataAsyncOptions {
  useExisting: Type<StudentDataOptionsFactory>;
}
export interface StudentDataOptionsFactory {
  createStudentDataOptions(): Promise<StudentDataOptions> | StudentDataOptions;
}
