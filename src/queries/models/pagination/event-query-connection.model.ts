import { ObjectType } from '@nestjs/graphql';
import { EventQuery } from '../event-query.model';
import PaginatedResponse from '../../../common/pagination/pagination';

@ObjectType()
export class EventQueryConnection extends PaginatedResponse(EventQuery) {}
