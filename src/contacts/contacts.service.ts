import { Injectable } from '@nestjs/common';
import { CreateContactInput } from './dto/create-contact.input';
import { UpdateContactInput } from './dto/update-contact.input';
import { Contact } from './models/contact.model';
import { Auth0DataService } from 'src/auth0-data/auth0-data.service';
import { CreateUserRequest } from 'src/auth0-data/dto/create-user.request';
import { CreateUserResponse } from 'src/auth0-data/dto/create-user.response';
import { UpdateUserRequest } from 'src/auth0-data/dto/update-user.request';
import { UpdateUserResponse } from 'src/auth0-data/dto/update-user.response';
import * as crypto from 'crypto';
import { CustomersService } from 'src/customers/customers.service';
import _ from 'lodash';
import { mapContact } from './mappers/map-contact';

@Injectable()
export class ContactsService {
  constructor(
    private readonly auth0DataService: Auth0DataService,
    private readonly customersService: CustomersService,
  ) {}

  async createContact(
    input: CreateContactInput,
    customerId: string,
  ): Promise<Contact> {
    const user = await this.auth0DataService.createUser(
      this.createContactRequestMapper(input),
    );
    const contact = this.createContactResponseMapper(user);
    await this.customersService.addContact(customerId, user.user_id);
    return contact;
  }

  async getContact(userId: string): Promise<Contact> {
    const user = await this.auth0DataService.getUser(userId);
    return mapContact(user);
  }

  async getCalendlyContacts(): Promise<Contact[]> {
    const contacts = await this.auth0DataService.getCalendlyUsers();
    return contacts.map(mapContact);
  }

  async updateContact(
    userId: string,
    input: UpdateContactInput,
  ): Promise<Contact> {
    const userToUpdate = await this.getContact(userId);
    const inputDiff = _.omitBy(input, (val, key) => userToUpdate[key] === val);

    if (_.isEmpty(inputDiff)) {
      return userToUpdate;
    } else {
      const user = await this.auth0DataService.updateUser(
        userId,
        this.updateContactRequestMapper(inputDiff),
      );
      return this.updateContactResponseMapper(user);
    }
  }

  private createContactRequestMapper(
    input: CreateContactInput,
  ): CreateUserRequest {
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

  private createContactResponseMapper(response: CreateUserResponse): Contact {
    return {
      name: response.name,
      email: response.email,
      userId: response.user_id,
      dbId: response.app_metadata.db_id,
    };
  }

  private updateContactRequestMapper(
    input: UpdateContactInput,
  ): UpdateUserRequest {
    const request = {};
    Object.assign(
      request,
      input.name ? { name: input.name } : null,
      input.password ? { password: input.password } : null,
      input.email
        ? { email: input.email, email_verified: false, verify_email: true }
        : null,
      input.calendlyLink
        ? { app_metadata: { calendlyLink: input.calendlyLink } }
        : null,
    );
    return request;
  }

  private updateContactResponseMapper(response: UpdateUserResponse): Contact {
    return {
      name: response.name,
      email: response.email,
      userId: response.user_id,
      dbId: response.app_metadata.db_id,
      calendlyLink: response.app_metadata.calendlyLink,
    };
  }
}
