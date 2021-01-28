import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Faculty } from './faculty.model';
import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@ObjectType()
@Schema()
export class University extends Document {
  @Field(_type => ID)
  get id(): string {
    return super.id as string;
  }

  @Prop()
  @Field()
  country!: string;

  @Prop()
  @Field()
  name!: string;

  @Prop()
  @Field()
  physicalAddress!: string;

  @Prop()
  @Field()
  shortName!: string;

  @Field(_type => [Faculty])
  faculties!: Faculty[];
}

export const UniversitySchema = SchemaFactory.createForClass(University);
