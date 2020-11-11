import { Injectable, Inject } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { AuthService } from 'src/auth/auth.service';
import { LinkingDataOptions } from './linking-data.options';
import { LINKING_DATA_OPTIONS } from './linking-data.constants';
import { ServerError } from 'src/common/errors/server.error';

@Injectable()
export class LinkingDataService {
  private readonly axiosInstance: AxiosInstance;

  constructor(
    @Inject(LINKING_DATA_OPTIONS)
    private readonly options: LinkingDataOptions,
    private readonly authService: AuthService,
  ) {
    this.axiosInstance = axios.create({
      baseURL: options.linkingApi,
    });
  }

  async getTranscriptId(identifyingId: string): Promise<string> {
    const accessToken = await this.authService.getAccessToken();
    try {
      const result = await this.axiosInstance.get<string>(
        `/nft/get_id?ident_id=${identifyingId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      return result.data;
    } catch (err) {
      throw new ServerError('Failed to get transcript id for student', err);
    }
  }
}
