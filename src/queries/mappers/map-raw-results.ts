import { mapQueryResult } from './map-query-results';
import _ from 'lodash';
import { QueryTranscript } from '../models/query-transcript.model';
import { ResultsDto, ResponsesDto } from 'src/query-data/dto/query.response';

export const mapRawResults = (
  results: ResultsDto,
  responses: ResponsesDto,
): QueryTranscript[] => {
  const transcripts = _.chain(results)
    .mapValues(mapQueryResult)
    .values()
    .value();
  transcripts.forEach(function (transcript) {
    if (responses[transcript.studentLink.id].student_info) {
      transcript.studentLink.student = {
        userId: responses[transcript.studentLink.id].student_info.user_id,
        studentNumber:
          responses[transcript.studentLink.id].student_info.student_number,
      };
    }
  });
  return transcripts;
};
