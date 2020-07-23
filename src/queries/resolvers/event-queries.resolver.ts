import { Resolver, Mutation, Args, Query, ID } from '@nestjs/graphql';
import { EventQuery } from '../models/event-query.model';
import { CreateEventQueryInput } from '../dto/create-event-query.input';
import { QueriesService } from '../queries.service';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { PaginationArgs } from 'src/common/pagination/pagination-args';
import { EventQueryConnection } from '../models/pagination/event-query-connection.model';
import { User } from 'src/common/interfaces/user.interface';
import { connectionFromArray } from 'graphql-relay';
import { Quote } from 'src/pricing/models/quote.model';

@Resolver(_of => EventQuery)
export class EventQueriesResolver {
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

  @Query(_returns => Quote)
  async getQuote(
    @Args({ name: 'createEventQueryInput', type: () => CreateEventQueryInput })
    input: CreateEventQueryInput,
  ): Promise<Quote> {
    return this.queriesService.getQuote(input);
  }

  @Query(_returns => EventQueryConnection)
  async getQueries(
    @Args() args: PaginationArgs,
    @Args({ name: 'customerId', type: () => ID }) customerId: string,
  ): Promise<EventQueryConnection> {
    const queries = await this.queriesService.getCustomerQueries(customerId);
    // TODO: Default sorting
    const paginatedQueries = connectionFromArray(queries, args);

    return {
      ...paginatedQueries,
      totalCount: queries.length,
    };
  }
}
