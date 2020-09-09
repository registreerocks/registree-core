import { Injectable } from '@nestjs/common';
import { Student } from './models/student.model';
import { Auth0DataService } from 'src/auth0-data/auth0-data.service';
import { GetUserResponse } from 'src/auth0-data/dto/get-user.response';
import { QueryDataService } from 'src/query-data/query-data.service';
import { LinkingDataService } from 'src/linking-data/linking-data.service';
import { IdentifyingDataService } from 'src/identifying-data/identifying-data.service';
import { StudentEventQuery } from './models/student-event-query.model';
import { mapStudentEventQuery } from './mappers/map-student-event-query';

@Injectable()
export class StudentsService {
  constructor(
    private readonly auth0DataService: Auth0DataService,
    private readonly queryDataService: QueryDataService,
    private readonly linkingDataService: LinkingDataService,
    private readonly identifyingDataService: IdentifyingDataService,
  ) {}

  async getStudent(userId: string): Promise<Student> {
    const user = await this.auth0DataService.getUser(userId);
    return this.getStudentResponseMapper(user);
  }

  async getStudentQueries(studentNumber: string): Promise<StudentEventQuery[]> {
    const identifyingData = await this.identifyingDataService.getIdentifyingData(
      studentNumber,
    );
    const transcriptId = await this.linkingDataService.getTranscriptId(
      identifyingData[0]['_id'],
      'http://localhost:8001',
    );
    const details = await this.queryDataService.getStudentQueries(transcriptId);
    return details.map(mapStudentEventQuery);
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
