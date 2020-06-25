import {
  ResponsesDto,
  ResultsDto,
  ResultDto,
  ResponseDto,
} from 'src/query-data/dto/query.response';
import { Result } from '../models/result.model';
import _ from 'lodash';

export const mapResults = (
  responsesDto: ResponsesDto,
  resultsDto: ResultsDto,
): { [degreeId: string]: Result[] } =>
  _.chain(responsesDto)
    .merge(resultsDto)
    .mapValues(mapResult)
    .groupBy(x => x.degreeId)
    .mapValues(group => group.map(r => r as Result) || [])
    .value();

const mapResult = (
  value: ResultDto & ResponseDto,
  transcriptId: string,
): Result & { degreeId: string } => ({
  degreeId: value.degree_id,
  invite: {
    accepted: value.accepted,
    attended: value.attended,
    respondedAt: new Date(value.responded),
    sentAt: new Date(value.sent),
    viewedAt: new Date(value.viewed),
  },
  transcript: {
    id: transcriptId,
    degreeAverage: parseFloat(value.avg),
    degreeCompleted: value.complete,
    latestTerm: value.term,
  },
  studentInformation: value.student_info
    ? {
        firstName: value.student_info.first_name,
        lastName: value.student_info.last_name,
        studentId: value.student_info.student_id,
      }
    : undefined,
});
