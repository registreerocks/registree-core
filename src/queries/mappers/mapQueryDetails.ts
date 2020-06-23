import { mapMetrics } from './mapMetrics';
import { mapSelection } from './mapSelection';
import { QueryResponse } from 'src/query-data/dto/query.response';
import { QueryDetails } from '../models/query-details.model';

export const mapQueryDetails = ({
  metrics,
  details,
  responses,
  results,
  timestamp,
}: QueryResponse): QueryDetails => ({
  metrics: mapMetrics(metrics),
  updatedAt: new Date(timestamp),
  selection: mapSelection(details, responses, results),
});
