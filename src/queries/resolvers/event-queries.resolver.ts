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
import { PaginationArgs } from 'src/common/pagination/pagination-args';
import { EventQueryConnection } from '../models/pagination/event-query-connection.model';
import { User } from 'src/common/interfaces/user.interface';
import { connectionFromArray } from 'graphql-relay';
import { Quote } from 'src/pricing/models/quote.model';
import { PricingService } from 'src/pricing/pricing.service';
import { Customer } from 'src/customers/models/customer.model';
import { CustomersService } from 'src/customers/customers.service';
import { StudentQueryFilter } from '../dto/student-query-filter.input';

@Resolver(_of => EventQuery)
export class EventQueriesResolver {
  constructor(
    private readonly queriesService: QueriesService,
    private readonly pricingService: PricingService,
    private readonly customersService: CustomersService,
  ) {}

  @Mutation(_returns => EventQuery)
  async createQuery(
    @Args({ name: 'createEventQueryInput', type: () => CreateEventQueryInput })
    input: CreateEventQueryInput,
    @CurrentUser()
    user: User,
  ): Promise<EventQuery> {
    return this.queriesService.createEventQuery(input, user.userId);
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
  ): Promise<EventQueryConnection> {
    const queries = await this.queriesService.getCustomerQueries(customerId);
    // TODO: Default sorting
    const paginatedQueries = connectionFromArray(queries, args);

    return {
      ...paginatedQueries,
      totalCount: queries.length,
    };
  }

  @Query(_returns => EventQueryConnection)
  async getStudentQueries(
    @Args() args: PaginationArgs,
    @CurrentUser() user: User,
    @Args({ name: 'filter', type: () => StudentQueryFilter, nullable: true })
    filter?: StudentQueryFilter,
  ): Promise<EventQueryConnection> {
    const queries = await this.queriesService.getStudentQueries(user.dbId);
    const filteredQueries = queries.filter(
      this.createStudentQueriesPredicate(filter),
    );

    // TODO: Default sorting
    const paginatedQueries = connectionFromArray(filteredQueries, args);

    return {
      ...paginatedQueries,
      totalCount: queries.length,
    };
  }

  private createStudentQueriesPredicate(
    filter?: StudentQueryFilter,
  ): (eventQuery: EventQuery) => boolean {
    const getInvite = (eventQuery: EventQuery) =>
      eventQuery.eventDetails.invites[0];
    if (filter) {
      const acceptedFilter =
        filter.accepted != null
          ? (eq: EventQuery) => getInvite(eq).accepted === filter.accepted
          : _ => true;
      const attendedFilter =
        filter.attended != null
          ? (eq: EventQuery) => getInvite(eq).attended === filter.attended
          : _ => true;
      const respondedFilter =
        filter.responded != null
          ? (eq: EventQuery) => !!getInvite(eq).respondedAt === filter.responded
          : _ => true;
      const viewedFilter =
        filter.viewed != null
          ? (eq: EventQuery) => !!getInvite(eq).viewedAt === filter.viewed
          : _ => true;
      return (eq: EventQuery) =>
        acceptedFilter(eq) &&
        attendedFilter(eq) &&
        respondedFilter(eq) &&
        viewedFilter(eq);
    } else {
      return _ => true;
    }
  }

  @Query(_returns => EventQuery)
  async getQuery(
    @Args({ name: 'id', type: () => ID }) id: string,
  ): Promise<EventQuery> {
    return this.queriesService.getQuery(id);
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

  @ResolveField('customer', _returns => Customer)
  async getCustomerInformation(
    @Parent() eventQuery: EventQuery,
  ): Promise<Customer> {
    const res = await this.customersService.findOneByCustomerId(
      eventQuery.customerId,
    );
    if (res) {
      return res;
    } else {
      throw new Error(
        `Event Query with id: ${eventQuery.id} has an invalid customerId`,
      );
    }
  }
}
