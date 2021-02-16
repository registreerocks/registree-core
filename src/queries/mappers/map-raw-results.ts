import _ from 'lodash';
import { ResponsesDto, ResultsDto } from 'src/query-data/dto/query.response';
import { QueryTranscript } from '../models/query-transcript.model';
import { mapQueryResult } from './map-query-results';

export const mapRawResults = (
  results: ResultsDto,
  responses: ResponsesDto,
): QueryTranscript[] => {
  const transcripts = _.chain(results)
    .mapValues(mapQueryResult)
    .values()
    .value();
  transcripts.forEach(function (transcript) {
    const transcriptId: string = transcript.studentLink.id;
    const studentResponse = responses[transcriptId];
    if (studentResponse === undefined) {
      throw new Error(
        [
          'mapRawResults: missing response for transcript',
          JSON.stringify({ transcript }),
          JSON.stringify({ responses }),
        ].join('\n'),
      );
    }
    if (studentResponse.student_info) {
      transcript.studentLink.student = {
        userId: studentResponse.student_info.user_id,
        studentNumber: studentResponse.student_info.student_number,
      };
    }
  });
  return transcripts;
};
