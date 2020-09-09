import { Injectable, Inject } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { AuthService } from 'src/auth/auth.service';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { LinkingDataOptions } from './linking-data.options';
import { LINKING_DATA_OPTIONS } from './linking-data.constants';

@Injectable()
export class LinkingDataService {
  private readonly axiosInstance: AxiosInstance;

  constructor(
    @Inject(LINKING_DATA_OPTIONS)
    private readonly options: LinkingDataOptions,
    private readonly authService: AuthService,
    @InjectPinoLogger(LinkingDataService.name)
    private readonly logger: PinoLogger,
  ) {
    this.axiosInstance = axios.create({
      baseURL: options.linkingApi,
    });
  }

  async getTranscriptId(
    identifyingId: string,
    identifyingUrl: string,
  ): Promise<string> {
    const accessToken = await this.authService.getAccessToken();
    try {
      const result = await this.axiosInstance.get<string>(
        `/nft/get_id?ident_id=${identifyingId}&ident_url=${identifyingUrl}`,
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
        'Failed to get transcript id for student %s on %s',
        identifyingId,
        identifyingUrl,
      );
      /* eslint-enable @typescript-eslint/no-unsafe-assignment */
      throw err;
    }
  }
}
