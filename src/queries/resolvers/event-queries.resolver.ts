import {
  Resolver,
  Mutation,
  Args,
  Query,
  ID,
  Parent,
  ResolveField,
  Float,
} from '@nestjs/graphql';
import { EventQuery } from '../models/event-query.model';
import { CreateEventQueryInput } from '../dto/create-event-query.input';
import { ExpandEventQueryInput } from '../dto/expand-event-query.input';
import { QueriesService } from '../queries.service';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { UnauthorizedException } from '@nestjs/common';
import { PaginationArgs } from 'src/common/pagination/pagination-args';
import { EventQueryConnection } from '../models/pagination/event-query-connection.model';
import { User } from 'src/common/interfaces/user.interface';
import { connectionFromArray } from 'graphql-relay';
import { Quote } from 'src/pricing/models/quote.model';
import { PricingService } from 'src/pricing/pricing.service';

@Resolver(_of => EventQuery)
export class EventQueriesResolver {
  constructor(
    private readonly queriesService: QueriesService,
    private readonly pricingService: PricingService,
  ) {}

  @Mutation(_returns => EventQuery)
  async createQuery(
    @Args({ name: 'createEventQueryInput', type: () => CreateEventQueryInput })
    input: CreateEventQueryInput,
    @CurrentUser()
    user: User,
  ): Promise<EventQuery> {
    return this.queriesService.createEventQuery(input, user.dbId);
  }

  @Mutation(_returns => EventQuery)
  async expandQuery(
    @Args({ name: 'queryId', type: () => ID })
    queryId: string,
    @Args({ name: 'expandEventQueryInput', type: () => ExpandEventQueryInput })
    input: ExpandEventQueryInput,
  ): Promise<EventQuery> {
    return this.queriesService.expandEventQuery(queryId, input);
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
    @CurrentUser() user: User,
  ): Promise<EventQueryConnection> {
    if (user.dbId === customerId) {
      const queries = await this.queriesService.getCustomerQueries(customerId);
      // TODO: Default sorting
      const paginatedQueries = connectionFromArray(queries, args);

      return {
        ...paginatedQueries,
        totalCount: queries.length,
      };
    } else {
      throw new UnauthorizedException();
    }
  }

  @Query(_returns => EventQuery)
  async getQuery(
    @Args({ name: 'id', type: () => ID }) id: string,
    @CurrentUser() user: User,
  ): Promise<EventQuery> {
    const query = await this.queriesService.getQuery(id);
    // TODO: Move the Authorization into a different layer
    if (query.customerId === user.dbId) {
      return query;
    } else {
      throw new UnauthorizedException();
    }
  }

  @ResolveField('quoteDetails', _returns => Quote)
  getQuoteDetails(@Parent() eventQuery: EventQuery): Quote {
    return this.pricingService.getQuote(eventQuery.eventDetails.invites.length);
  }

  @ResolveField('currentPrice', _returns => Float)
  getCurrentPrice(@Parent() eventQuery: EventQuery): number {
    return this.pricingService.calculatePrice(
      eventQuery.eventDetails.metrics.acceptedCount,
    );
  }
}
