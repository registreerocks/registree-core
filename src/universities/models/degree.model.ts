import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Faculty } from './faculty.model';

@ObjectType()
export class Degree {
  @Field(_type => ID)
  id!: string;

  @Field()
  name!: string;

  @Field()
  description!: string;

  @Field(_type => Faculty)
  faculty!: Faculty;

  @Field()
  level!: string;
}

export type BaseDegree = Omit<Degree, 'faculty'>;
