import { Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { StudentLink } from './models/student-link.model';
import { Student } from 'src/students/models/student.model';
import { StudentsService } from 'src/students/students.service';

@Resolver(_of => StudentLink)
export class StudentLinkingResolver {
  constructor(private readonly studentsService: StudentsService) {}

  @ResolveField('student', _returns => Student, { nullable: true })
  async getStudent(
    @Parent() studentLink: StudentLink,
  ): Promise<Student | null> {
    if (studentLink.student?.userId) {
      return this.studentsService.getStudent(studentLink.student.userId);
    }
    return null;
  }
}
