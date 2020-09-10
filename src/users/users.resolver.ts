import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { Contact } from './models/contact.model';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from 'src/common/interfaces/user.interface';

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
  async getUser(@CurrentUser() user: User): Promise<Contact> {
    const result = await this.usersService.getUser(user.userId);
    return result;
  }

  @Mutation(_returns => Contact)
  @UseGuards(GqlAuthGuard)
  async updateUser(
    @CurrentUser() user: User,
    @Args({ name: 'updateUserInput', type: () => UpdateUserInput })
    input: UpdateUserInput,
  ): Promise<Contact> {
    const result = await this.usersService.updateUser(user.userId, input);
    return result;
  }
}
