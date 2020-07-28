import { ObjectType, ID, Field } from '@nestjs/graphql';
import { Student } from 'src/students/models/student.model';

@ObjectType()
export class StudentLink {
  @Field(_type => ID)
  id!: string;

  @Field(_type => Student, { nullable: true })
  student?: Student;
}
