import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class UploadedFile {
  @Field()
  filename!: string;
  @Field()
  mimetype!: string;
  @Field()
  url!: string;
}
