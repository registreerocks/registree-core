import { Resolver, Parent, ResolveField } from '@nestjs/graphql';
import { QueryTranscript } from '../models/query-transcript.model';
import { Degree } from 'src/universities/models/degree.model';
import { DegreesLoader } from 'src/universities/loaders/degrees.loader';
import DataLoader from 'dataloader';
import { Loader } from 'nestjs-graphql-dataloader';

@Resolver(_of => QueryTranscript)
export class QueryTranscriptResolver {
  @ResolveField('degree', _returns => Degree)
  async getDegree(
    @Parent() queryTranscript: QueryTranscript,
    @Loader(DegreesLoader) loader: DataLoader<string, Degree>,
  ): Promise<Degree> {
    return loader.load(queryTranscript.degreeId);
  }
}
