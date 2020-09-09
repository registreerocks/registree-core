import { Resolver, Query } from '@nestjs/graphql';
import { StudentsService } from '../students.service';
import { Student } from '../models/student.model';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from 'src/common/interfaces/user.interface';
import { StudentEventQuery } from '../models/student-event-query.model';
import { CustomersService } from 'src/customers/customers.service';

@Resolver(_of => Student)
export class StudentsResolver {
  constructor(
    private readonly studentsService: StudentsService,
    private readonly customersService: CustomersService,
  ) {}

  @Query(_returns => Student)
  @UseGuards(GqlAuthGuard)
  async getStudent(@CurrentUser() user: User): Promise<Student> {
    const result = await this.studentsService.getStudent(user.userId);
    return result;
  }

  @Query(_returns => [StudentEventQuery])
  @UseGuards(GqlAuthGuard)
  async getStudentQueries(
    @CurrentUser() user: User,
  ): Promise<StudentEventQuery[]> {
    const result = await this.studentsService.getStudentQueries(user.dbId);
    return result;
  }
}
