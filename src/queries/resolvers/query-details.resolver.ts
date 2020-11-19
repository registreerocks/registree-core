import { Resolver, Parent, ResolveField, Args } from '@nestjs/graphql';
import { QueryTranscriptConnection } from '../models/pagination/query-transcript-connection.model';
import { QueryDetails } from '../models/query-details.model';
import { PaginationArgs } from 'src/common/pagination/pagination-args';
import _ from 'lodash';
import { Faculty } from 'src/universities/models/faculty.model';
import { FacultiesLoader } from 'src/universities/loaders/faculties.loader';
import DataLoader from 'dataloader';
import { Loader } from 'nestjs-graphql-dataloader';
import { DegreesLoader } from 'src/universities/loaders/degrees.loader';
import { Degree } from 'src/universities/models/degree.model';
import { QueryTranscriptFilter } from '../dto/query-transcript-filter.input';
import { QueryTranscript } from '../models/query-transcript.model';
import { paginateArray } from 'src/common/pagination/paginate-array';

@Resolver(_of => QueryDetails)
export class QueryDetailsResolver {
  @ResolveField('faculties', _returns => [Faculty])
  async getFaculties(
    @Parent() queryDetails: QueryDetails,
    @Loader(FacultiesLoader) facultiesLoader: DataLoader<string, Faculty>,
    @Loader(DegreesLoader) degreesLoader: DataLoader<string, Degree>,
  ): Promise<Faculty[]> {
    const degrees = await degreesLoader.loadMany(
      queryDetails.parameters.map(p => p.degreeId),
    );
    const mappedDegrees = degrees.map(x => {
      if (x instanceof Error) {
        throw x;
      } else {
        if (x.faculty instanceof Faculty) {
          return x.faculty.id;
        } else {
          return x.faculty.toHexString();
        }
      }
    });
    const faculties = await facultiesLoader.loadMany(_.uniq(mappedDegrees));
    const err = faculties.find(f => f instanceof Error);
    if (err) {
      throw err;
    } else {
      return faculties as Faculty[];
    }
  }

  @ResolveField('results', _returns => QueryTranscriptConnection)
  getResults(
    @Args() args: PaginationArgs,
    @Args({ name: 'filter', type: () => QueryTranscriptFilter, nullable: true })
    filter: QueryTranscriptFilter,
    @Parent() queryDetails: QueryDetails,
  ): QueryTranscriptConnection {
    const results = _.orderBy(
      queryDetails.rawResults,
      x => x.degreeAverage,
      'desc',
    ).filter(this.createTranscriptPredicate(filter));

    const paginatedResults = paginateArray(results, args);

    return {
      ...paginatedResults,
      totalCount: results.length,
    };
  }

  private createTranscriptPredicate(filter?: QueryTranscriptFilter) {
    if (filter) {
      const degreeFilter =
        filter.degreeIds != null
          ? (t: QueryTranscript) => filter.degreeIds!.includes(t.degreeId)
          : _ => true;
      const completedFilter =
        filter.degreeCompleted != null
          ? (t: QueryTranscript) => t.degreeCompleted === filter.degreeCompleted
          : _ => true;
      const attendedFilter =
        filter.eventAttended != null
          ? (t: QueryTranscript) =>
              !!t.studentLink.student === filter.eventAttended
          : _ => true;
      return (t: QueryTranscript) =>
        degreeFilter(t) && completedFilter(t) && attendedFilter(t);
    } else {
      return _ => true;
    }
  }
}
