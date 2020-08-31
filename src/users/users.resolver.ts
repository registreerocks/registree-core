import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { Contact } from 'src/customers/models/contact.model';
import { CreateUserInput } from './dto/create-user.input';

@Resolver(_of => Contact)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(_returns => Contact)
  async createUser(
    @Args({ name: 'createUserInput', type: () => CreateUserInput })
    input: CreateUserInput,
  ): Promise<Contact> {
    const result = await this.usersService.createUser(input);
    return result;
  }
}
