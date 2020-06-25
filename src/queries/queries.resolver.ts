import { Resolver, Mutation, Args, Query, ID } from '@nestjs/graphql';
import { EventQuery } from './models/event-query.model';
import { CreateEventQueryInput } from './dto/create-event-query.input';
import { QueriesService } from './queries.service';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { findManyCursor } from 'src/common/pagination/find-many-cursors';
import { PaginationArgs } from 'src/common/pagination/pagination-args';
import { EventQueryConnection } from './models/pagination/event-query-connection.model';
import { paginateArray } from 'src/common/pagination/paginate-array';
import { User } from 'src/common/interfaces/user.interface';

@Resolver(_of => EventQuery)
export class QueriesResolver {
  constructor(private readonly queriesService: QueriesService) {}

  @Mutation(_returns => EventQuery)
  @UseGuards(GqlAuthGuard)
  async createQuery(
    @Args({ name: 'createEventQueryInput', type: () => CreateEventQueryInput })
    input: CreateEventQueryInput,
    @CurrentUser()
    user: User,
  ): Promise<EventQuery> {
    return this.queriesService.createEventQuery(input, user.dbId);
  }

  @Query(_returns => EventQueryConnection)
  async getQueries(
    @Args() { after, before, first, last }: PaginationArgs,
    @Args({ name: 'customerId', type: () => ID }) customerId: string,
  ): Promise<EventQueryConnection> {
    const queries = await this.queriesService.getCustomerQueries(customerId);
    // TODO: Default sorting
    const paginatedQueries = await findManyCursor(
      args => {
        return Promise.resolve(paginateArray(queries, args));
      },
      _args => {
        return Promise.resolve(queries.length);
      },
      { first, last, before, after },
    );
    return paginatedQueries;
  }
}
