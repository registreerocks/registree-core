import { InputType, Field, GraphQLISODateTime } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { Exclude } from 'class-transformer';

@InputType()
export class UpdateEventInfoInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  address?: string;

  @Field(_type => GraphQLISODateTime, { nullable: true })
  startDate?: Date;

  @Field(_type => GraphQLISODateTime, { nullable: true })
  endDate?: Date;

  @Field({ nullable: true })
  info?: string;

  @Field({ nullable: true })
  message?: string;

  // TODO: Enum or | type
  @Field({ nullable: true })
  eventType?: string;

  @Exclude()
  @Field(_type => [GraphQLUpload], { nullable: true })
  attachments?: Promise<FileUpload>[];

  @Field({ nullable: true })
  password?: string;
}
