import { InputType, Field, GraphQLISODateTime } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { DegreeInput } from './degree.input';
import { ValidateNested, IsNotEmpty } from 'class-validator';
import { Type, Exclude } from 'class-transformer';

@InputType()
export class CreateEventQueryInput {
  @Field()
  @IsNotEmpty()
  name!: string;

  @Field()
  @IsNotEmpty()
  address!: string;

  @Field(_type => GraphQLISODateTime)
  startDate!: Date;

  @Field(_type => GraphQLISODateTime)
  endDate!: Date;

  @Field()
  @IsNotEmpty()
  information!: string;

  @Field()
  message?: string;

  @Field(_type => [DegreeInput])
  @ValidateNested()
  @Type(_of => DegreeInput)
  degrees!: DegreeInput[];

  // TODO: Enum or | type
  @Field()
  @IsNotEmpty()
  eventType!: string;

  @Exclude()
  @Field(_type => [GraphQLUpload], { nullable: true })
  attachments?: Promise<FileUpload>[];

  @Field({ nullable: true })
  password?: string;
}
