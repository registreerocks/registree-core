import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Faculty } from './faculty.model';

@ObjectType()
export class University {
  @Field(_type => ID)
  id!: string;

  @Field()
  country!: string;

  @Field()
  name!: string;

  @Field()
  physicalAddress!: string;

  @Field()
  shortName!: string;

  @Field(_type => [Faculty])
  faculties!: Faculty[];
}

export type BaseUniversity = Omit<University, 'faculties'>;
