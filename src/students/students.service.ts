import { Injectable } from '@nestjs/common';
import { Student } from './models/student.model';
import { Auth0DataService } from 'src/auth0-data/auth0-data.service';
import { GetUserResponse } from 'src/auth0-data/dto/get-user.response';
import { UpdateUserRequest } from 'src/auth0-data/dto/update-user.request';

@Injectable()
export class StudentsService {
  constructor(private readonly auth0DataService: Auth0DataService) {}

  async getStudent(userId: string): Promise<Student> {
    const user = await this.auth0DataService.getUser(userId);
    return this.getStudentResponseMapper(user);
  }

  async acceptedPrivacyPolicy(userId: string): Promise<boolean> {
    const privacyPolicyVersionDate = new Date('2020-05-20');
    const user = await this.auth0DataService.getUser(userId);
    const userPrivacyPolicyReadDate = user.app_metadata.privacyPolicy
      ? new Date(user.app_metadata.privacyPolicy)
      : new Date(0);
    return privacyPolicyVersionDate <= userPrivacyPolicyReadDate;
  }

  async acceptPrivacyPolicy(userId: string) {
    const readDate = new Date();
    await this.auth0DataService.updateUser(
      userId,
      this.setPrivacyPolicyRequestMapper(readDate),
    );
    return readDate;
  }

  private getStudentResponseMapper(response: GetUserResponse): Student {
    return {
      name: response.app_metadata.name,
      email: response.app_metadata.uniEmail,
      userId: response.user_id,
      studentNumber: response.app_metadata.db_id,
    };
  }

  private setPrivacyPolicyRequestMapper(readDate: Date): UpdateUserRequest {
    return {
      app_metadata: {
        privacyPolicy: readDate.toISOString(),
      },
    };
  }
}
