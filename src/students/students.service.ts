import { Injectable } from '@nestjs/common';
import { Student } from './models/student.model';
import { Auth0DataService } from 'src/auth0-data/auth0-data.service';
import { GetUserResponse } from 'src/auth0-data/dto/get-user.response';

@Injectable()
export class StudentsService {
  constructor(private readonly auth0DataService: Auth0DataService) {}

  async getStudent(userId: string): Promise<Student> {
    const user = await this.auth0DataService.getUser(userId);
    return this.getStudentResponseMapper(user);
  }

  private getStudentResponseMapper(response: GetUserResponse): Student {
    return {
      name: response.app_metadata.name,
      email: response.app_metadata.uniEmail,
      userId: response.user_id,
      studentNumber: response.app_metadata.db_id,
    };
  }
}
