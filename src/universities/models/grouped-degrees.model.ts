import { ObjectType, Field } from '@nestjs/graphql';
import { Degree } from './degree.model';

@ObjectType()
export class GroupedDegrees {
  @Field()
  name!: string;

  @Field(_type => [Degree])
  degrees!: Degree[];
}
