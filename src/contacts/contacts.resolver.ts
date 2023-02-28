import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { ContactsService } from './contacts.service';
import { Contact } from './models/contact.model';
import { CreateContactInput } from './dto/create-contact.input';
import { UpdateContactInput } from './dto/update-contact.input';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from 'src/common/interfaces/user.interface';

@Resolver(_of => Contact)
export class ContactsResolver {
  constructor(private readonly contactsService: ContactsService) {}

  @Mutation(_returns => Contact)
  async createContact(
    @Args({ name: 'createContactInput', type: () => CreateContactInput })
    input: CreateContactInput,
    @Args({ name: 'customerId', type: () => ID })
    customerId: string,
  ): Promise<Contact> {
    const result = await this.contactsService.createContact(input, customerId);
    return result;
  }

  @Query(_returns => Contact)
  async getContact(@CurrentUser() user: User): Promise<Contact> {
    const result = await this.contactsService.getContact(user.userId);
    return result;
  }

  @Mutation(_returns => Contact)
  async updateContact(
    @CurrentUser() user: User,
    @Args({ name: 'updateUserInput', type: () => UpdateContactInput })
    input: UpdateContactInput,
  ): Promise<Contact> {
    const result = await this.contactsService.updateContact(user.userId, input);
    return result;
  }

  @Query(_returns => [Contact])
  async getCalendlyContacts(): Promise<Contact[]> {
    return this.contactsService.getCalendlyContacts();
  }
}
