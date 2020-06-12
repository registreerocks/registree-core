import { InputType, Field, GraphQLISODateTime } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { DegreeInput } from './degree.input';
import { ValidateNested, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

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
  info!: string;

  @Field()
  @IsNotEmpty()
  message!: string;

  @Field(_type => [DegreeInput])
  @ValidateNested()
  @Type(_of => DegreeInput)
  degrees!: DegreeInput[];

  // TODO: Enum or | type
  @Field()
  @IsNotEmpty()
  eventType!: string;

  @Field(_type => GraphQLUpload, { nullable: true })
  flyer?: FileUpload;
}
