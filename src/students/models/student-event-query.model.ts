import { Field, ObjectType, ID } from '@nestjs/graphql';
import { StudentEventDetails } from './student-event-details.model';
import { Invitation } from 'src/queries/models/invitation.model';
import { Host } from './host.model';

@ObjectType()
export class StudentEventQuery {
  @Field(_type => ID)
  id!: string;

  @Field(_type => Host)
  host!: Host;

  @Field(_type => StudentEventDetails)
  eventDetails!: StudentEventDetails;

  @Field(_type => Invitation)
  response!: Invitation;
}
