import { ObjectType, Field, ID } from '@nestjs/graphql';
import { University } from './university.model';
import { Degree } from './degree.model';
import { GroupedDegrees } from './grouped-degrees.model';

@ObjectType()
export class Faculty {
  @Field(_type => ID)
  id!: string;

  @Field()
  name!: string;

  @Field()
  description!: string;

  @Field(_type => University)
  university!: University;

  universityId!: string;

  @Field(_type => [GroupedDegrees])
  groupedDegrees!: GroupedDegrees[];

  @Field(_type => [Degree])
  degrees!: Degree[];
}

export type BaseFaculty = Omit<
  Faculty,
  'degrees' | 'groupedDegrees' | 'university'
>;
