import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { Contact } from 'src/customers/models/contact.model';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { UseGuards } from '@nestjs/common';

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

  @Query(_returns => Contact)
  @UseGuards(GqlAuthGuard)
  async getUser(
    @Args({ name: 'userId', type: () => ID })
    userId: string,
  ): Promise<Contact> {
    const result = await this.usersService.getUser(userId);
    return result;
  }

  @Mutation(_returns => Contact)
  async updateUser(
    @Args({ name: 'userId', type: () => ID })
    userId: string,
    @Args({ name: 'updateUserInput', type: () => UpdateUserInput })
    input: UpdateUserInput,
  ): Promise<Contact> {
    const result = await this.usersService.updateUser(userId, input);
    return result;
  }
}
