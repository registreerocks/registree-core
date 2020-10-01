import { ObjectType, Field } from '@nestjs/graphql';
import { UploadedFile } from 'src/common/uploaded-file.model';
import { Invitation } from './invitation.model';
import { EventMetrics } from './event-metrics.model';

@ObjectType()
export class EventDetails {
  @Field()
  address!: string;

  @Field()
  startDate!: Date;

  @Field()
  endDate!: Date;

  @Field(_type => [UploadedFile])
  attachments: UploadedFile[] = [];

  @Field()
  information!: string;

  @Field()
  name!: string;

  @Field()
  eventType!: string;

  @Field(_type => [Invitation])
  invites!: Invitation[];

  @Field(_type => EventMetrics)
  metrics!: EventMetrics;

  @Field({ nullable: true })
  password?: string;
}
