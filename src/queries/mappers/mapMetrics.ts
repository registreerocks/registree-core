import { MetricsDto } from 'src/query-data/dto/query.response';
import { QueryMetrics } from '../models/query-metrics.model';

export const mapMetrics = (metrics: MetricsDto): QueryMetrics => ({
  acceptedCount: metrics.accepted,
  attendedCount: metrics.attended,
  respondedCount: metrics.responded,
  viewedCount: metrics.viewed,
});
