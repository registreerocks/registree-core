import { ObjectType, Field } from '@nestjs/graphql';
import { UploadedFile } from 'src/common/uploaded-file.model';

@ObjectType()
export class Event {
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

  @Field()
  password!: string;
}
