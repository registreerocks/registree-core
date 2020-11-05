import { Injectable, Inject } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { StudentDataOptions } from './student-data.options';
import { AuthService } from 'src/auth/auth.service';
import { STUDENT_DATA_OPTIONS } from './student-data.constants';
import { UniversityResponse } from './dto/university.response';
import { FacultyResponse } from './dto/faculty.response';
import { DegreeResponse } from './dto/degree.response';
import { ServerError } from 'src/common/errors/server.error';

@Injectable()
export class StudentDataService {
  // This will work with multiple universities, but will scale horribly since we
  // are not storing the endpoints by a universityID.
  private readonly axiosInstances: AxiosInstance[];

  constructor(
    @Inject(STUDENT_DATA_OPTIONS) private readonly options: StudentDataOptions,
    private readonly authService: AuthService,
  ) {
    this.axiosInstances = options.studentApis.map(api =>
      axios.create({
        baseURL: api,
      }),
    );
  }

  async getUniversities(): Promise<UniversityResponse[]> {
    const accessToken = await this.authService.getAccessToken();
    try {
      const results = await Promise.all(
        this.axiosInstances.map(instance =>
          instance
            .get<UniversityResponse[]>('university/get_all', {
              params: {
                meta_flag: false,
              },
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            })
            .then(result => result.data),
        ),
      );
      return results.flat();
    } catch (err) {
      throw new ServerError('Failed to get all universities', err);
    }
  }

  async getUniversityFaculties(
    universityId: string,
  ): Promise<FacultyResponse[]> {
    const accessToken = await this.authService.getAccessToken();
    const results = await Promise.all(
      this.axiosInstances.map(instance =>
        instance
          .get<FacultyResponse[]>('university/get_faculties', {
            params: {
              id: universityId,
              meta_flag: false,
            },
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then(result => result.data),
      ),
    );

    return results.flat();
  }

  async getFacultyDegrees(facultyId: string): Promise<DegreeResponse[]> {
    const accessToken = await this.authService.getAccessToken();
    const results = await Promise.all(
      this.axiosInstances.map(instance =>
        instance
          .get<DegreeResponse[]>('faculty/get_degrees', {
            params: {
              id: facultyId,
              meta_flag: false,
            },
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then(result => result.data),
      ),
    );

    return results.flat();
  }
}
