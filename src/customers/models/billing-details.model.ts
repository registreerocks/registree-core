import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class BillingDetails {
  @Field({ nullable: true })
  city?: string;

  @Field({ nullable: true })
  country?: string;

  @Field({ nullable: true })
  line1?: string;

  @Field({ nullable: true })
  line2?: string;

  @Field({ nullable: true })
  province?: string;

  @Field({ nullable: true })
  zip?: string;

  @Field({ nullable: true })
  vat?: string;
}
