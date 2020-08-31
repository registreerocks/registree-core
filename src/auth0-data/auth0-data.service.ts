import { Injectable, Inject } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { AuthService } from 'src/auth/auth.service';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { AUTH0_DATA_OPTIONS } from './auth0-data.constants';
import { Auth0DataOptions } from './auth0-data.options';
import { CreateUserRequest } from './dto/create-user.request';
import { CreateUserResponse } from './dto/create-user.response';

@Injectable()
export class Auth0DataService {
  private readonly axiosInstance: AxiosInstance;
  private readonly connection: string;

  constructor(
    @Inject(AUTH0_DATA_OPTIONS) private readonly options: Auth0DataOptions,
    private readonly authService: AuthService,
    @InjectPinoLogger(Auth0DataService.name)
    private readonly logger: PinoLogger,
  ) {
    this.axiosInstance = axios.create({
      baseURL: options.managementApi,
    });
    this.connection = options.connection;
  }

  async createUser(request: CreateUserRequest): Promise<CreateUserResponse> {
    const accessToken = await this.authService.getManagementToken();
    request.connection = this.connection;

    const result = await this.axiosInstance.post<CreateUserResponse>(
      '/users',
      request,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return result.data;
  }
}
