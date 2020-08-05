import { MetricsDto } from 'src/query-data/dto/query.response';
import { EventMetrics } from '../models/event-metrics.model';

export const mapEventMetrics = (metrics: MetricsDto): EventMetrics => ({
  acceptedCount: metrics.accepted,
  attendedCount: metrics.attended,
  respondedCount: metrics.responded,
  viewedCount: metrics.viewed,
});
