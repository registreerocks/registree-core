import { Injectable, Inject } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { AuthService } from 'src/auth/auth.service';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { IdentifyingDataOptions } from './identifying-data.options';
import { IDENTIFYING_DATA_OPTIONS } from './identifying-data.constants';
import { GetIdentifyingDataResponse } from './dto/get-identifying-data.response';

@Injectable()
export class IdentifyingDataService {
  private readonly axiosInstance: AxiosInstance;

  constructor(
    @Inject(IDENTIFYING_DATA_OPTIONS)
    private readonly options: IdentifyingDataOptions,
    private readonly authService: AuthService,
    @InjectPinoLogger(IdentifyingDataService.name)
    private readonly logger: PinoLogger,
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
      /* eslint-disable @typescript-eslint/no-unsafe-assignment */
      this.logger.error(
        { err },
        'Failed to get identifying id for student %s',
        studentNumber,
      );
      /* eslint-enable @typescript-eslint/no-unsafe-assignment */
      throw err;
    }
  }
}
