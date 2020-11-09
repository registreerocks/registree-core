import { ObjectType, Field } from '@nestjs/graphql';
import { InvitationState } from './invitation-state.enum';

@ObjectType()
export class Invitation {
  @Field()
  accepted!: boolean;

  @Field()
  attended!: boolean;

  @Field({ nullable: true })
  respondedAt?: Date;

  @Field({ nullable: true })
  sentAt?: Date;

  @Field({ nullable: true })
  viewedAt?: Date;

  @Field({ nullable: true })
  email?: string;

  @Field(_type => InvitationState)
  invitationState?: InvitationState;

  transcriptId!: string;
}
