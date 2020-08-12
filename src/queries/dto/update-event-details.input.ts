import { InputType, Field, GraphQLISODateTime } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { IsNotEmpty } from 'class-validator';
import { Exclude } from 'class-transformer';

@InputType()
export class UpdateEventDetailsInput {
  @Field()
  @IsNotEmpty()
  name?: string;

  @Field()
  @IsNotEmpty()
  address?: string;

  @Field(_type => GraphQLISODateTime)
  startDate?: Date;

  @Field(_type => GraphQLISODateTime)
  endDate?: Date;

  @Field()
  @IsNotEmpty()
  info?: string;

  @Field()
  @IsNotEmpty()
  message?: string;

  // TODO: Enum or | type
  @Field()
  @IsNotEmpty()
  eventType?: string;

  @Exclude()
  @Field(_type => [GraphQLUpload], { nullable: true })
  attachments?: Promise<FileUpload>[];

  @Field()
  @IsNotEmpty()
  password?: string;
}
