import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CustomersDataProvider {
  private readonly axiosInstance: AxiosInstance;

  constructor(private readonly configService: ConfigService) {
    const endpoint = this.configService.get<string>('api.customerApi', '');
    console.log(endpoint);
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
    } catch (error) {
      // TODO move to a helper method
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
      console.log(error.config);
      throw error;
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
