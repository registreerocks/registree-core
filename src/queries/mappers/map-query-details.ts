import { QueryResponse } from 'src/query-data/dto/query.response';
import { AcademicYearOfStudy } from '../models/academic-year-of-study.model';
import { QueryDetails } from '../models/query-details.model';
import { mapRawResults } from './map-raw-results';
import { getDegreeAmountAsUnion } from '../../common/amount.union';

export const mapQueryDetails = ({
  details,
  results,
  responses,
  timestamp,
}: QueryResponse): QueryDetails => ({
  parameters: details.map(d => ({
    degreeId: d.degree_id,
    amount: getDegreeAmountAsUnion(d),
  })),
  // TODO(Pi,2021-03-01): Hardcode this for now, until we have real data.
  academicYearOfStudyList: [AcademicYearOfStudy.YEAR_1],
  rawResults: mapRawResults(results, responses),
  updatedAt: new Date(timestamp),
});
