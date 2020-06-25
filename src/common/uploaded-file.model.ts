import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class UploadedFile {
  @Field(_type => ID)
  id!: string;
  @Field()
  filename!: string;
  @Field()
  mimetype!: string;
  @Field()
  url!: string;
}
