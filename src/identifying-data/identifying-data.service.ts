import { Injectable, Inject } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { AuthService } from 'src/auth/auth.service';
import { IdentifyingDataOptions } from './identifying-data.options';
import { IDENTIFYING_DATA_OPTIONS } from './identifying-data.constants';
import { GetIdentifyingDataResponse } from './dto/get-identifying-data.response';
import { ServerError } from 'src/common/errors/server.error';

@Injectable()
export class IdentifyingDataService {
  private readonly axiosInstance: AxiosInstance;

  constructor(
    @Inject(IDENTIFYING_DATA_OPTIONS)
    private readonly options: IdentifyingDataOptions,
    private readonly authService: AuthService,
  ) {
    this.axiosInstance = axios.create({
      baseURL: options.identifyingApi,
    });
  }

  async getIdentifyingData(
    studentNumber: string,
  ): Promise<GetIdentifyingDataResponse[]> {
    const accessToken = await this.authService.getAccessToken();
    try {
      const result = await this.axiosInstance.get<GetIdentifyingDataResponse[]>(
        `/student/by_student_id?student_id=${studentNumber}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      return result.data;
    } catch (err) {
      throw new ServerError('Failed to get identifying id for student', err);
    }
  }
}
