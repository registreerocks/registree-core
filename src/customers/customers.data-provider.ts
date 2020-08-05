import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { ConfigService } from '@nestjs/config';
import { PinoLogger, InjectPinoLogger } from 'nestjs-pino';

@Injectable()
export class CustomersDataProvider {
  private readonly axiosInstance: AxiosInstance;

  constructor(
    private readonly configService: ConfigService,
    @InjectPinoLogger(CustomersDataProvider.name)
    private readonly logger: PinoLogger,
  ) {
    const endpoint = this.configService.get<string>('api.customerApi', '');
    this.axiosInstance = axios.create({
      baseURL: endpoint,
    });
  }

  async findOneCustomer(id: string, token: string): Promise<customerResponse> {
    try {
      const result = await this.axiosInstance.get<customerResponse>(
        `/customer/${id}`,
        {
          headers: {
            Authorization: token,
          },
        },
      );
      return result.data;
    } catch (err) {
      /* eslint-disable @typescript-eslint/no-unsafe-assignment */
      this.logger.error({ err }, 'Failed to retrieve customer by id: ', id);
      /* eslint-enable @typescript-eslint/no-unsafe-assignment */
      throw err;
    }
  }
}

type customerResponse = {
  _id: string;
  billing_address: {
    city: string;
    country: string;
    line_1: string;
    line_2: string;
    province: string;
    zip: string;
  };
  contact: {
    email: string;
    name: string;
  };
  description: string;
  name: string;
  vat: string;
};
