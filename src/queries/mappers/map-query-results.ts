import { ResultDto } from 'src/query-data/dto/query.response';
import { QueryTranscript } from '../models/query-transcript.model';

export const mapQueryResult = (
  result: ResultDto,
  transcriptId: string,
): QueryTranscript => ({
  id: transcriptId,
  degreeId: result.degree_id,
  degreeAverage: parseFloat(result.avg),
  degreeCompleted: result.complete,
  latestTerm: result.term,
  studentLink: {
    id: transcriptId,
  },
});
