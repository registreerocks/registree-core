import { mapResults } from './mapResults';
import {
  DetailsDto,
  ResponsesDto,
  ResultsDto,
} from 'src/query-data/dto/query.response';
import { DegreeSelection } from '../models/degree-selection.model';

export const mapSelection = (
  details: DetailsDto[],
  responses: ResponsesDto,
  results: ResultsDto,
): DegreeSelection[] => {
  console.log('results: ', results);
  const mergedResults = mapResults(responses, results);
  return details.map(d => ({
    amount:
      d.absolute > 0 ? { amount: d.absolute } : { percentage: d.percentage },
    degree: { degreeName: d.degree_name, id: d.degree_id },
    results: mergedResults[d.degree_id],
  }));
};
