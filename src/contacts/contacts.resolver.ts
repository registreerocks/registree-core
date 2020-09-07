import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ContactsService } from './contacts.service';
import { Contact } from './models/contact.model';
import { CreateContactInput } from './dto/create-contact.input';
import { UpdateContactInput } from './dto/update-contact.input';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from 'src/common/interfaces/user.interface';

@Resolver(_of => Contact)
export class ContactsResolver {
  constructor(private readonly usersService: ContactsService) {}

  @Mutation(_returns => Contact)
  async createContact(
    @Args({ name: 'createUserInput', type: () => CreateContactInput })
    input: CreateContactInput,
  ): Promise<Contact> {
    const result = await this.usersService.createContact(input);
    return result;
  }

  @Query(_returns => Contact)
  @UseGuards(GqlAuthGuard)
  async getContact(@CurrentUser() user: User): Promise<Contact> {
    const result = await this.usersService.getContact(user.userId);
    return result;
  }

  @Mutation(_returns => Contact)
  @UseGuards(GqlAuthGuard)
  async updateContact(
    @CurrentUser() user: User,
    @Args({ name: 'updateUserInput', type: () => UpdateContactInput })
    input: UpdateContactInput,
  ): Promise<Contact> {
    const result = await this.usersService.updateContact(user.userId, input);
    return result;
  }
}
