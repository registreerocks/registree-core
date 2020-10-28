import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class StudentQueryFilter {
  @Field({ nullable: true })
  accepted?: boolean;

  @Field({ nullable: true })
  attended?: boolean;

  @Field({ nullable: true })
  responded?: boolean;

  @Field({ nullable: true })
  viewed?: boolean;
}
