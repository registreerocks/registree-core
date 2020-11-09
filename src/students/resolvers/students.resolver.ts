import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
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

  @Query(_returns => Boolean)
  async studentHasReadPrivacyPolicyVersion(
    @CurrentUser() user: User,
    @Args({ name: 'privacyPolicyVersionDate', type: () => Date })
    privacyPolicyVersionDate: Date,
  ): Promise<boolean> {
    const result = await this.studentsService.studentReadPrivacyPolicyVersion(
      user.userId,
      privacyPolicyVersionDate,
    );
    return result;
  }

  @Mutation(_returns => Date)
  async setStudentPrivacyPolicyReadDate(
    @CurrentUser() user: User,
  ): Promise<Date> {
    const result = await this.studentsService.setStudentPrivacyPolicyReadDate(
      user.userId,
    );
    return result;
  }
}
