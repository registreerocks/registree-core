import { ObjectType, Int, Field } from '@nestjs/graphql';
import PaginatedResponse from '../../../common/pagination/pagination';
import { QueryTranscript } from '../query-transcript.model';

@ObjectType()
export class QueryTranscriptConnection extends PaginatedResponse(
  QueryTranscript,
) {
  @Field(_type => Int)
  totalCount!: number;
}
