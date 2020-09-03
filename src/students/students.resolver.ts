import { Resolver, Query } from '@nestjs/graphql';
import { StudentsService } from './students.service';
import { Student } from './models/student.model';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from 'src/common/interfaces/user.interface';

@Resolver(_of => Student)
export class StudentsResolver {
  constructor(private readonly studentsService: StudentsService) {}

  @Query(_returns => Student)
  @UseGuards(GqlAuthGuard)
  async getStudent(@CurrentUser() user: User): Promise<Student> {
    const result = await this.studentsService.getStudent(user.userId);
    return result;
  }
}
