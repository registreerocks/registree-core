import { QueryResponse } from 'src/query-data/dto/query.response';
import { QueryDetails } from '../models/query-details.model';
import { mapRawResults } from './map-raw-results';

export const mapQueryDetails = ({
  details,
  results,
  responses,
  timestamp,
}: QueryResponse): QueryDetails => ({
  parameters: details.map(d => ({
    degreeId: d.degree_id,
    amount:
      d.absolute > 0
        ? { absolute: d.absolute, amountType: 'Absolute' }
        : { percentage: d.percentage, amountType: 'Percentage' },
  })),
  rawResults: mapRawResults(results, responses),
  updatedAt: new Date(timestamp),
});
