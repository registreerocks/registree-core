import { Resolver, Parent, ResolveField, Args } from '@nestjs/graphql';
import { QueryTranscriptConnection } from '../models/pagination/query-transcript-connection.model';
import { QueryDetails } from '../models/query-details.model';
import { connectionFromArray } from 'graphql-relay';
import { PaginationArgs } from 'src/common/pagination/pagination-args';

@Resolver(_of => QueryDetails)
export class QueryDetailsResolver {
  @ResolveField('results', _returns => QueryTranscriptConnection)
  getResults(
    @Args() args: PaginationArgs,
    @Parent() queryDetails: QueryDetails,
  ): QueryTranscriptConnection {
    const paginatedResults = connectionFromArray(queryDetails.rawResults, args);

    return {
      ...paginatedResults,
      totalCount: queryDetails.rawResults.length,
    };
  }
}
