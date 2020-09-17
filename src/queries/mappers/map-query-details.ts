import { QueryResponse } from 'src/query-data/dto/query.response';
import { QueryDetails } from '../models/query-details.model';
import { mapQueryResult } from './map-query-results';
import _ from 'lodash';

export const mapQueryDetails = ({
  details,
  results,
  timestamp,
}: QueryResponse): QueryDetails => ({
  parameters: details.map(d => ({
    degreeId: d.degree_id,
    amount:
      d.absolute > 0
        ? { absolute: d.absolute, amountType: 'Absolute' }
        : { percentage: d.percentage, amountType: 'Percentage' },
  })),
  rawResults: _.chain(results).mapValues(mapQueryResult).values().value(),
  updatedAt: new Date(timestamp),
});
