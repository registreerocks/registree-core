import { Resolver, Query, Mutation } from '@nestjs/graphql';
import { StudentsService } from '../students.service';
import { Student } from '../models/student.model';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from 'src/common/interfaces/user.interface';

@Resolver(_of => Student)
export class StudentsResolver {
  constructor(private readonly studentsService: StudentsService) {}

  @Query(_returns => Student)
  async getStudent(@CurrentUser() user: User): Promise<Student> {
    const result = await this.studentsService.getStudent(user.userId);
    return result;
  }

  @Query(_returns => Date)
  async studentPrivacyPolicy(@CurrentUser() user: User): Promise<Date> {
    const result = await this.studentsService.getStudentPrivacyPolicyReadDate(
      user.userId,
    );
    return result;
  }

  @Mutation(_returns => Date)
  async setStudentPrivacyPolicy(@CurrentUser() user: User): Promise<Date> {
    const result = await this.studentsService.setStudentPrivacyPolicyReadDate(
      user.userId,
    );
    return result;
  }
}
