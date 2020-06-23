import { Resolver, Mutation, Args, Query, ID } from '@nestjs/graphql';
import { EventQuery } from './models/event-query.model';
import { CreateEventQueryInput } from './dto/create-event-query.input';
import { QueriesService } from './queries.service';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { findManyCursor } from 'src/common/pagination/find-many-cursors';
import { PaginationArgs } from 'src/common/pagination/pagination-args';
import _ from 'lodash';
import { EventQueryConnection } from './models/pagination/event-query-connection.model';
import { paginateArray } from 'src/common/pagination/paginate-array';

@Resolver(_of => EventQuery)
export class QueriesResolver {
  constructor(private readonly queriesService: QueriesService) {}

  // @Mutation(_returns => EventQuery)
  // @UseGuards(GqlAuthGuard)
  // async createQuery(
  //   @Args({ name: 'createEventQueryInput', type: () => CreateEventQueryInput })
  //   input: CreateEventQueryInput,
  //   @CurrentUser()
  //   user: Object,
  // ): Promise<EventQuery> {
  //   console.log(user);
  //   //this.queriesService.createEventQuery(input);
  //   // const { createReadStream, filename, mimetype } = await input.flyer!;
  //   // const res = await this.uploadService.saveFile(createReadStream, filename);
  //   return {
  //     id: 'asdf',
  //     file: 'asdf',
  //   };
  // }

  @Query(_returns => EventQueryConnection)
  async getQueries(
    @Args() { after, before, first, last }: PaginationArgs,
    @Args({ name: 'customerId', type: () => ID }) customerId: string,
  ): Promise<EventQueryConnection> {
    const queries = await this.queriesService.getCustomerQueries(customerId);
    console.log(queries.map(q => q.queryDetails.selection));
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
