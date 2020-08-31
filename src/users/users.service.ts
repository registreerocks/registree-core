import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { Contact } from 'src/customers/models/contact.model';
import { Auth0DataService } from 'src/auth0-data/auth0-data.service';
import { CreateUserRequest } from 'src/auth0-data/dto/create-user.request';
import { CreateUserResponse } from 'src/auth0-data/dto/create-user.response';
import * as crypto from 'crypto';

@Injectable()
export class UsersService {
  constructor(private readonly auth0DataService: Auth0DataService) {}

  async createUser(input: CreateUserInput): Promise<Contact> {
    const user = await this.auth0DataService.createUser(
      this.createUserRequestMapper(input),
    );
    return this.createUserResponseMapper(user);
  }

  private createUserRequestMapper(input: CreateUserInput): CreateUserRequest {
    return {
      ...input,
      blocked: false,
      connection: '',
      email_verified: false,
      password: crypto.randomBytes(20).toString('base64'),
      verify_email: true,
      app_metadata: {
        roles: ['recruiter'],
      },
    };
  }

  private createUserResponseMapper(response: CreateUserResponse): Contact {
    return {
      name: response.name,
      email: response.email,
      userId: response.user_id,
    };
  }
}
